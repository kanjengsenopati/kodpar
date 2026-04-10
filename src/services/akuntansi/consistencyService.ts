import { db } from "@/db/db";
import { Transaksi } from "@/types";
import { centralizedSync } from "../sync/centralizedSyncService";
import { getJurnalEntryByReference } from "./jurnalService";
import { getPengaturan } from "../pengaturanService";

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
 * VERSION: Pure DB Driven / SAK EP Modern
 */
export const consistencyService = {
  /**
   * Validate end-to-end sync consistency
   */
  async validateSyncConsistency(): Promise<ConsistencyStatus> {
    console.log("🔍 Starting SAK EP consistency audit...");
    const successfulTx = await db.transaksi.where("status").equals("Sukses").toArray();
    
    const inconsistentTransactions: Transaksi[] = [];
    let synced = 0;
    let pending = 0;
    let failed = 0;
    
    for (const tx of successfulTx) {
      const referensi = tx.nomorTransaksi || `TXN-${tx.id}`;
      const journalEntry = await getJurnalEntryByReference(referensi);
      
      if (journalEntry) {
        synced++;
        if (tx.accountingSyncStatus !== "SUCCESS") {
          await db.transaksi.update(tx.id, { accountingSyncStatus: "SUCCESS" });
        }
      } else {
        inconsistentTransactions.push(tx);
        if (tx.accountingSyncStatus === "FAILED") failed++;
        else pending++;
      }
    }
    
    return {
      total: successfulTx.length,
      synced,
      pending,
      failed,
      orphanJournals: 0,
      inconsistentTransactions
    };
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
        const result = await centralizedSync.syncTransaction(tx);
        if (result.success) success++;
        else failed++;
      } catch (error) {
        failed++;
      }
    }
    
    return { success, failed };
  },

  /**
   * Deep Rebuild: Clears all system journals and recreates them.
   * IMPROVED: Now performs data migration to structured fields for historical records.
   */
  async fullRebuildLedger(): Promise<{ total: number; success: number; failed: number }> {
    console.log("🧨 STARTING ARCHITECTURAL REBUILD & MIGRATION...");
    const settings = getPengaturan();
    
    try {
      // 1. Clear existing system journals
      const journals = await db.jurnal.toArray();
      const systemJournals = journals.filter(j => j.createdBy === "system_auto_sync");
      for (const j of systemJournals) {
        await db.jurnal.delete(j.id);
      }
      
      // 2. MIGRATION: Promote legacy data to structured fields
      const allTx = await db.transaksi.toArray();
      console.log(`🏗️ Migrating ${allTx.length} transactions to structured schema...`);
      
      for (const tx of allTx) {
        const updateObj: Partial<Transaksi> = { 
          accountingSyncStatus: "PENDING",
          lastSyncError: undefined 
        };

        // Recovery Logic for historical records
        if (tx.jenis === "Pinjam" && (!tx.tenor || !tx.sukuBunga)) {
          const tenorMatch = tx.keterangan?.match(/Tenor: (\d+) bulan/i);
          const rateMatch = tx.keterangan?.match(/Suku Bunga: ([\d.]+)%/i);
          
          updateObj.tenor = tenorMatch ? parseInt(tenorMatch[1]) : (settings.tenor.defaultTenor || 12);
          updateObj.sukuBunga = rateMatch ? parseFloat(rateMatch[1]) : (settings.sukuBunga.pinjaman || 1.5);
        }

        if (tx.jenis === "Angsuran" && (!tx.nominalPokok || !tx.nominalJasa)) {
          const pokokMatch = tx.keterangan?.match(/Pokok: Rp ([\d,.]+)/i);
          const jasaMatch = tx.keterangan?.match(/Jasa: Rp ([\d,.]+)/i);
          const loanMatch = tx.keterangan?.match(/Pinjaman: (TR\d+)/i);

          if (pokokMatch) updateObj.nominalPokok = parseInt(pokokMatch[1].replace(/[,.]/g, ''));
          if (jasaMatch) updateObj.nominalJasa = parseInt(jasaMatch[1].replace(/[,.]/g, ''));
          if (loanMatch) updateObj.referensiPinjamanId = loanMatch[1];
        }

        await db.transaksi.update(tx.id, updateObj);
      }
      
      // 3. Rebuild everything using new PURE DB logic
      console.log("🏗️ Rebuilding journals using Structured SAK EP logic...");
      const result = await this.reconcileInconsistencies();
      
      const allSuccessfulTx = await db.transaksi.filter(t => t.status === "Sukses").toArray();
      
      // Signal completion for UI refresh
      window.dispatchEvent(new CustomEvent('ledger-rebuild-completed'));

      return {
        total: allSuccessfulTx.length,
        success: result.success,
        failed: result.failed
      };
    } catch (error) {
      console.error("❌ Full rebuild migration failed:", error);
      throw error;
    }
  }
};
