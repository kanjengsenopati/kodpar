import { Transaksi, Pengajuan } from "@/types";
import { syncTransactionToAccounting } from "../akuntansi/accountingSyncService";
import { getJurnalEntryByReference } from "../akuntansi/jurnalService";
import { db } from "@/db/db";
import * as IdUtils from "../../utils/idUtils";

/**
 * SYNC_STATUS Constants
 */
const SYNC_STATUS = {
  PENDING: 'PENDING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED'
};

/**
 * CentralizedSyncService - MISSION CRITICAL
 * Responsible for ensuring all financial transactions are reflected in the Accounting Ledger.
 * Uses a Persistent Sync Queue in IndexedDB to prevent data loss and duplicates.
 */
class CentralizedSyncService {
  private static instance: CentralizedSyncService;
  private activeSyncs: Set<string> = new Set(); // In-memory lock for current session
  private isProcessing = false;

  static getInstance(): CentralizedSyncService {
    if (!CentralizedSyncService.instance) {
      CentralizedSyncService.instance = new CentralizedSyncService();
    }
    return CentralizedSyncService.instance;
  }

  /**
   * Main entry point for syncing transactions (Async)
   */
  async syncTransaction(transaksi: Transaksi): Promise<{ success: boolean; message: string }> {
    if (transaksi.status !== "Sukses") {
      return { success: false, message: 'Transaction not successful, skipping sync' };
    }

    const entityId = transaksi.id;
    
    // 1. In-memory locking (Prevention for rapid double-clicks/events)
    if (this.activeSyncs.has(entityId)) {
      return { success: true, message: 'Sync already in progress in this session' };
    }
    this.activeSyncs.add(entityId);

    try {
      // 2. Persistent Check: Look into Sync Queue table
      const existingQueueItem = await db.sync_queue.where('entityId').equals(entityId).first();
      
      if (existingQueueItem && existingQueueItem.status === SYNC_STATUS.SUCCESS) {
        return { success: true, message: 'Already synced persistently' };
      }

      // 3. Deep Data Integrity Check: Verify if Journal already exists by reference
      const referensiTXN = transaksi.nomorTransaksi || `TXN-${entityId}`;
      const existingJournal = await getJurnalEntryByReference(referensiTXN);
      
      if (existingJournal) {
        console.log(`📋 Recovery: Journal found for ${referensiTXN}. Updating queue...`);
        await this.markAsSuccess(entityId, 'transaction', existingJournal.id);
        return { success: true, message: 'Journal already exists, recovery success' };
      }

      // 4. Persistence: Ensure record exists in Queue
      if (!existingQueueItem) {
        await db.sync_queue.add({
          id: IdUtils.generateUUIDv7(),
          entityId,
          type: 'transaction',
          status: SYNC_STATUS.PENDING,
          retryCount: 0,
          updatedAt: new Date().toISOString()
        });
      }

      // 5. Execution: Call the Financial Engine
      console.log(`🔄 Syncing transaction ${referensiTXN} [${transaksi.jenis}] to SAK EP...`);
      const journalEntry = await syncTransactionToAccounting(transaksi);
      
      if (journalEntry) {
        // A. Mark as Success in Queue
        await this.markAsSuccess(entityId, 'transaction', journalEntry.id);
        
        // B. Update transaction sync status for explicit UI state
        await db.transaksi.update(entityId, { 
          accountingSyncStatus: 'SUCCESS',
          updatedAt: new Date().toISOString()
        });

        // C. Notify UI
        this.safeDispatchEvent('centralized-sync-completed', {
          transactionId: entityId,
          journalId: journalEntry.id,
          journalNumber: journalEntry.nomorJurnal
        });

        console.log(`✅ Centralized sync SUCCESS for ${referensiTXN}`);
        return { success: true, message: 'Sync completed successfully' };
      } else {
        throw new Error("Financial engine returned null for journal entry");
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Sync FAILED for ${entityId}:`, errorMsg);
      
      await this.updateQueueStatus(entityId, SYNC_STATUS.FAILED, errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      this.activeSyncs.delete(entityId);
    }
  }

  /**
   * Automated Queue Processor (Handles crash recovery and retry)
   */
  async processPendingQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    try {
      // Find items that haven't succeeded
      const pendingItems = await db.sync_queue
        .where('status')
        .notEqual(SYNC_STATUS.SUCCESS)
        .toArray();
      
      if (pendingItems.length === 0) return;
      
      console.log(`🚀 Persistent Sync Queue: Processing ${pendingItems.length} items...`);
      
      for (const item of pendingItems) {
        // Skip items with too many failures for now (manual intervention maybe?)
        if (item.retryCount > 3) continue;

        if (item.type === 'transaction') {
          const transaksi = await db.transaksi.get(item.entityId);
          if (transaksi) {
            await this.syncTransaction(transaksi);
          } else if (item.status === SYNC_STATUS.PENDING) {
             // Cleanup queue if source record is missing
             await db.sync_queue.delete(item.id);
          }
        }
      }
    } catch (error) {
      console.error("❌ Queue Processor Error:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  private async markAsSuccess(entityId: string, type: string, journalId?: string): Promise<void> {
    const existing = await db.sync_queue.where('entityId').equals(entityId).first();
    const now = new Date().toISOString();
    
    if (existing) {
      await db.sync_queue.update(existing.id, {
        status: SYNC_STATUS.SUCCESS,
        journalId,
        updatedAt: now
      });
    } else {
      await db.sync_queue.add({
        id: IdUtils.generateUUIDv7(),
        entityId,
        type,
        status: SYNC_STATUS.SUCCESS,
        journalId,
        updatedAt: now
      });
    }
  }

  private async updateQueueStatus(entityId: string, status: string, error?: string): Promise<void> {
    const existing = await db.sync_queue.where('entityId').equals(entityId).first();
    if (existing) {
      await db.sync_queue.update(existing.id, {
        status,
        lastError: error,
        retryCount: (existing.retryCount || 0) + 1,
        updatedAt: new Date().toISOString()
      });
    }
  }

  private safeDispatchEvent(eventName: string, detail: any): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
  }

  /**
   * CRITICAL: Deletes the entire queue. Use only during major schema reset.
   */
  clearSyncCache(): void {
    db.sync_queue.clear();
    console.log('🗑️ Persistent sync queue fully cleared');
  }
}

export const centralizedSync = CentralizedSyncService.getInstance();

/**
 * Initializes the persistent sync service and listeners
 */
export function initializeCentralizedSync(): void {
  try {
    console.log('🚀 Initializing persistent sync service...');
    
    // Recovery Phase: Process pending queue immediately on start
    setTimeout(() => centralizedSync.processPendingQueue(), 2000);

    const addEventListeners = () => {
      if (typeof window === 'undefined') return;
      
      window.addEventListener('transaction-created', (event: any) => {
        const transaksi = event.detail.transaction;
        if (transaksi) {
          // Small delay to allow DB commit completion
          setTimeout(() => centralizedSync.syncTransaction(transaksi), 200);
        }
      });

      window.addEventListener('transaction-updated', (event: any) => {
        const transaksi = event.detail.transaction;
        if (transaksi) {
          setTimeout(() => centralizedSync.syncTransaction(transaksi), 200);
        }
      });
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addEventListeners);
    } else {
      addEventListeners();
    }

    console.log('✅ Persistent sync service initialized');
  } catch (error) {
    console.error('❌ Sync service initialization failed:', error);
  }
}
