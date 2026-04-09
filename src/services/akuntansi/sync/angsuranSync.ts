import { Transaksi } from "@/types";
import { JurnalEntry } from "@/types/akuntansi";
import { getAllTransaksi } from "../../transaksi/transaksiCore";
import { createAngsuranJournalEntry } from "../journalCreationService";
import { calculateAngsuranAllocation } from "../allocationService";
import { syncAngsuranToKeuangan } from "./keuanganSync";
import { db } from "@/db/db";

/**
 * Sync Angsuran transaction with PURE DATABASE-DRIVEN allocation (SAK EP)
 * ENSURES: No hybrid string parsing in the active synchronization path.
 */
export async function syncAngsuranTransaction(transaksi: Transaksi): Promise<JurnalEntry | null> {
  try {
    const allTransaksi = await getAllTransaksi();
    
    // 1. PURE DB: Use the structured reference field exclusively
    const loanId = transaksi.referensiPinjamanId;
    
    if (!loanId) {
      console.warn(`❌ Consistency Error: No structured loan reference for angsuran ${transaksi.id}. Please perform a 'Full Rebuild' to recover legacy data.`);
      return null;
    }

    const originalLoan = allTransaksi.find(t => t.id === loanId && t.jenis === "Pinjam");
    
    if (!originalLoan) {
      console.warn(`❌ Integrity Error: Loan ${loanId} not found in Koperasi DB`);
      return null;
    }

    // 2. Database-Driven Allocation (Pokok vs Jasa)
    const allocation = calculateAngsuranAllocation(originalLoan, transaksi.jumlah || 0);
    
    // 3. Persistence: Ensure structured components are updated
    await db.transaksi.update(transaksi.id, {
      nominalPokok: allocation.nominalPokok,
      nominalJasa: allocation.nominalJasa,
      updatedAt: new Date().toISOString()
    });

    console.log(`📑 SAK EP Captured: ${transaksi.id} (Pokok:${allocation.nominalPokok}, Jasa:${allocation.nominalJasa})`);

    // 4. Sync interest (Jasa) portion to Koperasi Revenue
    syncAngsuranToKeuangan(transaksi);
    
    return createAngsuranJournalEntry(transaksi, originalLoan, allocation);
  } catch (error) {
    console.error(`❌ SAK EP Sync failure for transaction ${transaksi.id}:`, error);
    return null;
  }
}
