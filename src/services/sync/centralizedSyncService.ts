import { Transaksi, Pengajuan } from "@/types";
import { syncTransactionToAccounting } from "../akuntansi/accountingSyncService";
import { getJurnalEntryByReference } from "../akuntansi/jurnalService";
// refreshFinancialCalculations removed (Decommissioned Legacy Logic)
import { db } from "@/db/db";

// Global sync tracker dengan persistent storage
const SYNC_TRACKER_KEY = "centralized_sync_tracker";
const RECENT_SYNC_KEY = "recent_sync_tracker";

interface SyncRecord {
  transactionId: string;
  type: 'transaction' | 'pengajuan';
  journalId?: string;
  syncedAt: string;
  status: 'synced' | 'failed';
}

interface RecentSyncRecord {
  itemKey: string;
  timestamp: number;
}

class CentralizedSyncService {
  private static instance: CentralizedSyncService;
  private syncedItems: Set<string> = new Set();
  private recentSyncs: Map<string, number> = new Map();
  private activeSyncs: Set<string> = new Set(); // Prevent concurrent syncs
  private readonly RECENT_THRESHOLD = 5000; // 5 seconds
  private isInitialized = false;

  static getInstance(): CentralizedSyncService {
    if (!CentralizedSyncService.instance) {
      CentralizedSyncService.instance = new CentralizedSyncService();
    }
    return CentralizedSyncService.instance;
  }

  private safeLocalStorageAccess<T>(key: string, defaultValue: T, operation: 'get' | 'set', value?: any): T {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return defaultValue;
      }
      
