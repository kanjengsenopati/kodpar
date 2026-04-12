import { db } from "@/db/db";
import { generateSakEpDetails, validateSakEpBalance } from "../../akuntansi/sakEpIntegrity";
import { prepareJurnalEntry, getJurnalEntryByReference } from "../../akuntansi/jurnalService";
import { Transaksi, SubmissionResult } from "@/types";
import { getAnggotaById } from "@/services/anggotaService";
import { logAuditEntry } from "@/services/auditService";
import { syncTransactionToKeuangan } from "@/services/sync/comprehensiveSyncService";
import { createTransaksi as createTransaksiCore } from "../transaksiCore";
import { generateUUIDv7 } from "../../../utils/id-generator";

/**
 * STRICTLY ATOMIC: Create transaksi with immediate SAK EP Journal Entry
 */
export async function createTransactionWithSync(data: Partial<Transaksi>): Promise<SubmissionResult<Transaksi>> {
  try {
    const result = await db.transaction('rw', [db.transaksi, db.anggota, db.jurnal, db.audit_log], async () => {
      // A. Create Core Transaction Record
      const txResult = await createTransaksiCore(data);
      if (!txResult.success || !txResult.data) {
        throw new Error(txResult.error || "Gagal membuat record transaksi");
      }
      const newTransaksi = txResult.data;

      // B. GENERATE SAK EP DOUBLE-ENTRY (DEBIT/KREDIT)
      const journalDetails = generateSakEpDetails(newTransaksi);
      
      // C. VALIDATE BALANCE (DEBIT == KREDIT)
      if (!validateSakEpBalance(journalDetails)) {
        throw new Error(`Audit SAK EP Gagal: Jurnal tidak seimbang untuk transaksi ${newTransaksi.jenis}`);
      }

      // D. PREPARE & SAVE JOURNAL RECORD
      const journalEntry = await prepareJurnalEntry({
        tanggal: newTransaksi.tanggal,
        deskripsi: newTransaksi.keterangan || `Transaksi ${newTransaksi.jenis} #${newTransaksi.nomorTransaksi}`,
        referensi: `TXN-${newTransaksi.id}`,
        details: journalDetails,
        status: 'POSTED'
      });

      await db.jurnal.add(journalEntry);

      // E. UPDATE TRANSACTION STATUS
      await db.transaksi.update(newTransaksi.id, { 
        accountingSyncStatus: 'SUCCESS' 
      });

      // F. AUDIT LOG
      const anggota = await getAnggotaById(newTransaksi.anggotaId);
      await logAuditEntry(
        "CREATE",
        "TRANSAKSI",
        `[SAK-EP ATOMIC] ${newTransaksi.jenis} Rp ${newTransaksi.jumlah.toLocaleString('id-ID')} - ${anggota?.nama || "Unknown"}`,
        newTransaksi.id
      );

      return { success: true, data: { ...newTransaksi, accountingSyncStatus: 'SUCCESS' as const } };
    });
    
    // ... post-commit hooks
    if (result.success && result.data) {
      window.dispatchEvent(new CustomEvent('transaction-created', {
        detail: { transaction: result.data, timestamp: new Date().toISOString() }
      }));
      try { syncTransactionToKeuangan(result.data); } catch (err) {}
    }
    return result;
  } catch (error: any) {
    console.error("❌ ATOMIC CREATE FAILED:", error);
    return { success: false, error: `Audit SAK EP Gagal: ${error.message || 'Kesalahan sistem'}` };
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
      if (!existing) throw new Error("Transaksi tidak ditemukan");

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
        throw new Error(`Audit SAK EP Gagal: Jurnal tidak seimbang untuk update ${updatedTransaksi.jenis}`);
      }

      if (existingJournal) {
        // Update existing journal
        await db.jurnal.update(existingJournal.id, {
          tanggal: updatedTransaksi.tanggal,
          deskripsi: updatedTransaksi.keterangan || `Transaksi ${updatedTransaksi.jenis} #${updatedTransaksi.nomorTransaksi}`,
          details: journalDetails,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Create journal if missing (recovery)
        const journalEntry = await prepareJurnalEntry({
          tanggal: updatedTransaksi.tanggal,
          deskripsi: updatedTransaksi.keterangan || `Transaksi ${updatedTransaksi.jenis} #${updatedTransaksi.nomorTransaksi}`,
          referensi: referensiTXN,
          details: journalDetails,
          status: 'POSTED'
        });
        await db.jurnal.add(journalEntry);
      }

      // 5. Update Status
      await db.transaksi.update(id, { accountingSyncStatus: 'SUCCESS' });

      // 6. Audit Log
      const anggota = await getAnggotaById(updatedTransaksi.anggotaId);
      await logAuditEntry(
        "UPDATE",
        "TRANSAKSI",
        `[SAK-EP ATOMIC UPDATE] ${updatedTransaksi.jenis} Rp ${updatedTransaksi.jumlah.toLocaleString('id-ID')} - ${anggota?.nama || "Unknown"}`,
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
    return { success: false, error: `Gagal memperbarui transaksi: ${error.message}` };
  }
}
