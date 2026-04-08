
import { Transaksi } from "@/types";
import { JurnalEntry } from "@/types/akuntansi";
import { getAllTransaksi } from "../../transaksiService";
import { createAngsuranJournalEntry } from "../journalCreationService";
import { calculateAngsuranAllocation } from "../allocationService";
import { syncAngsuranToKeuangan } from "./keuanganSync";

/**
 * Sync Angsuran transaction with proper allocation
 */
export function syncAngsuranTransaction(transaksi: Transaksi): JurnalEntry | null {
  try {
    // Find the original loan transaction
    const allTransaksi = getAllTransaksi();
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

    // Calculate proper allocation
    const allocation = calculateAngsuranAllocation(originalLoan, transaksi.jumlah);
    
    // Sync interest portion to Keuangan
    syncAngsuranToKeuangan(transaksi);
    
    return createAngsuranJournalEntry(transaksi, originalLoan, allocation);
  } catch (error) {
    console.error(`Error syncing angsuran transaction ${transaksi.id}:`, error);
    return null;
  }
}
