
import { db } from "@/db/db";
import { Transaksi } from "@/types";
import { centralizedSync } from "../sync/centralizedSyncService";
import { getJurnalEntryByReference } from "./jurnalService";

export interface ConsistencyStatus {
  total: number;
  synced: number;
  pending: number;
  failed: number;
  orphanJournals: number;
  inconsistentTransactions: Transaksi[];
}

/**
 * Service to ensure and verify data consistency between transactions and accounting
 */
export const consistencyService = {
  /**
   * Validate end-to-end sync consistency
   */
  async validateSyncConsistency(): Promise<ConsistencyStatus> {
    console.log("🔍 Starting sync consistency audit...");
    
    // 1. Get all successful transactions
    const allTransaksi = await db.transaksi.toArray();
    const successfulTx = allTransaksi.filter(t => t.status === "Sukses");
    
    // 2. Scan for inconsistencies
    const inconsistentTransactions: Transaksi[] = [];
    let synced = 0;
    let pending = 0;
    let failed = 0;
    
    for (const tx of successfulTx) {
      // Check for journal entry by reference
      const referensi = `TXN-${tx.id}`;
      const journalEntry = await getJurnalEntryByReference(referensi);
      
      if (journalEntry) {
        synced++;
        // If it was marked as pending/failed but journal exists, fix it
        if (tx.accountingSyncStatus !== "SUCCESS") {
          await db.transaksi.update(tx.id, { accountingSyncStatus: "SUCCESS" });
        }
      } else {
        inconsistentTransactions.push(tx);
        if (tx.accountingSyncStatus === "FAILED") failed++;
        else pending++;
      }
    }
    
    // 3. Scan for orphan journals (optional, complex)
    // For now, focus on missing journals
    
    const status: ConsistencyStatus = {
      total: successfulTx.length,
      synced,
      pending,
      failed,
      orphanJournals: 0,
      inconsistentTransactions
    };
    
    console.log(`📊 Consistency Audit Result: ${status.synced}/${status.total} synced, ${status.inconsistentTransactions.length} inconsistencies found`);
    return status;
  },

  /**
   * Reconcile all inconsistencies by re-syncing missing items
   */
  async reconcileInconsistencies(): Promise<{ success: number; failed: number }> {
    console.log("🔄 Starting data reconciliation...");
    const audit = await this.validateSyncConsistency();
    
    let success = 0;
    let failed = 0;
    
    for (const tx of audit.inconsistentTransactions) {
      try {
        console.log(`🔄 Re-syncing transaction ${tx.id}...`);
        const result = await centralizedSync.syncTransaction(tx);
        if (result.success) {
          success++;
        } else {
          failed++;
        }
      } catch (error) {
        console.error(`❌ Reconciliation failed for transaction ${tx.id}:`, error);
        failed++;
      }
    }
    
    console.log(`✅ Reconciliation completed: ${success} fixed, ${failed} still failing`);
    return { success, failed };
  },

  /**
   * Deep Rebuild: Clears all system-generated journals and recreates them from scratch
   * to ensure 100% mapping consistency with the new standardized COA.
   */
  async fullRebuildLedger(): Promise<{ total: number; success: number; failed: number }> {
    console.log("🧨 STARTING FULL LEDGER REBUILD...");
    
    try {
      // 1. Find all system-generated journals
      const journals = await db.jurnal.toArray();
      const systemJournals = journals.filter(j => j.createdBy === "system_auto_sync");
      
      console.log(`🗑️ Clearing ${systemJournals.length} existing system journals...`);
      
      // 2. Clear them from DB (atomically if possible, but one by one for safety)
      for (const j of systemJournals) {
        await db.jurnal.delete(j.id);
      }
      
      // 3. Reset sync status on all transactions to force a full re-sync
      console.log("🔄 Resetting transaction sync markers...");
      await db.transaksi.toCollection().modify({
        accountingSyncStatus: "PENDING",
        lastSyncError: undefined
      });
      
      // 4. Run reconciliation to rebuild everything
      console.log("🏗️ Rebuilding journals from transaction data...");
      const result = await this.reconcileInconsistencies();
      
      const allSuccessfulTx = await db.transaksi.filter(t => t.status === "Sukses").toArray();
      
      return {
        total: allSuccessfulTx.length,
        success: result.success,
        failed: result.failed
      };
    } catch (error) {
      console.error("❌ Full rebuild failed:", error);
      throw error;
    }
  }
};