      if (operation === 'get') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      } else {
        localStorage.setItem(key, JSON.stringify(value));
        return value;
      }
    } catch (error) {
      console.warn(`LocalStorage ${operation} failed for key ${key}:`, error);
      return defaultValue;
    }
  }

  private loadSyncHistory(): void {
    if (this.isInitialized) return;
    
    try {
      // Load persistent sync records
      const syncRecords = this.safeLocalStorageAccess<SyncRecord[]>(SYNC_TRACKER_KEY, [], 'get');
      syncRecords.forEach(record => {
        const itemKey = `${record.type}-${record.transactionId}`;
        this.syncedItems.add(itemKey);
      });

      // Load recent sync records (with cleanup)
      const recentRecords = this.safeLocalStorageAccess<RecentSyncRecord[]>(RECENT_SYNC_KEY, [], 'get');
      const now = Date.now();
      recentRecords.forEach(record => {
        if (now - record.timestamp < this.RECENT_THRESHOLD * 2) {
          this.recentSyncs.set(record.itemKey, record.timestamp);
        }
      });

      this.isInitialized = true;
      console.log(`📚 Loaded ${syncRecords.length} persistent sync records and ${recentRecords.length} recent records`);
    } catch (error) {
      console.error("Error loading sync history:", error);
      this.isInitialized = true;
    }
  }

  private saveSyncRecord(record: SyncRecord): void {
    try {
      const existingRecords = this.safeLocalStorageAccess<SyncRecord[]>(SYNC_TRACKER_KEY, [], 'get');
      const itemKey = `${record.type}-${record.transactionId}`;
      
      // Remove existing record if present
      const filteredRecords = existingRecords.filter(r => 
        `${r.type}-${r.transactionId}` !== itemKey
      );
      
      filteredRecords.push(record);
      this.safeLocalStorageAccess(SYNC_TRACKER_KEY, [], 'set', filteredRecords);
    } catch (error) {
      console.error("Error saving sync record:", error);
    }
  }

  private markRecentSync(itemKey: string): void {
    const now = Date.now();
    this.recentSyncs.set(itemKey, now);
    
    // Save to persistent storage
    try {
      const recentRecords: RecentSyncRecord[] = Array.from(this.recentSyncs.entries()).map(([key, timestamp]) => ({
        itemKey: key,
        timestamp
      }));
      this.safeLocalStorageAccess(RECENT_SYNC_KEY, [], 'set', recentRecords);
    } catch (error) {
      console.error("Error saving recent sync record:", error);
    }
  }

  private wasRecentlySynced(itemKey: string): boolean {
    const lastSync = this.recentSyncs.get(itemKey);
    if (lastSync) {
      const timeDiff = Date.now() - lastSync;
      return timeDiff < this.RECENT_THRESHOLD;
    }
    return false;
  }

  private isAlreadySynced(itemKey: string): boolean {
    return this.syncedItems.has(itemKey);
  }

  /**
   * Central sync method dengan enhanced duplicate prevention (Asynchronous)
   */
  async syncTransaction(transaksi: Transaksi): Promise<{ success: boolean; journalId?: string; message: string }> {
    this.loadSyncHistory();
    
    const itemKey = `transaction-${transaksi.id}`;
    
    // Prevent concurrent processing - ATOMIC LOCKING
    if (this.activeSyncs.has(transaksi.id)) {
      console.log(`🔄 Transaction ${transaksi.id} sync already in progress, skipping`);
      return { success: true, message: 'Sync in progress, skipping duplicate' };
    }
    
    // Set lock immediately to prevent race conditions during async checks
    this.activeSyncs.add(transaksi.id);

    // Check persistent sync status
    if (this.isAlreadySynced(itemKey)) {
      console.log(`🔄 Transaction ${transaksi.id} already synced (persistent), skipping`);
      return { success: true, message: 'Already synced (persistent)' };
    }

    // Check recent sync
    if (this.wasRecentlySynced(itemKey)) {
      console.log(`🔄 Transaction ${transaksi.id} was recently synced, skipping rapid duplicate`);
      return { success: true, message: 'Recently synced, skipping duplicate' };
    }

    // Check if journal entry already exists by reference
    // Prioritize human-readable nomorTransaksi for better auditability
    const referensiTXN = transaksi.nomorTransaksi || `TXN-${transaksi.id}`;
    let existingJournal = await getJurnalEntryByReference(referensiTXN);
    
    // If not found, and it looks like it might have come from a Pengajuan
    if (!existingJournal && transaksi.keterangan) {
      // Support NEW slash-based patterns and OLD dash-based legacy
      const pgMatch = transaksi.keterangan.match(/Pengajuan #([A-Z0-9/]+)/);
      if (pgMatch) {
        const pgRef = pgMatch[1]; // NOMOR_PENGAJUAN is enough for reference lookup
        existingJournal = await getJurnalEntryByReference(pgRef);
        
        // Fallback to legacy PG- prefix if needed
        if (!existingJournal) {
          existingJournal = await getJurnalEntryByReference(`PG-${pgMatch[1]}`);
        }
      }
    }

    if (existingJournal) {
      console.log(`📋 Journal already exists for transaction ${transaksi.id}: ${existingJournal.nomorJurnal}`);
      
      this.syncedItems.add(itemKey);
      this.markRecentSync(itemKey);
      this.saveSyncRecord({
        transactionId: transaksi.id,
        type: 'transaction',
        journalId: existingJournal.id,
        syncedAt: new Date().toISOString(),
        status: 'synced'
      });

      return { success: true, journalId: existingJournal.id, message: 'Journal already exists' };
    }

    // Lock already set at top of function

    try {
      if (transaksi.status !== "Sukses") {
        return { success: false, message: 'Transaction not successful, skipping sync' };
      }

      // Add small jitter (delay) to sequester timestamp-based ID generation from other threads
      const jitter = Math.floor(Math.random() * 40) + 10;
      await new Promise(resolve => setTimeout(resolve, jitter));

      console.log(`🔄 Starting centralized sync for transaction ${transaksi.id} (${transaksi.jenis}) [Ref: ${referensiTXN}]`);
      
      const journalEntry = await syncTransactionToAccounting(transaksi);
      
      if (journalEntry) {
        this.syncedItems.add(itemKey);
        this.markRecentSync(itemKey);
        
        this.saveSyncRecord({
          transactionId: transaksi.id,
          type: 'transaction',
          journalId: journalEntry.id,
          syncedAt: new Date().toISOString(),
          status: 'synced'
        });

        // Refresh member financial data
        this.refreshMemberFinancialData(transaksi.anggotaId);

        this.safeDispatchEvent('centralized-sync-completed', {
          transactionId: transaksi.id,
          transactionType: transaksi.jenis,
          journalId: journalEntry.id,
          journalNumber: journalEntry.nomorJurnal,
          timestamp: new Date().toISOString()
        });

        console.log(`✅ Centralized sync completed for ${transaksi.jenis} transaction ${transaksi.id} -> Journal ${journalEntry.nomorJurnal}`);
        
        // Update database with sync status for consistency
        await db.transaksi.update(transaksi.id, { 
          accountingSyncStatus: 'SUCCESS',
          updatedAt: new Date().toISOString()
        });
        
        return { success: true, journalId: journalEntry.id, message: 'Sync completed successfully' };
      } else {
        console.error(`❌ Failed to create journal entry for transaction ${transaksi.id}`);
        return { success: false, message: 'Failed to create journal entry' };
      }
    } catch (error) {
      console.error(`❌ Error syncing transaction ${transaksi.id}:`, error);
      
      this.saveSyncRecord({
        transactionId: transaksi.id,
        type: 'transaction',
        status: 'failed'
      });
      
      // Update database with failed status for consistency
      await db.transaksi.update(transaksi.id, { 
        accountingSyncStatus: 'FAILED',
        lastSyncError: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date().toISOString()
      });
      
      return { success: false, message: `Sync error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    } finally {
      this.activeSyncs.delete(transaksi.id);
    }
  }

  /**
   * Central sync method untuk pengajuan (Asynchronous)
   */
  async syncPengajuan(pengajuan: Pengajuan): Promise<{ success: boolean; journalId?: string; message: string }> {
    this.loadSyncHistory();
    
    const itemKey = `pengajuan-${pengajuan.id}`;
    
    if (pengajuan.status !== "Disetujui") {
      return { success: false, message: 'Pengajuan not approved, skipping sync' };
    }

    if (this.isAlreadySynced(itemKey)) {
      console.log(`🔄 Pengajuan ${pengajuan.id} already synced (persistent), skipping`);
      return { success: true, message: 'Already synced (persistent)' };
    }

    if (this.wasRecentlySynced(itemKey)) {
      console.log(`🔄 Pengajuan ${pengajuan.id} was recently synced, skipping rapid duplicate`);
      return { success: true, message: 'Recently synced, skipping duplicate' };
    }

    try {
      console.log(`🔄 Starting centralized sync for pengajuan ${pengajuan.id}`);
      
      const tempTransaction: Transaksi = {
        id: pengajuan.id, // Keep the same UUID for internal ID
        nomorTransaksi: pengajuan.nomorPengajuan, // Use nomorPengajuan as nomorTransaksi
        anggotaId: pengajuan.anggotaId,
        jenis: pengajuan.jenis,
        jumlah: pengajuan.jumlah,
        tanggal: pengajuan.tanggal,
        kategori: pengajuan.kategori,
        keterangan: `Approved from Application ${pengajuan.nomorPengajuan}: ${pengajuan.keterangan}`,
        status: "Sukses",
        createdAt: pengajuan.createdAt,
        updatedAt: pengajuan.updatedAt
      };

      const journalEntry = await syncTransactionToAccounting(tempTransaction);
      
      if (journalEntry) {
        this.syncedItems.add(itemKey);
        this.markRecentSync(itemKey);
        
        this.saveSyncRecord({
          transactionId: pengajuan.id,
          type: 'pengajuan',
          journalId: journalEntry.id,
          syncedAt: new Date().toISOString(),
          status: 'synced'
        });

        this.refreshMemberFinancialData(pengajuan.anggotaId);

        console.log(`✅ Centralized sync completed for pengajuan ${pengajuan.id} -> Journal ${journalEntry.nomorJurnal}`);
        return { success: true, journalId: journalEntry.id, message: 'Pengajuan sync completed successfully' };
      } else {
        return { success: false, message: 'Failed to create journal entry for pengajuan' };
      }
    } catch (error) {
      console.error(`❌ Error syncing pengajuan ${pengajuan.id}:`, error);
      return { success: false, message: `Pengajuan sync error: ${error instanceof Error ? error.message : 'Unknown error'}` };
    }
  }

  private safeDispatchEvent(eventName: string, detail: any): void {
    try {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent(eventName, { detail }));
      }
    } catch (error) {
      console.warn(`Failed to dispatch event ${eventName}:`, error);
    }
  }

  private refreshMemberFinancialData(anggotaId: string): void {
    try {
      // Legacy refreshFinancialCalculations call removed. 
      // Financial data updates are now handled via event dispatch.
      
      this.safeDispatchEvent('member-financial-data-updated', {
        anggotaId,
        timestamp: new Date().toISOString()
      });
      
      this.safeDispatchEvent('anggota-data-refresh-needed', {
        anggotaId,
        timestamp: new Date().toISOString()
      });
      
      console.log(`📊 Financial data refreshed for member ${anggotaId}`);
    } catch (error) {
      console.error(`Error refreshing financial data for member ${anggotaId}:`, error);
    }
  }

  getSyncStatus(): { totalSynced: number; syncedTransactions: string[] } {
    this.loadSyncHistory();
    return {
      totalSynced: this.syncedItems.size,
      syncedTransactions: Array.from(this.syncedItems)
    };
  }

  clearSyncCache(): void {
    this.syncedItems.clear();
    this.recentSyncs.clear();
    this.activeSyncs.clear();
    this.safeLocalStorageAccess(SYNC_TRACKER_KEY, [], 'set', []);
    this.safeLocalStorageAccess(RECENT_SYNC_KEY, [], 'set', []);
    console.log('🗑️ Centralized sync cache cleared');
  }
}

export const centralizedSync = CentralizedSyncService.getInstance();

export function initializeCentralizedSync(): void {
  try {
    console.log('🚀 Initializing centralized sync service...');
    
    // Cleanup old and potentially stale sync cache for version stabilization
    // This ensures that any previously failed or stuck syncs are cleared
    centralizedSync.clearSyncCache();
    console.log('🧹 Centralized sync cache cleared for stabilization');
    
    const addEventListeners = () => {
      if (typeof window === 'undefined') return;
      
      window.addEventListener('transaction-created', (event: any) => {
        const transaksi = event.detail.transaction;
        if (transaksi) {
          setTimeout(() => centralizedSync.syncTransaction(transaksi), 100);
        }
      });

      window.addEventListener('transaction-updated', (event: any) => {
        const transaksi = event.detail.transaction;
        if (transaksi) {
          setTimeout(() => centralizedSync.syncTransaction(transaksi), 100);
        }
      });

      // Note: pengajuan-approved listener removed to prevent double-sync.
      // Accounting sync is now handled solely via 'transaction-created' 
      // which is dispatched after the transaction is actually created.
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', addEventListeners);
    } else {
      addEventListeners();
    }

    console.log('✅ Centralized sync service initialized');
  } catch (error) {
    console.error('❌ Error initializing centralized sync service:', error);
  }
}
