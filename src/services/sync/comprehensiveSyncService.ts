
import { calculateAngsuranAllocation } from "../akuntansi/allocationService";

/**
 * Comprehensive sync service for handling various sync operations
 */
export function syncAllData() {
  console.log("Starting comprehensive sync...");
  
  // Example sync operation
  try {
    // Use the corrected function signature (1-2 arguments, not 3)
    const allocation = calculateAngsuranAllocation(1000000, 10);
    console.log("Allocation calculated:", allocation);
    
    return {
      success: true,
      message: "Sync completed successfully"
    };
  } catch (error) {
    console.error("Sync error:", error);
    return {
      success: false,
      message: "Sync failed"
    };
  }
}

/**
 * Sync transaction to Keuangan module
 */
export function syncTransactionToKeuangan(transaksi: any): { success: boolean; syncedItems: any[] } {
  try {
    console.log("Syncing transaction to Keuangan:", transaksi.id);
    
    // Mock sync operation - in a real app this would sync to external system
    const syncedItems = [
      {
        id: `keuangan-${transaksi.id}`,
        type: "financial_transaction",
        originalId: transaksi.id,
        amount: transaksi.jumlah,
        syncedAt: new Date().toISOString()
      }
    ];
    
    return {
      success: true,
      syncedItems
    };
  } catch (error) {
    console.error("Error syncing transaction to Keuangan:", error);
    return {
      success: false,
      syncedItems: []
    };
  }
}
