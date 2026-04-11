import { Pengajuan, PersyaratanDokumen } from "@/types";
import { db } from "@/db/db";
import { getAnggotaById } from "./anggotaService";
import { createTransaksi } from "./transaksiService";
import { calculateTotalSimpanan } from "./transaksiService";
import { calculateLoanDetails, generateLoanDescription } from "../utils/loanCalculations";
import { ensureAutoDeductionCategories } from "./keuangan/baseService";
import { centralizedSync } from "./sync/centralizedSyncService";
import { getCurrentUser } from "./auth/sessionManagement";
import { generateUUIDv7, formatReferenceNumber, extractNumericSuffix } from "../utils/idUtils";

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
    .map(p => extractNumericSuffix(p.nomorPengajuan || p.id))
    .filter(n => !isNaN(n));
    
  const lastSeq = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  
  return formatReferenceNumber({
    prefix: "PG",
    year: today.getFullYear(),
    sequence: lastSeq + 1
  });
}

/**
 * Create a new pengajuan
 */
export async function createPengajuan(
  pengajuan: Omit<Pengajuan, "id" | "nomorPengajuan" | "anggotaNama" | "createdAt" | "updatedAt"> & { dokumen?: PersyaratanDokumen[] }
): Promise<Pengajuan | null> {
  const anggota = await getAnggotaById(pengajuan.anggotaId);
  if (!anggota) return null;
  
  const id = generateUUIDv7();
  const nomorPengajuan = await generatePengajuanNumber();
  const now = new Date().toISOString();
  
  const history: PengajuanHistory[] = [
    {
      id: generateUUIDv7(),
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
    anggotaNo: anggota.noAnggota,
    anggotaNama: anggota.nama,
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
    // ── Phase 1: Validation ───────────────────────────────────────────────────
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
        throw new Error(`Aturan Penarikan Dilanggar: Maksimal yang bisa ditarik adalah ${maxAllowedByRule.toLocaleString('id-ID')}`);
      }
    }

    // Pre-load async data BEFORE any DB writes
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

    // ── Phase 2: Core writes — NO explicit db.transaction() wrapper ───────────
    // Each Dexie call uses its own implicit auto-commit transaction.
    // Wrapping with db.transaction() conflicts with createTransactionWithSync
    // which internally opens its own db.transaction(), causing nested transaction errors.
    const result = await createTransaksi({
      tanggal: pengajuan.tanggal,
      anggotaId: pengajuan.anggotaId,
      jenis: pengajuan.jenis,
      jumlah: pengajuan.jumlah,
      kategori: pengajuan.kategori,
      keterangan: finalKeterangan,
      status: "Sukses",
      referensiPinjamanId: pengajuan.referensiPinjamanId,
      nominalPokok: pengajuan.nominalPokok,
      nominalJasa: pengajuan.nominalJasa
    });

    if (!result.success || !result.data) {
      throw new Error(result.error || "Gagal membuat transaksi finansial");
    }

    const createdTransaction = result.data;
    const user = getCurrentUser();
    const now = new Date().toISOString();

    const newHistoryEntry: PengajuanHistory = {
      id: generateUUIDv7(),
      tanggal: now,
      aksi: "Disetujui",
      oleh: user?.name || "Admin",
      keterangan: "Pengajuan disetujui dan transaksi finansial dibuat"
    };

    // Update pengajuan status (independent auto-commit)
    await db.pengajuan.update(id, {
      status: "Disetujui",
      history: [...(pengajuan.history || []), newHistoryEntry],
      updatedAt: now
    });

    // ── Phase 3: Post-commit side effects (non-fatal, won't block UI success) ─
    try {
      if (pengajuan.jenis === "Pinjam") {
        const { generateInitialSchedule } = await import("./transaksi/installmentScheduleService");
        await generateInitialSchedule(createdTransaction);
      }
      if (pengajuan.jenis === "Angsuran") {
        const { linkPaymentToSchedule } = await import("./transaksi/installmentScheduleService");
        await linkPaymentToSchedule(createdTransaction);
      }
    } catch (scheduleErr) {
      // Schedule generation failure is non-fatal: the core approval is done.
      console.warn("⚠️ Schedule generation warning (non-fatal):", scheduleErr);
    }

    window.dispatchEvent(new CustomEvent('pengajuan-approved', {
      detail: {
        pengajuanId: id,
        transaction: createdTransaction,
        timestamp: new Date().toISOString()
      }
    }));

    return true;

  } catch (error: any) {
    console.error("❌ Approval failed:", error);
    return false;
  }
}



/**
 * Reject a pengajuan
 */
export async function rejectPengajuan(id: string, alasan: string): Promise<boolean> {
  const pengajuan = await getPengajuanById(id);
  if (!pengajuan || pengajuan.status !== "Menunggu") return false;
  
  const user = getCurrentUser();
  const now = new Date().toISOString();

  const newHistoryEntry: PengajuanHistory = {
    id: generateUUIDv7(),
    tanggal: now,
    aksi: "Ditolak",
    oleh: user?.name || "Admin",
    keterangan: alasan
  };

  const updatedPengajuan = await updatePengajuan(id, { 
    status: "Ditolak",
    alasanPenolakan: alasan,
    history: [...(pengajuan.history || []), newHistoryEntry]
  });
  
  if (updatedPengajuan) {
    window.dispatchEvent(new CustomEvent('pengajuan-rejected', {
      detail: { 
        pengajuan: updatedPengajuan,
        timestamp: now
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


