import { Transaksi } from "@/types";
import { JurnalEntry } from "@/types/akuntansi";
import { getAllTransaksi } from "../../transaksiService";
import { createAngsuranJournalEntry } from "../journalCreationService";
import { calculateAngsuranAllocation } from "../allocationService";
import { syncAngsuranToKeuangan } from "./keuanganSync";
import { db } from "@/db/db";

/**
 * Sync Angsuran transaction with proper allocation and SAK EP persistence
 */
export async function syncAngsuranTransaction(transaksi: Transaksi): Promise<JurnalEntry | null> {
  try {
    // Find the original loan transaction
    const allTransaksi = await getAllTransaksi();
    const loanMatch = transaksi.keterangan?.match(/Pinjaman: (TR\d+)/);
    
    if (!loanMatch) {
      console.warn(`Cannot find loan reference in angsuran ${transaksi.id}`);
      return null;
    }

    const loanId = loanMatch[1];
    const originalLoan = allTransaksi.find(t => t.id === loanId && t.jenis === "Pinjam");
    
    if (!originalLoan) {
      console.warn(`Original loan ${loanId} not found for angsuran ${transaksi.id}`);
      return null;
    }

    // Calculate proper allocation (Pokok vs Jasa)
    const allocation = calculateAngsuranAllocation(originalLoan, transaksi.jumlah || 0);
    
    // SAK EP Persistence: Store structured components back to the transaction record
    await db.transaksi.update(transaksi.id, {
      nominalPokok: allocation.nominalPokok,
      nominalJasa: allocation.nominalJasa,
      updatedAt: new Date().toISOString()
    });

    console.log(`📑 SAK EP Data Captured for ${transaksi.id}: Pokok=${allocation.nominalPokok}, Jasa=${allocation.nominalJasa}`);

    // Sync interest portion to Keuangan
    syncAngsuranToKeuangan(transaksi);
    
    return createAngsuranJournalEntry(transaksi, originalLoan, allocation);
  } catch (error) {
    console.error(`Error syncing angsuran transaction ${transaksi.id}:`, error);
    return null;
  }
}
