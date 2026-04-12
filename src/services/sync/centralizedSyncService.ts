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
 * Responsible for ensuring all financial transactions are reflected in the Accounting Ledger
 * AND synchronized to the Cloud Backend (Fastify + NeonDB).
 */
class CentralizedSyncService {
  private static instance: CentralizedSyncService;
  private activeSyncs: Set<string> = new Set();
  private isProcessing = false;
  private BACKEND_URL = "http://localhost:3001";

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
    if (this.activeSyncs.has(entityId)) {
      return { success: true, message: 'Sync already in progress' };
    }
    this.activeSyncs.add(entityId);

    try {
      // 1. Persistent Check
      const existingQueueItem = await db.sync_queue.where('entityId').equals(entityId).first();
      
      if (existingQueueItem && existingQueueItem.status === SYNC_STATUS.SUCCESS && existingQueueItem.remoteStatus === SYNC_STATUS.SUCCESS) {
        return { success: true, message: 'Already fully synced (Lokal & Cloud)' };
      }

      // 2. Ensure record exists in Queue
      if (!existingQueueItem) {
        await db.sync_queue.add({
          id: IdUtils.generateUUIDv7(),
          entityId,
          type: 'transaction',
          status: SYNC_STATUS.PENDING,
          remoteStatus: SYNC_STATUS.PENDING,
          retryCount: 0,
          updatedAt: new Date().toISOString()
        });
      }

      // --- STAGE A: LOCAL ACCOUNTING LEDGER (SAK EP) ---
      let localJournalId = existingQueueItem?.journalId;
      if (!localJournalId || existingQueueItem?.status !== SYNC_STATUS.SUCCESS) {
        console.log(`🔄 [LOCAL] Syncing ${transaksi.nomorTransaksi} to Ledger...`);
        const journalEntry = await syncTransactionToAccounting(transaksi);
        if (journalEntry) {
          localJournalId = journalEntry.id;
          await db.sync_queue.update(entityId, { status: SYNC_STATUS.SUCCESS, journalId: localJournalId });
          await db.transaksi.update(entityId, { accountingSyncStatus: 'SUCCESS' });
        }
      }

      // --- STAGE B: REMOTE CLOUD SYNC (FASTIFY + NEON) ---
      if (!existingQueueItem?.remoteStatus || existingQueueItem.remoteStatus !== SYNC_STATUS.SUCCESS) {
        console.log(`☁️ [CLOUD] Syncing ${transaksi.nomorTransaksi} to NeonDB...`);
        const cloudResult = await this.syncToRemoteServer(transaksi);
        
        if (cloudResult.success) {
          await this.updateRemoteQueueStatus(entityId, SYNC_STATUS.SUCCESS);
          this.safeDispatchEvent('cloud-sync-success', { transactionId: entityId });
        } else {
          await this.updateRemoteQueueStatus(entityId, SYNC_STATUS.FAILED, cloudResult.message);
        }
      }

      return { success: true, message: 'Dual-sync process completed' };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Sync Workflow FAILED:`, errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      this.activeSyncs.delete(entityId);
    }
  }

  /**
   * HTTP Connector for Fastify Backend
   */
  private async syncToRemoteServer(transaksi: Transaksi): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.BACKEND_URL}/sync/transaksi`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaksi)
      });

      if (response.ok) {
        return { success: true, message: 'Synced to Cloud' };
      } else if (response.status === 409) {
        return { success: true, message: 'Already on Cloud' };
      } else {
        const errData = await response.json();
        return { success: false, message: errData.error || 'Server rejected sync' };
      }
    } catch (error) {
      return { success: false, message: 'Server unreachable (Offline)' };
    }
  }

  private async updateRemoteQueueStatus(entityId: string, status: string, error?: string): Promise<void> {
    const existing = await db.sync_queue.where('entityId').equals(entityId).first();
    if (existing) {
      await db.sync_queue.update(existing.id, {
        remoteStatus: status,
        lastRemoteError: error,
        updatedAt: new Date().toISOString()
      });
    }
  }

  /**
   * Automated Queue Processor (Modified for Cloud Retry)
   */
  async processPendingQueue(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;
    
    try {
      const pendingItems = await db.sync_queue
        .filter(item => item.status !== SYNC_STATUS.SUCCESS || item.remoteStatus !== SYNC_STATUS.SUCCESS)
        .toArray();
      
      if (pendingItems.length === 0) return;
      
      console.log(`🚀 Sync Manager: Processing ${pendingItems.length} pending items...`);
      
      for (const item of pendingItems) {
        if (item.retryCount > 10) continue;

        if (item.type === 'transaction') {
          const transaksi = await db.transaksi.get(item.entityId);
          if (transaksi) {
            await this.syncTransaction(transaksi);
          }
        }
      }
    } catch (error) {
      console.error("❌ Queue Processor Error:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  // ... (markAsSuccess, updateQueueStatus, safeDispatchEvent preserved)
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
        remoteStatus: SYNC_STATUS.PENDING,
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

  clearSyncCache(): void {
    db.sync_queue.clear();
    console.log('🗑️ Persistent sync queue fully cleared');
  }
}

export const centralizedSync = CentralizedSyncService.getInstance();

export function initializeCentralizedSync(): void {
  try {
    console.log('🚀 Initializing persistent sync service...');
    
    setTimeout(() => centralizedSync.processPendingQueue(), 3000);

    // Auto-retry when connection comes back
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        console.log('🌐 Connection restored! Retrying sync queue...');
        centralizedSync.processPendingQueue();
      });
    }

    const addEventListeners = () => {
      if (typeof window === 'undefined') return;
      
      window.addEventListener('transaction-created', (event: any) => {
        const transaksi = event.detail.transaction;
        if (transaksi) {
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

