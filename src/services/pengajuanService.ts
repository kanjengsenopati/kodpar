import { Pengajuan, PersyaratanDokumen, PengajuanHistory, SubmissionResult } from "@/types";
import { db } from "@/db/db";
import { getAnggotaById } from "./anggotaService";
import { calculateTotalSimpanan } from "./transaksiService";
import { createTransactionWithSync } from "./transaksi/operations/transactionCore";
import { calculateLoanDetails, generateLoanDescription } from "../utils/loanCalculations";
import { ensureAutoDeductionCategories } from "./keuangan/baseService";
import { centralizedSync } from "./sync/centralizedSyncService";
import { getCurrentUser } from "./auth/sessionManagement";
import * as IdUtils from "../utils/idUtils";

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
 * Generate a new human-readable pengajuan reference number
 */
export async function generatePengajuanNumber(): Promise<string> {
  const pengajuanList = await db.table('pengajuan').toArray();
  const today = new Date();
  
  const existingNumbers = pengajuanList
    .map(p => IdUtils.extractNumericSuffix(p.nomorPengajuan || p.id))
    .filter(n => !isNaN(n));
    
  const lastSeq = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  
  return IdUtils.formatReferenceNumber({
    prefix: "PG",
    year: today.getFullYear(),
    sequence: lastSeq + 1
  });
}

/**
 * Create a new pengajuan
 */
export async function createPengajuan(
  pengajuan: Omit<Pengajuan, "id" | "nomorPengajuan" | "createdAt" | "updatedAt"> & { dokumen?: PersyaratanDokumen[] }
): Promise<Pengajuan | null> {
  const anggota = await getAnggotaById(pengajuan.anggotaId);
  if (!anggota) return null;
  
  const id = IdUtils.generateUUIDv7();
  const nomorPengajuan = await generatePengajuanNumber();
  const now = new Date().toISOString();
  
  const history: PengajuanHistory[] = [
    {
      id: IdUtils.generateUUIDv7(),
      tanggal: now,
      aksi: "Diajukan",
      oleh: `Anggota (${anggota.nama})`,
      keterangan: "Pengajuan baru dibuat via sistem"
    }
  ];

  const newPengajuan: Pengajuan = {
    ...pengajuan,
    id,
    nomorPengajuan,
    history,
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
 * STRICT ATOMIC: Approve a pengajuan and convert to transaction in a single commit
 */
export async function approvePengajuan(id: string): Promise<SubmissionResult<Pengajuan>> {
  try {
    // 1. EXECUTE GLOBAL ATOMIC TRANSACTION
    // This transaction covers the Application state, the Financial Transaction, 
    // and the Accounting Journal (via createTransactionWithSync internal logic)
    const result = await db.transaction('rw', [db.pengajuan, db.transaksi, db.jurnal, db.anggota, db.audit_log], async () => {
      const pengajuan = await db.pengajuan.get(id);
      if (!pengajuan) {
        throw new Error("Pengajuan tidak ditemukan");
      }

      if (pengajuan.status !== "Menunggu") {
        throw new Error("Pengajuan sudah diproses");
      }

      // --- A. Domain Validation ---
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
          throw new Error(`Aturan Penarikan Dilanggar: Maksimal ${maxAllowedByRule.toLocaleString('id-ID')}`);
        }
      }

      // --- B. Generate Final Description ---
      let finalKeterangan = `Dari Pengajuan #${pengajuan.id}: ${pengajuan.keterangan || ""}`.trim();
      if (pengajuan.jenis === "Pinjam") {
        const tenor = (pengajuan as any).tenor;
        const loanCalculation = calculateLoanDetails(pengajuan.kategori!, pengajuan.jumlah, tenor);
        finalKeterangan = generateLoanDescription(loanCalculation, finalKeterangan);
      }

      // --- C. Create Transaction via ATOMIC ENGINE ---
      const txResult = await createTransactionWithSync({
        tanggal: pengajuan.tanggal,
        anggotaId: pengajuan.anggotaId,
        jenis: pengajuan.jenis,
        jumlah: pengajuan.jumlah,
        kategori: pengajuan.kategori,
        keterangan: finalKeterangan,
        status: "Sukses",
        referensiPinjamanId: pengajuan.referensiPinjamanId,
        nominalPokok: pengajuan.nominalPokok,
        nominalJasa: pengajuan.nominalJasa,
        tenor: (pengajuan as any).tenor
      });

      if (!txResult.success || !txResult.data) {
        throw new Error(txResult.error || "Gagal membuat transaksi finansial");
      }

      const createdTransaction = txResult.data;
      const user = getCurrentUser();
      const now = new Date().toISOString();

      // --- D. Update Application State ---
      const newHistoryEntry: PengajuanHistory = {
        id: IdUtils.generateUUIDv7(),
        tanggal: now,
        aksi: "Disetujui",
        oleh: user?.name || "Admin",
        keterangan: "Disetujui (Atomic SAK-EP)"
      };

      const updatedPengajuan: Pengajuan = {
        ...pengajuan,
        status: "Disetujui",
        history: [...(pengajuan.history || []), newHistoryEntry],
        updatedAt: now
      };

      await db.pengajuan.put(updatedPengajuan);

      // --- E. Side Effects (Schedule generation) ---
      if (pengajuan.jenis === "Pinjam") {
        const { generateInitialSchedule } = await import("./transaksi/installmentScheduleService");
        await generateInitialSchedule(createdTransaction);
      }

      if (pengajuan.jenis === "Angsuran") {
        const { linkPaymentToSchedule } = await import("./transaksi/installmentScheduleService");
        await linkPaymentToSchedule(createdTransaction);
      }

      return { success: true, data: updatedPengajuan };
    });

    return result as SubmissionResult<Pengajuan>;
  } catch (error: any) {
    console.error("❌ SAK-EP APPROVAL REJECTED (ROLLBACK):", error);
    return { success: false, error: error.message || "Gagal menyetujui pengajuan" };
  }
}

/**
 * Reject a pengajuan with atomic history update
 */
export async function rejectPengajuan(id: string, alasan: string = "Ditolak oleh admin"): Promise<SubmissionResult<Pengajuan>> {
  try {
    const result = await db.transaction('rw', [db.pengajuan], async () => {
      const pengajuan = await db.pengajuan.get(id);
      if (!pengajuan || pengajuan.status !== "Menunggu") {
        throw new Error("Pengajuan tidak ditemukan atau sudah diproses");
      }

      const user = getCurrentUser();
      const now = new Date().toISOString();

      const newHistoryEntry: PengajuanHistory = {
        id: IdUtils.generateUUIDv7(),
        tanggal: now,
        aksi: "Ditolak",
        oleh: user?.name || "Admin",
        keterangan: alasan
      };

      const updatedPengajuan: Pengajuan = {
        ...pengajuan,
        status: "Ditolak",
        alasanPenolakan: alasan,
        history: [...(pengajuan.history || []), newHistoryEntry],
        updatedAt: now
      };

      await db.pengajuan.put(updatedPengajuan);
      return { success: true, data: updatedPengajuan };
    });

    if (result.success && result.data) {
      window.dispatchEvent(new CustomEvent('pengajuan-rejected', {
        detail: {
          pengajuan: result.data,
          timestamp: new Date().toISOString()
        }
      }));
    }

    return result as SubmissionResult<Pengajuan>;
  } catch (error: any) {
    console.error("Error rejecting pengajuan:", error);
    return { success: false, error: error.message || "Gagal menolak pengajuan" };
  }
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
