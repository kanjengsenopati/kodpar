
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { Transaksi, PemasukanPengeluaran } from "@/types";

/**
 * Delete all Simpan, Pinjam, and Angsuran transaction data completely
 * This function removes all transaction records for these types
 */
export function deleteTransactionData(): number {
  const TRANSAKSI_KEY = "koperasi_transaksi";
  
  // Get current transactions
  const currentTransaksi = getFromLocalStorage<Transaksi[]>(TRANSAKSI_KEY, []);
  
  // Filter out all Simpan, Pinjam, and Angsuran transactions
  const filteredTransaksi = currentTransaksi.filter(transaksi => 
    !["Simpan", "Pinjam", "Angsuran"].includes(transaksi.jenis)
  );
  
  // Save filtered transactions (effectively deleting Simpan, Pinjam, Angsuran data)
  saveToLocalStorage(TRANSAKSI_KEY, filteredTransaksi);
  
  const deletedCount = currentTransaksi.length - filteredTransaksi.length;
  console.log(`Deleted ${deletedCount} transaction records (Simpan, Pinjam, Angsuran)`);
  return deletedCount;
}

/**
 * Clear all journal entries (accounting data)
 */
export function deleteJournalData(): number {
  const JURNAL_KEY = "jurnal_entries";
  
  // Get current journal entries
  const currentJournals = getFromLocalStorage<any[]>(JURNAL_KEY, []);
  const deletedCount = currentJournals.length;
  
  // Clear all journal entries
  saveToLocalStorage(JURNAL_KEY, []);
  
  console.log(`Deleted ${deletedCount} journal entries`);
  return deletedCount;
}

/**
 * Reset all transaction nominal data to null while keeping other data intact
 * This function ensures Dashboard charts show null values
 */
export function resetTransactionNominalData(): number {
  const TRANSAKSI_KEY = "koperasi_transaksi";
  
  // Get current transactions
  const currentTransaksi = getFromLocalStorage<Transaksi[]>(TRANSAKSI_KEY, []);
  
  // Reset only nominal amounts to null, keep all other data
  const resetTransaksi = currentTransaksi.map(transaksi => ({
    ...transaksi,
    jumlah: null, // Reset nominal amount to null for Dashboard calculations
    updatedAt: new Date().toISOString()
  }));
  
  // Save updated transactions
  saveToLocalStorage(TRANSAKSI_KEY, resetTransaksi);
  
  console.log(`Reset nominal data for ${resetTransaksi.length} remaining transactions`);
  return resetTransaksi.length;
}

/**
 * Reset all keuangan transaction amounts to null
 */
export function resetKeuanganNominalData(): number {
  const KEUANGAN_KEY = "koperasi_pemasukan_pengeluaran";
  
  // Get current keuangan transactions
  const currentKeuangan = getFromLocalStorage<PemasukanPengeluaran[]>(KEUANGAN_KEY, []);
  
  // Reset only nominal amounts to null, keep all other data
  const resetKeuangan = currentKeuangan.map(transaksi => ({
    ...transaksi,
    jumlah: null, // Reset nominal amount to null
    updatedAt: new Date().toISOString()
  }));
  
  // Save updated keuangan transactions
  saveToLocalStorage(KEUANGAN_KEY, resetKeuangan);
  
  console.log(`Reset keuangan nominal data for ${resetKeuangan.length} transactions`);
  return resetKeuangan.length;
}

/**
 * Reset financial summary data (if stored separately)
 */
export function resetFinancialSummaryData(): void {
  // Clear any cached financial calculations to ensure fresh null-based calculations
  const financialKeys = [
    'koperasi_financial_cache',
    'koperasi_shu_cache',
    'last_accounting_sync',
    'koperasi_jurnal_entries',
    'koperasi_buku_besar_cache'
  ];
  
  financialKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log("Financial summary data cleared for null data reset");
}

/**
 * Clean reset of transaction and accounting data only
 */
export function cleanResetTransactionAndAccounting(): { 
  deletedTransactions: number; 
  deletedJournals: number;
  resetCount: number; 
  keuanganCount: number;
  totalAffected: number;
} {
  console.log("🔄 Starting clean reset of transaction and accounting data...");
  
  const deletedTransactions = deleteTransactionData();
  const deletedJournals = deleteJournalData();
  const resetCount = resetTransactionNominalData();
  const keuanganCount = resetKeuanganNominalData();
  resetFinancialSummaryData();
  
  const totalAffected = deletedTransactions + deletedJournals + resetCount + keuanganCount;
  
  console.log(`✅ Clean reset completed: Deleted ${deletedTransactions} transactions, ${deletedJournals} journals, reset ${resetCount + keuanganCount} amounts`);
  
  return { deletedTransactions, deletedJournals, resetCount, keuanganCount, totalAffected };
}

/**
 * Complete deletion of Simpan, Pinjam, Angsuran data and reset remaining amounts to null
 */
export function deleteAndResetTransactionData(): { deletedCount: number; resetCount: number; keuanganCount: number } {
  const deletedCount = deleteTransactionData();
  const resetCount = resetTransactionNominalData();
  const keuanganCount = resetKeuanganNominalData();
  resetFinancialSummaryData();
  
  console.log(`Complete operation: Deleted ${deletedCount} transactions (Simpan, Pinjam, Angsuran), reset ${resetCount} remaining transactions to null amounts`);
  return { deletedCount, resetCount, keuanganCount };
}

/**
 * Reset all POS/Penjualan transaction amounts to zero
 */
export function resetPOSNominalData(): number {
  const PENJUALAN_KEY = "koperasi_penjualan";
  
  // Get current penjualan transactions
  const currentPenjualan = getFromLocalStorage<any[]>(PENJUALAN_KEY, []);
  
  // Reset only nominal amounts in penjualan data
  const resetPenjualan = currentPenjualan.map(penjualan => ({
    ...penjualan,
    total: 0,
    subtotal: 0,
    dibayar: 0,
    kembalian: 0,
    items: penjualan.items?.map((item: any) => ({
      ...item,
      harga: 0,
      total: 0
    })) || [],
    updatedAt: new Date().toISOString()
  }));
  
  // Save updated penjualan transactions
  saveToLocalStorage(PENJUALAN_KEY, resetPenjualan);
  
  console.log(`Reset POS nominal data for ${resetPenjualan.length} transactions`);
  return resetPenjualan.length;
}

/**
 * Master function to delete Simpan/Pinjam/Angsuran data and reset all remaining amounts to null
 */
export function resetAllMonetaryValues(): { 
  deletedCount: number; 
  resetCount: number;
  keuanganCount: number; 
  posCount: number;
  totalAffected: number;
} {
  console.log("🔄 Starting complete data deletion and reset for Simpan, Pinjam, Angsuran + null amounts for Dashboard...");
  
  const deletedCount = deleteTransactionData();
  const resetCount = resetTransactionNominalData();
  const keuanganCount = resetKeuanganNominalData();
  const posCount = resetPOSNominalData();
  resetFinancialSummaryData();
  
  const totalAffected = deletedCount + resetCount + keuanganCount + posCount;
  
  console.log(`✅ Complete operation finished: Deleted ${deletedCount} transactions (Simpan, Pinjam, Angsuran), reset ${resetCount + keuanganCount + posCount} remaining amounts to null/zero`);
  
  return { deletedCount, resetCount, keuanganCount, posCount, totalAffected };
}
