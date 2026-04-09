import { Transaksi, SubmissionResult } from "@/types";
import { createTransaksi as createTransaksiCore } from "../transaksiCore";
import { syncTransactionToKeuangan } from "../../sync/comprehensiveSyncService";
import { logAuditEntry } from "../../auditService";
// refreshFinancialCalculations removed (Decommissioned Legacy Logic)
import { db } from "@/db/db";

/**
 * Enhanced create transaksi with controlled accounting sync to prevent duplicates
 */
export async function createTransactionWithSync(data: Partial<Transaksi>): Promise<SubmissionResult<Transaksi>> {
  try {
    // Create the transaction using core service inside a Dexie transaction for atomicity
    const result = await db.transaction('rw', db.transaksi, async () => {
      return await createTransaksiCore(data);
    });
    
    if (result.success && result.data && result.data.status === "Sukses") {
      const newTransaksi = result.data;
      console.log(`✅ Transaction ${newTransaksi.id} created successfully`);
      
      // Note: Accounting sync will be handled by the calling function to prevent duplicates
      
      // Additional Keuangan sync for comprehensive coverage (non-accounting)
      const keuanganSync = await syncTransactionToKeuangan(newTransaksi);
      if (keuanganSync.success && keuanganSync.syncedItems.length > 0) {
        console.log(`Comprehensive sync completed: ${keuanganSync.syncedItems.length} items synced to Keuangan`);
      }
      
      // Emit transaction created event for real-time listeners
      window.dispatchEvent(new CustomEvent('transaction-created', {
        detail: { 
          transaction: newTransaksi,
          timestamp: new Date().toISOString()
        }
      }));
      
      // Log audit entry
      await logAuditEntry(
        "CREATE",
        "TRANSAKSI",
        `Membuat transaksi ${newTransaksi.jenis} sebesar Rp ${newTransaksi.jumlah.toLocaleString('id-ID')} untuk anggota ${newTransaksi.anggotaNama} dengan controlled sync`,
        newTransaksi.id
      );
      
      // Financial data updates are now managed via 'transaction-created' events.
    }
    
    return result;
  } catch (error: any) {
    console.error("Error creating transaksi in sync wrapper:", error);
    return { success: false, error: `Sync Wrapper Error: ${error.message || 'Kesalahan sinkronisasi transaksi'}` };
  }
}
