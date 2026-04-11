
import { db } from "@/db/db";
import { generateSakEpDetails, validateSakEpBalance } from "./sakEpIntegrity";
import { prepareJurnalEntry, getJurnalEntryByReference } from "./jurnalService";
import { Transaksi } from "@/types";

/**
 * SAK EP Repair Service (Legacy Integrity Support)
 * Identifies and fixes orphan transactions that lack valid double-entry ledger journals.
 */
export async function runSakEpRepair() {
  console.log("🛠️ Starting SAK EP Integrity Repair Routine...");
  
  const results = {
    scanned: 0,
    orphansFound: 0,
    fixed: 0,
    failed: 0
  };

  try {
    const allTransactions = await db.transaksi.toArray();
    results.scanned = allTransactions.length;

    for (const tx of allTransactions) {
      const referensi = `TXN-${tx.id}`;
      
      // 1. Check if journal entry exists
      const existingJurnal = await getJurnalEntryByReference(referensi);
      
      if (!existingJurnal) {
        results.orphansFound++;
        console.log(`🔍 Found orphan transaction: ${tx.nomorTransaksi} (${tx.id})`);
        
        try {
          await fixOrphanTransaction(tx);
          results.fixed++;
        } catch (err) {
          results.failed++;
          console.error(`❌ Failed to fix transaction ${tx.id}:`, err);
        }
      } else if (tx.accountingSyncStatus !== 'SUCCESS') {
        // Just update status if journal exists but status is wrong
        await db.transaksi.update(tx.id, { accountingSyncStatus: 'SUCCESS' });
      }
    }

    console.log("✅ SAK EP Repair Routine Completed.", results);
    return results;
  } catch (error) {
    console.error("Critical error in SAK EP Repair:", error);
    throw error;
  }
}

/**
 * Atomic fix for a single orphan transaction
 */
async function fixOrphanTransaction(tx: Transaksi) {
  return await db.transaction('rw', [db.transaksi, db.jurnal], async () => {
    // A. Generate SAK EP Details
    const details = generateSakEpDetails(tx);
    
    // B. Validate Balance
    if (!validateSakEpBalance(details)) {
      throw new Error("Jurnal tidak seimbang, perbaikan dibatalkan.");
    }

    // C. Prepare Journal
    const journalEntry = await prepareJurnalEntry({
      tanggal: tx.tanggal,
      deskripsi: tx.keterangan || `[REPAIR] Transaksi ${tx.jenis} #${tx.nomorTransaksi}`,
      referensi: `TXN-${tx.id}`,
      details,
      status: 'POSTED'
    });

    // D. Commit Journal and Update Status
    await db.jurnal.add(journalEntry);
    await db.transaksi.update(tx.id, { 
      accountingSyncStatus: 'SUCCESS' 
    });
    
    console.log(`✨ Successfully generated SAK-EP Ledger for ${tx.nomorTransaksi}`);
  });
}
