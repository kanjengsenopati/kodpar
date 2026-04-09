import { Pengajuan, PersyaratanDokumen } from "@/types";
import { db } from "@/db/db";
import { getAnggotaById } from "./anggotaService";
import { createTransaksi } from "./transaksiService";
import { calculateTotalSimpanan } from "./transaksiService";
import { calculateLoanDetails, generateLoanDescription } from "../utils/loanCalculations";
import { ensureAutoDeductionCategories } from "./keuangan/baseService";
import { centralizedSync } from "./sync/centralizedSyncService";
import { getCurrentUser } from "./auth/sessionManagement";

/**
 * Get all pengajuan from IndexedDB
 */
export async function getPengajuanList(): Promise<Pengajuan[]> {
  const user = getCurrentUser();
  const isAnggota = user?.roleId === "role_anggota" || user?.roleId === "anggota";
  
  const data = await db.table('pengajuan').toArray();
  
  if (isAnggota && user?.anggotaId) {
    return data.filter(p => p.anggotaId === user.anggotaId);
  }
  
  return data || [];
}

/**
 * Get pengajuan by ID
 */
export async function getPengajuanById(id: string): Promise<Pengajuan | undefined> {
  const user = getCurrentUser();
  const isAnggota = user?.roleId === "role_anggota" || user?.roleId === "anggota";
  
  const pengajuan = await db.table('pengajuan').get(id);
  if (isAnggota && user?.anggotaId && pengajuan?.anggotaId !== user.anggotaId) {
    console.warn(`An anggota (${user.anggotaId}) tried to access another user's application (${id})`);
    return undefined;
  }
  
  return pengajuan;
}

/**
 * Get pengajuan by anggota ID
 */
export async function getPengajuanByAnggotaId(anggotaId: string): Promise<Pengajuan[]> {
  return await db.table('pengajuan').where('anggotaId').equals(anggotaId).toArray();
}

/**
 * Generate a new pengajuan ID
 */
export async function generatePengajuanId(): Promise<string> {
  const pengajuanList = await getPengajuanList();
  const lastId = pengajuanList.length > 0 
    ? parseInt(pengajuanList[pengajuanList.length - 1].id.replace("PG", "")) 
    : 0;
  return `PG${String(lastId + 1).padStart(4, "0")}`;
}

/**
 * Create a new pengajuan
 */
export async function createPengajuan(
  pengajuan: Omit<Pengajuan, "id" | "anggotaNama" | "createdAt" | "updatedAt"> & { dokumen?: PersyaratanDokumen[] }
): Promise<Pengajuan | null> {
  const anggota = await getAnggotaById(pengajuan.anggotaId);
  if (!anggota) return null;
  
  const id = await generatePengajuanId();
  const now = new Date().toISOString();
  
  const newPengajuan: Pengajuan = {
    ...pengajuan,
    id,
    anggotaNama: anggota.nama,
    createdAt: now,
    updatedAt: now,
  };
  
  await db.table('pengajuan').add(newPengajuan);
  return newPengajuan;
}

/**
 * Update an existing pengajuan
 */
export async function updatePengajuan(
  id: string, 
  pengajuan: Partial<Pengajuan & { dokumen?: PersyaratanDokumen[] }>
): Promise<Pengajuan | null> {
  const existing = await db.table('pengajuan').get(id);
  if (!existing) return null;
  
  if (pengajuan.anggotaId) {
    const anggota = await getAnggotaById(pengajuan.anggotaId);
    if (!anggota) return null;
    pengajuan.anggotaNama = anggota.nama;
  }
  
  const updated: Pengajuan = {
    ...existing,
    ...pengajuan,
    updatedAt: new Date().toISOString(),
  };
  
  await db.table('pengajuan').put(updated);
  return updated;
}

/**
 * Delete a pengajuan by ID
 */
export async function deletePengajuan(id: string): Promise<boolean> {
  const existing = await db.table('pengajuan').get(id);
  if (!existing) return false;
  
  await db.table('pengajuan').delete(id);
  return true;
}

import { getPengaturan } from "./pengaturanService";

/**
 * Approve a pengajuan dan convert ke transaction dengan centralized sync
 * Menggunakan Dexie transaction untuk memastikan atomisitas
 */
