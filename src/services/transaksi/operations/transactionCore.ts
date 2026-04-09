
import { Transaksi } from "@/types";
import { createTransaksi as createTransaksiCore } from "../transaksiCore";
import { syncTransactionToKeuangan } from "../../sync/comprehensiveSyncService";
import { logAuditEntry } from "../../auditService";
import { refreshFinancialCalculations } from "../../realTimeCalculationService";

/**
 * Enhanced create transaksi with controlled accounting sync to prevent duplicates
 */
export async function createTransactionWithSync(data: Partial<Transaksi>): Promise<Transaksi | null> {
  try {
    // Create the transaction using core service (now properly awaited)
    const newTransaksi = await createTransaksiCore(data);
    
    if (newTransaksi && newTransaksi.status === "Sukses") {
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
      
      // Refresh financial calculations for real-time consistency
      if (newTransaksi.anggotaId) {
        await refreshFinancialCalculations(newTransaksi.anggotaId);
      }
    }
    
    return newTransaksi;
  } catch (error) {
    console.error("Error creating transaksi in sync wrapper:", error);
    return null;
  }
}
