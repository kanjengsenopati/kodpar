import { Pengajuan, PersyaratanDokumen } from "@/types";
import { db } from "@/db/db";
import { getAnggotaById } from "./anggotaService";
import { createTransaksi } from "./transaksiService";
import { calculateTotalSimpanan } from "./transaksi/financialOperations";
import { calculateLoanDetails, generateLoanDescription } from "../utils/loanCalculations";
import { ensureAutoDeductionCategories } from "./keuangan/baseService";
import { centralizedSync } from "./sync/centralizedSyncService";

/**
 * Get all pengajuan from IndexedDB
 */
export async function getPengajuanList(): Promise<Pengajuan[]> {
  const data = await db.table('pengajuan').toArray();
  return data || [];
}

/**
 * Get pengajuan by ID
 */
export async function getPengajuanById(id: string): Promise<Pengajuan | undefined> {
  return await db.table('pengajuan').get(id);
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

/**
 * Approve a pengajuan dan convert ke transaction dengan centralized sync
 */
export async function approvePengajuan(id: string): Promise<boolean> {
  const pengajuan = await getPengajuanById(id);
  if (!pengajuan || pengajuan.status !== "Menunggu") return false;
  
  if (pengajuan.jenis === "Penarikan") {
    const availableBalance = await calculateTotalSimpanan(pengajuan.anggotaId);
    if (pengajuan.jumlah > availableBalance) {
      console.error(`Insufficient balance for withdrawal. Requested: ${pengajuan.jumlah}, Available: ${availableBalance}`);
      return false;
    }
  }
  
  if (pengajuan.jenis === "Pinjam") {
    await ensureAutoDeductionCategories();
  }
  
  const updatedPengajuan = await updatePengajuan(id, { status: "Disetujui" });
  if (!updatedPengajuan) return false;
  
  let finalKeterangan = `Dari Pengajuan #${pengajuan.id}: ${pengajuan.keterangan || ""}`.trim();
  
  if (pengajuan.jenis === "Pinjam") {
    const tenor = (pengajuan as any).tenor;
    const loanCalculation = calculateLoanDetails(pengajuan.kategori, pengajuan.jumlah, tenor);
    finalKeterangan = generateLoanDescription(loanCalculation, finalKeterangan);
  }
  
  const transaction = await createTransaksi({
    tanggal: pengajuan.tanggal,
    anggotaId: pengajuan.anggotaId,
    jenis: pengajuan.jenis,
    jumlah: pengajuan.jumlah,
    kategori: pengajuan.kategori,
    keterangan: finalKeterangan,
    status: "Sukses"
  });
  
  if (transaction) {
    console.log(`🔄 Triggering centralized sync for approved pengajuan ${id}`);
    const syncResult = await centralizedSync.syncPengajuan(updatedPengajuan);
    
    if (syncResult.success) {
      console.log(`✅ Centralized pengajuan sync completed for ${id}: ${syncResult.message}`);
    }
    
    window.dispatchEvent(new CustomEvent('pengajuan-approved', {
      detail: { 
        pengajuan: updatedPengajuan,
        transaction: transaction,
        timestamp: new Date().toISOString()
      }
    }));
  }
  
  return !!transaction;
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
export async function getPengajuanByJenis(jenis: "Simpan" | "Pinjam" | "Penarikan"): Promise<Pengajuan[]> {
  return await db.table('pengajuan').where('jenis').equals(jenis).toArray();
}
