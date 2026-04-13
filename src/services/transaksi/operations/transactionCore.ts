import { db } from "@/db/db";
import { generateSakEpDetails, validateSakEpBalance } from "../../akuntansi/sakEpIntegrity";
import { prepareJurnalEntry, getJurnalEntryByReference } from "../../akuntansi/jurnalService";
import { Transaksi, SubmissionResult, JadwalAngsuran } from "@/types";
import { getAnggotaById } from "@/services/anggotaService";
import { logAuditEntry } from "@/services/auditService";
import { syncTransactionToKeuangan } from "@/services/sync/comprehensiveSyncService";
import { createTransaksi as createTransaksiCore } from "../transaksiCore";
import { generateUUIDv7 } from "../../../utils/id-generator";
import { calculateLoanDetails } from "@/utils/loanCalculations";

/**
 * STRICTLY ATOMIC: Create transaksi with immediate SAK EP Journal Entry
 * Handles both "Pinjam" (Disbursement + Schedule Creation) and "Angsuran" (Repayment + Linking).
 */
export async function createTransactionWithSync(data: Partial<Transaksi>): Promise<SubmissionResult<Transaksi>> {
  try {
    // 1. ATOMIC TRANSACTION SCOPE (Full Audit & Integrity Control)
    const result = await db.transaction('rw', [
      db.transaksi,
      db.anggota,
      db.jurnal,
      db.audit_log,
      db.jadwal_angsuran
    ], async () => {

      // --- STAGE A: CORE DATA CREATION ---
      const txResult = await createTransaksiCore(data);
      if (!txResult.success || !txResult.data) {
        throw new Error(txResult.error || "Sistem gagal mengamankan rincian transaksi Anda.");
      }
      const newTransaksi = txResult.data;

      // --- STAGE B: BUSINESS INTEGRITY LOGIC (PINJAM/ANGSURAN) ---

      // CASE 1: DISBURSEMENT (PINJAM)
      // Generates the initial payment schedule to prevent "Ghost Loans"
      if (newTransaksi.jenis === "Pinjam") {
        const calc = calculateLoanDetails(newTransaksi.kategori || "Reguler", newTransaksi.jumlah, newTransaksi.tenor);
        const schedule: JadwalAngsuran[] = [];
        const startDate = new Date(newTransaksi.tanggal);
        const now = new Date().toISOString();

        const monthlyPokok = Math.round(calc.nominalPokok / (calc.tenor || 12));
        let remainingPokok = calc.nominalPokok;

        for (let i = 1; i <= calc.tenor; i++) {
          const dueDate = new Date(startDate);
          dueDate.setMonth(startDate.getMonth() + i);

          let currentMonthlyPokok = monthlyPokok;
          if (i === calc.tenor) {
            currentMonthlyPokok = remainingPokok; // Clean up rounding on last month
          } else {
            remainingPokok -= monthlyPokok;
          }

          schedule.push({
            id: generateUUIDv7(),
            loanId: newTransaksi.id,
            anggotaId: newTransaksi.anggotaId,
            angsuranKe: i,
            periode: new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(dueDate),
            tanggalJatuhTempo: dueDate.toISOString(),
            nominalPokok: currentMonthlyPokok,
            nominalJasa: Math.round(calc.nominalJasa),
            totalTagihan: Math.round(currentMonthlyPokok + calc.nominalJasa),
            status: "BELUM_BAYAR",
            createdAt: now,
            updatedAt: now
          });
        }

        if (schedule.length > 0) {
          await db.jadwal_angsuran.bulkAdd(schedule);
        } else {
          throw new Error("Gagal: Sistem tidak dapat menyusun jadwal angsuran untuk pinjaman ini.");
        }
      }

      // CASE 2: REPAYMENT (ANGSURAN)
      // Links the payment to the correct due date entry
      if (newTransaksi.jenis === "Angsuran") {
        if (!newTransaksi.referensiPinjamanId) {
          throw new Error("Gagal: Transaksi ini ditandai sebagai Angsuran namun tidak memiliki referensi Pinjaman.");
        }

        const scheduledInstallment = await db.jadwal_angsuran
          .where('loanId').equals(newTransaksi.referensiPinjamanId)
          .filter(s => s.status === "BELUM_BAYAR")
          .first();

        if (!scheduledInstallment) {
          throw new Error("Gagal: Tidak ditemukan jadwal tagihan (Belum Bayar) untuk pinjaman ini. Mungkin sudah lunas atau rujukan salah.");
        }

        await db.jadwal_angsuran.update(scheduledInstallment.id, {
          status: "DIBAYAR",
          tanggalBayar: newTransaksi.tanggal,
          transaksiId: newTransaksi.id,
          updatedAt: new Date().toISOString()
        });
      }

      // --- STAGE C: FINANCIAL JOURNALING (LEGAL COMPLIANCE) ---
      const journalDetails = generateSakEpDetails(newTransaksi);
      
      if (!validateSakEpBalance(journalDetails)) {
        throw new Error(`Integritas Gagal: Perhitungan akuntansi tidak seimbang (Debit ≠ Kredit) untuk transaksi ${newTransaksi.jenis}.`);
      }

      const journalEntry = await prepareJurnalEntry({
        tanggal: newTransaksi.tanggal,
        deskripsi: newTransaksi.keterangan || `Transaksi ${newTransaksi.jenis} #${newTransaksi.nomorTransaksi}`,
        referensi: `TXN-${newTransaksi.id}`,
        details: journalDetails,
        status: 'POSTED'
      });

      await db.jurnal.add(journalEntry);

      // --- STAGE D: SYNC & AUDIT LOGGING ---
      await db.transaksi.update(newTransaksi.id, { 
        accountingSyncStatus: 'SUCCESS' 
      });

      const anggota = await getAnggotaById(newTransaksi.anggotaId);
      await logAuditEntry(
        "CREATE",
        "TRANSAKSI",
        `[ATOMIC-LIFECYCLE] ${newTransaksi.jenis} Rp ${newTransaksi.jumlah.toLocaleString('id-ID')} - ${anggota?.nama || "Unknown"}`,
        newTransaksi.id
      );

      return { success: true, data: { ...newTransaksi, accountingSyncStatus: 'SUCCESS' as const } };
    });
    
    // POST-COMMIT: User Feedback & Cloud Sync
    if (result.success && result.data) {
      window.dispatchEvent(new CustomEvent('transaction-created', {
        detail: { transaction: result.data, timestamp: new Date().toISOString() }
      }));
      try { syncTransactionToKeuangan(result.data); } catch (err) {}
    }
    return result;

  } catch (error: any) {
    console.error("❌ ATOMIC WORKFLOW COLLAPSED:", error);

    // HUMAN-READABLE ERROR HANDLING
    let userFriendlyError = "Terdapat gangguan pada sistem saat memproses transaksi Anda.";
    
    if (error.message.includes("Gagal") || error.message.includes("Integritas") || error.message.includes("Masalah")) {
      userFriendlyError = error.message;
    } else if (error.name === 'ConstraintError') {
      userFriendlyError = "Nomor Transaksi atau ID sudah terpakai. Mohon coba sesaat lagi.";
    } else if (error.message.includes("Database")) {
      userFriendlyError = "Gagal mengakses database lokal. Pastikan browser Anda tidak dalam mode Private/Incognito.";
    }

    return { success: false, error: userFriendlyError };
  }
}

