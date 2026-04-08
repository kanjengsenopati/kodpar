
import { Transaksi, Pengajuan } from "@/types";
import { syncTransactionToAccounting, syncPengajuanToAccounting } from "./akuntansi/accountingSyncService";
import { useAccountingKeuanganSync } from "@/hooks/useKeuanganSync";

/**
 * Real-time accounting sync manager with enhanced duplicate prevention
 */
export class RealTimeAccountingSync {
  private static instance: RealTimeAccountingSync;
  private syncQueue: Array<{ type: 'transaction' | 'pengajuan', data: Transaksi | Pengajuan }> = [];
  private processedItems: Set<string> = new Set(); // Track processed items
  private recentlyProcessed: Map<string, number> = new Map(); // Track with timestamps
  private isProcessing = false;
  private readonly RECENT_THRESHOLD = 5000; // 5 seconds

  static getInstance(): RealTimeAccountingSync {
    if (!RealTimeAccountingSync.instance) {
      RealTimeAccountingSync.instance = new RealTimeAccountingSync();
    }
    return RealTimeAccountingSync.instance;
  }

  /**
   * Check if item was recently processed to prevent rapid duplicates
   */
  private wasRecentlyProcessed(itemKey: string): boolean {
    const lastProcessTime = this.recentlyProcessed.get(itemKey);
    if (lastProcessTime) {
      const timeDiff = Date.now() - lastProcessTime;
      if (timeDiff < this.RECENT_THRESHOLD) {
        return true;
      }
      // Clean up old entries
      this.recentlyProcessed.delete(itemKey);
    }
    return false;
  }

  /**
   * Add transaction to sync queue with enhanced duplicate prevention
   */
  queueTransactionSync(transaksi: Transaksi): void {
    const itemKey = `transaction-${transaksi.id}`;
    
    if (this.processedItems.has(itemKey)) {
      console.log(`🔄 Transaction ${transaksi.id} already processed, skipping queue`);
      return;
    }
    
    if (this.wasRecentlyProcessed(itemKey)) {
      console.log(`🔄 Transaction ${transaksi.id} was recently processed, skipping rapid duplicate`);
      return;
    }
    
    // Mark as recently processed
    this.recentlyProcessed.set(itemKey, Date.now());
    
    this.syncQueue.push({ type: 'transaction', data: transaksi });
    this.processedItems.add(itemKey);
    this.processQueue();
  }

  /**
   * Add pengajuan to sync queue with enhanced duplicate prevention
   */
  queuePengajuanSync(pengajuan: Pengajuan): void {
    const itemKey = `pengajuan-${pengajuan.id}`;
    
    if (this.processedItems.has(itemKey)) {
      console.log(`🔄 Pengajuan ${pengajuan.id} already processed, skipping queue`);
      return;
    }
    
    if (this.wasRecentlyProcessed(itemKey)) {
      console.log(`🔄 Pengajuan ${pengajuan.id} was recently processed, skipping rapid duplicate`);
      return;
    }
    
    // Mark as recently processed
    this.recentlyProcessed.set(itemKey, Date.now());
    
    this.syncQueue.push({ type: 'pengajuan', data: pengajuan });
    this.processedItems.add(itemKey);
    this.processQueue();
  }

  /**
   * Process the sync queue
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.syncQueue.length === 0) return;

    this.isProcessing = true;
    console.log(`🔄 Processing accounting sync queue: ${this.syncQueue.length} items`);

    while (this.syncQueue.length > 0) {
      const item = this.syncQueue.shift();
      if (!item) continue;

      try {
        if (item.type === 'transaction') {
          const result = syncTransactionToAccounting(item.data as Transaksi);
          if (result) {
            console.log(`✅ Real-time sync completed for transaction ${item.data.id}`);
          }
        } else if (item.type === 'pengajuan') {
          const result = syncPengajuanToAccounting(item.data as Pengajuan);
          if (result) {
            console.log(`✅ Real-time sync completed for pengajuan ${item.data.id}`);
          }
        }

        // Update last sync time
        localStorage.setItem('last_accounting_sync_time', new Date().toISOString());
        
        // Trigger global sync event
        window.dispatchEvent(new CustomEvent('real-time-accounting-sync', {
          detail: {
            type: item.type,
            id: item.data.id,
            timestamp: new Date().toISOString()
          }
        }));

      } catch (error) {
        console.error(`❌ Real-time sync failed for ${item.type} ${item.data.id}:`, error);
      }

      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isProcessing = false;
    console.log(`✅ Accounting sync queue processing completed`);
  }

  /**
   * Force sync all pending items
   */
  async forceSyncAll(): Promise<void> {
    console.log(`🔄 Force syncing ${this.syncQueue.length} pending items...`);
    await this.processQueue();
  }

  /**
   * Get queue status
   */
  getQueueStatus(): { pending: number, processing: boolean } {
    return {
      pending: this.syncQueue.length,
      processing: this.isProcessing
    };
  }

  /**
   * Clear processed items cache (for testing/debugging)
   */
  clearProcessedCache(): void {
    this.processedItems.clear();
    console.log('🗑️ Processed items cache cleared');
  }
}

// Export singleton instance
export const realTimeAccountingSync = RealTimeAccountingSync.getInstance();

/**
 * Initialize real-time sync listeners
 */
export function initializeRealTimeAccountingSync(): void {
  console.log('🚀 Initializing real-time accounting sync...');

  // Listen for transaction creation events
  window.addEventListener('transaction-created', (event: any) => {
    const transaksi = event.detail.transaction;
    if (transaksi && transaksi.status === 'Sukses') {
      realTimeAccountingSync.queueTransactionSync(transaksi);
    }
  });

  // Listen for transaction updates
  window.addEventListener('transaction-updated', (event: any) => {
    const transaksi = event.detail.transaction;
    if (transaksi && transaksi.status === 'Sukses') {
      realTimeAccountingSync.queueTransactionSync(transaksi);
    }
  });

  // Listen for pengajuan approvals
  window.addEventListener('pengajuan-approved', (event: any) => {
    const pengajuan = event.detail.pengajuan;
    if (pengajuan && pengajuan.status === 'Disetujui') {
      realTimeAccountingSync.queuePengajuanSync(pengajuan);
    }
  });

  // Listen for keuangan data changes and sync back to accounting
  window.addEventListener('keuangan-data-updated', () => {
    console.log('📊 Keuangan data updated, triggering accounting consistency check...');
    // This ensures bi-directional sync consistency
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('accounting-consistency-check'));
    }, 500);
  });

  console.log('✅ Real-time accounting sync listeners initialized');
}

export function useRealTimeAccountingSync() {
  const { lastUpdate } = useAccountingKeuanganSync();
  
  return {
    lastUpdate,
    queueStatus: realTimeAccountingSync.getQueueStatus(),
    forceSyncAll: () => realTimeAccountingSync.forceSyncAll()
  };
}
