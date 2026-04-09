import { Transaksi } from "@/types";
import { JurnalEntry } from "@/types/akuntansi";
import { getJurnalEntryByReference } from "../jurnalService";
import { 
  createSimpananJournalEntry,
  createPinjamanJournalEntry,
  createPenarikanJournalEntry
} from "../journalCreationService";
import { syncAngsuranTransaction } from "./angsuranSync";
import { syncSimpananToKeuangan, syncPenarikanToKeuangan } from "./keuanganSync";

// Global sync tracker to prevent concurrent syncs for the same transaction
const activeSyncs = new Set<string>();

/**
 * Main function to sync any transaction to accounting system with enhanced duplicate prevention
 * WARNING: This should only be called by centralized sync service to prevent duplicates
 */
export async function syncTransactionToAccounting(transaksi: Transaksi): Promise<JurnalEntry | null> {
  try {
    const referensi = `TXN-${transaksi.id}`;
    
    // Check if sync is already in progress for this transaction
    if (activeSyncs.has(transaksi.id)) {
      console.log(`🔄 Sync already in progress for transaction ${transaksi.id}, skipping duplicate sync`);
      const existing = await getJurnalEntryByReference(referensi);
      return existing || null;
    }
    
    // Add to active syncs to prevent concurrent processing
    activeSyncs.add(transaksi.id);
    
    try {
      // Check if journal entry already exists for this transaction
      let existingEntry = await getJurnalEntryByReference(referensi);
      
      // If not found, check if it exists via PG- reference (Application-based)
      if (!existingEntry && transaksi.keterangan && transaksi.keterangan.includes('Pengajuan #')) {
        const pgMatch = transaksi.keterangan.match(/Pengajuan #([A-Z0-9]+)/);
        if (pgMatch) {
          existingEntry = await getJurnalEntryByReference(`PG-${pgMatch[1]}`);
        }
      }

      if (existingEntry) {
        console.log(`✅ Journal entry already exists for transaction ${transaksi.id} (Reference Check: ${existingEntry.nomorJurnal})`);
        return existingEntry;
      }
      
      console.log(`🔄 Starting accounting sync for transaction ${transaksi.id} (${transaksi.jenis})`);
      
      let journalEntry: JurnalEntry | null = null;

      switch (transaksi.jenis) {
        case "Simpan":
          journalEntry = await createSimpananJournalEntry(transaksi);
          if (journalEntry) {
            await syncSimpananToKeuangan(transaksi);
          }
          break;
          
        case "Pinjam":
          journalEntry = await createPinjamanJournalEntry(transaksi);
          // Note: Keuangan sync for loans is handled by auto-deduction processor
          break;
          
        case "Angsuran":
          journalEntry = await syncAngsuranTransaction(transaksi);
          break;
          
        case "Penarikan":
          journalEntry = await createPenarikanJournalEntry(transaksi);
          if (journalEntry) {
            await syncPenarikanToKeuangan(transaksi);
          }
          break;
          
        default:
          console.warn(`Unsupported transaction type for accounting sync: ${transaksi.jenis}`);
          return null;
      }

      if (journalEntry) {
        console.log(`✅ Accounting sync completed for ${transaksi.jenis} transaction ${transaksi.id} -> Journal ${journalEntry.nomorJurnal}`);
      }

      return journalEntry;
    } finally {
      // Always remove from active syncs when done
      activeSyncs.delete(transaksi.id);
    }
  } catch (error) {
    console.error(`❌ Failed to sync transaction ${transaksi.id} to accounting:`, error);
    // Remove from active syncs on error too
    activeSyncs.delete(transaksi.id);
    return null;
  }
}

/**
 * Get active sync status for debugging
 */
export function getActiveSyncStatus(): { activeTransactions: string[], count: number } {
  return {
    activeTransactions: Array.from(activeSyncs),
    count: activeSyncs.size
  };
}

/**
 * Clear active syncs (for debugging/testing only)
 */
export function clearActiveSyncs(): void {
  activeSyncs.clear();
  console.log('🗑️ Active syncs cache cleared');
}