export async function approvePengajuan(id: string): Promise<boolean> {
  const pengajuan = await db.pengajuan.get(id);
  if (!pengajuan || pengajuan.status !== "Menunggu") return false;
  
  try {
    // Perform all database operations inside a single transaction
    // MUST include all tables accessed: pengajuan, transaksi, jurnal, anggota, coa
    return await db.transaction('rw', [db.pengajuan, db.transaksi, db.jurnal, db.anggota, db.coa], async () => {
      // 1. Custom validation rules for Penarikan (Withdrawal)
      if (pengajuan.jenis === "Penarikan") {
        const settings = getPengaturan();
        const availableBalance = await calculateTotalSimpanan(pengajuan.anggotaId);
        
        let minRequired = 0;
        if (settings.penarikan) {
          if (settings.penarikan.minPreservedBalanceType === "fixed") {
            minRequired = settings.penarikan.minPreservedBalanceValue;
          } else {
            minRequired = (availableBalance * settings.penarikan.minPreservedBalanceValue) / 100;
          }
        }

        let maxAllowedByRule = availableBalance - minRequired;
        if (settings.penarikan) {
          let maxRule = 0;
          if (settings.penarikan.maxWithdrawalType === "fixed") {
            maxRule = settings.penarikan.maxWithdrawalValue;
          } else {
            maxRule = (availableBalance * settings.penarikan.maxWithdrawalValue) / 100;
          }
          maxAllowedByRule = Math.min(maxAllowedByRule, maxRule);
        }

        if (pengajuan.jumlah > maxAllowedByRule) {
          // Use a specific error message that can be caught or logged
          throw new Error(`Aturan Penarikan Dilanggar: Maksimal yang bisa ditarik adalah ${maxAllowedByRule.toLocaleString('id-ID')}`);
        }
      }
      
      // 2. Prepare Transaction Data
      if (pengajuan.jenis === "Pinjam") {
        await ensureAutoDeductionCategories();
      }
      
      let finalKeterangan = `Dari Pengajuan #${pengajuan.id}: ${pengajuan.keterangan || ""}`.trim();
      
      if (pengajuan.jenis === "Pinjam") {
        const tenor = (pengajuan as any).tenor;
        const loanCalculation = calculateLoanDetails(pengajuan.kategori!, pengajuan.jumlah, tenor);
        finalKeterangan = generateLoanDescription(loanCalculation, finalKeterangan);
      } else if (pengajuan.jenis === "Angsuran" && pengajuan.referensiPinjamanId) {
        finalKeterangan = `${finalKeterangan} (Ref Pinjaman: ${pengajuan.referensiPinjamanId})`.trim();
      }
      
      // 3. Create the Transaction first
      const transaction = await createTransaksi({
        tanggal: pengajuan.tanggal,
        anggotaId: pengajuan.anggotaId,
        jenis: pengajuan.jenis,
        jumlah: pengajuan.jumlah,
        kategori: pengajuan.kategori,
        keterangan: finalKeterangan,
        status: "Sukses"
      });
      
      if (!transaction) {
        throw new Error("Gagal membuat transaksi finansial");
      }
      
      // 4. Update Application Status only after transaction is ready
      const updatedPengajuan = await updatePengajuan(id, { status: "Disetujui" });
      if (!updatedPengajuan) {
        throw new Error("Gagal memperbarui status pengajuan");
      }
      
      // 5. Success - centralized sync will happen automatically 
      // via the 'transaction-created' event sparked by createTransaksi
      
      window.dispatchEvent(new CustomEvent('pengajuan-approved', {
        detail: { 
          pengajuan: updatedPengajuan,
          transaction: transaction,
          timestamp: new Date().toISOString()
        }
      }));
      
      return true;
    });
  } catch (error: any) {
    console.error("❌ Approval transaction failed:", error);
    // Rethrow or return false - here we return false as the UI expects a boolean success flag
    return false;
  }
}

/**
 * Reject a pengajuan
 */
export async function rejectPengajuan(id: string): Promise<boolean> {
  const pengajuan = await getPengajuanById(id);
  if (!pengajuan || pengajuan.status !== "Menunggu") return false;
  
  const updatedPengajuan = await updatePengajuan(id, { status: "Ditolak" });
  
  if (updatedPengajuan) {
    window.dispatchEvent(new CustomEvent('pengajuan-rejected', {
      detail: { 
        pengajuan: updatedPengajuan,
        timestamp: new Date().toISOString()
      }
    }));
  }
  
  return !!updatedPengajuan;
}

/**
 * Get pengajuan by status
 */
export async function getPengajuanByStatus(status: "Menunggu" | "Disetujui" | "Ditolak"): Promise<Pengajuan[]> {
  return await db.table('pengajuan').where('status').equals(status).toArray();
}

/**
 * Get pengajuan by jenis
 */
export async function getPengajuanByJenis(jenis: "Simpan" | "Pinjam" | "Penarikan" | "Angsuran"): Promise<Pengajuan[]> {
  const user = getCurrentUser();
  const isAnggota = user?.roleId === "role_anggota" || user?.roleId === "anggota";
  
  const data = await db.table('pengajuan').where('jenis').equals(jenis).toArray();
  
  if (isAnggota && user?.anggotaId) {
    return data.filter(p => p.anggotaId === user.anggotaId);
  }
  
  return data;
}