/**
 * STRICTLY ATOMIC: Update transaksi and its corresponding Journal
 */
export async function updateTransactionWithSync(id: string, data: Partial<Transaksi>): Promise<SubmissionResult<Transaksi>> {
  try {
    const result = await db.transaction('rw', [db.transaksi, db.anggota, db.jurnal, db.audit_log], async () => {
      // 1. Fetch existing
      const existing = await db.transaksi.get(id);
      if (!existing) throw new Error("Gagal: Data transaksi asli tidak ditemukan.");

      // 2. Prepare update
      const updatedTransaksi: Transaksi = {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString()
      };

      // 3. Update DB
      await db.transaksi.put(updatedTransaksi);

      // 4. Update Journal
      const referensiTXN = updatedTransaksi.nomorTransaksi || `TXN-${updatedTransaksi.id}`;
      const existingJournal = await getJurnalEntryByReference(referensiTXN) || await getJurnalEntryByReference(`TXN-${updatedTransaksi.id}`);

      const journalDetails = generateSakEpDetails(updatedTransaksi);
      if (!validateSakEpBalance(journalDetails)) {
        throw new Error(`Gagal: Update akuntansi tidak seimbang (Debit ≠ Kredit).`);
      }

      if (existingJournal) {
        await db.jurnal.update(existingJournal.id, {
          tanggal: updatedTransaksi.tanggal,
          deskripsi: updatedTransaksi.keterangan || `Transaksi ${updatedTransaksi.jenis} #${updatedTransaksi.nomorTransaksi}`,
          details: journalDetails,
          updatedAt: new Date().toISOString()
        });
      } else {
        const journalEntry = await prepareJurnalEntry({
          tanggal: updatedTransaksi.tanggal,
          deskripsi: updatedTransaksi.keterangan || `Transaksi ${updatedTransaksi.jenis} #${updatedTransaksi.nomorTransaksi}`,
          referensi: referensiTXN,
          details: journalDetails,
          status: 'POSTED'
        });
        await db.jurnal.add(journalEntry);
      }

      await db.transaksi.update(id, { accountingSyncStatus: 'SUCCESS' });

      const anggota = await getAnggotaById(updatedTransaksi.anggotaId);
      await logAuditEntry(
        "UPDATE",
        "TRANSAKSI",
        `[ATOMIC-UPDATE] ${updatedTransaksi.jenis} Rp ${updatedTransaksi.jumlah.toLocaleString('id-ID')} - ${anggota?.nama || "Unknown"}`,
        id
      );

      return { success: true, data: { ...updatedTransaksi, accountingSyncStatus: 'SUCCESS' as const } };
    });

    if (result.success && result.data) {
      window.dispatchEvent(new CustomEvent('transaction-updated', {
        detail: { transaction: result.data, timestamp: new Date().toISOString() }
      }));
      try { syncTransactionToKeuangan(result.data); } catch (err) {}
    }
    return result;
  } catch (error: any) {
    console.error("❌ ATOMIC UPDATE FAILED:", error);
    return { success: false, error: error.message || "Gagal memperbarui riwayat transaksi." };
  }
}
