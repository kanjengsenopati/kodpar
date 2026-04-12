import { db } from "@/db/db";
import { generateSakEpDetails, validateSakEpBalance } from "../../akuntansi/sakEpIntegrity";
import { prepareJurnalEntry } from "../../akuntansi/jurnalService";
import { Transaksi, SubmissionResult } from "@/types";
import { getAnggotaById } from "@/services/anggotaService";
import { logAuditEntry } from "@/services/auditService";
import { syncTransactionToKeuangan } from "@/services/sync/comprehensiveSyncService";
import { createTransaksi as createTransaksiCore } from "../transaksiCore";

/**
 * STRICTLY ATOMIC: Create transaksi with immediate SAK EP Journal Entry
 */
export async function createTransactionWithSync(data: Partial<Transaksi>): Promise<SubmissionResult<Transaksi>> {
  try {
    // 1. EXECUTE STRICT ATOMIC DB TRANSACTION
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

      // E. UPDATE TRANSACTION STATUS TO SUCCESSFUL SYNC
      await db.transaksi.update(newTransaksi.id, { 
        accountingSyncStatus: 'SUCCESS' 
      });

      // F. AUDIT LOG (Internal to Transaction)
      const anggota = await getAnggotaById(newTransaksi.anggotaId);
      await logAuditEntry(
        "CREATE",
        "TRANSAKSI",
        `[SAK-EP ATOMIC] ${newTransaksi.jenis} Rp ${newTransaksi.jumlah.toLocaleString('id-ID')} - ${anggota?.nama || "Unknown"}`,
        newTransaksi.id
      );

      return { success: true, data: { ...newTransaksi, accountingSyncStatus: 'SUCCESS' as const } };
    });
    
    // 2. TRIGGER NON-FATAL SIDE EFFECTS (AFTER COMMIT)
    if (result.success && result.data) {
      const syncedTx = result.data;
      
      // Emit event for UI updates
      window.dispatchEvent(new CustomEvent('transaction-created', {
        detail: { transaction: syncedTx, timestamp: new Date().toISOString() }
      }));
      
      // Comprehensive sync for non-accounting modules (e.g., specific reports)
      try {
        syncTransactionToKeuangan(syncedTx);
      } catch (err) {
        console.warn("⚠️ Non-fatal sync warning:", err);
      }
    }
    
    return result;
  } catch (error: any) {
    console.error("❌ ATOMIC TRANSACTION FAILED (ROLLBACK EXECUTED):", error);
    return { success: false, error: `Audit SAK EP Gagal: ${error.message || 'Kesalahan sistem'}` };
  }
}
