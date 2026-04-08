
import { PemasukanPengeluaran, NeracaKeuangan } from "@/types";
import { getAllPemasukanPengeluaran, getPemasukanPengeluaranByPeriod } from "./transaksiService";

/**
 * Calculate financial balance for a specific period
 */
export function calculateNeracaKeuangan(bulan: string, tahun: number): NeracaKeuangan {
  const startDate = `${tahun}-${bulan.padStart(2, '0')}-01`;
  const endDate = `${tahun}-${bulan.padStart(2, '0')}-31`;
  
  const transactions = getPemasukanPengeluaranByPeriod(startDate, endDate);
  
  const totalPemasukan = transactions
    .filter(t => t.jenis === "Pemasukan")
    .reduce((sum, t) => sum + t.jumlah, 0);
    
  const totalPengeluaran = transactions
    .filter(t => t.jenis === "Pengeluaran")
    .reduce((sum, t) => sum + t.jumlah, 0);
  
  // Calculate previous month balance (simplified for demo)
  const saldoAwal = 0; // This would come from previous month's saldo akhir
  const saldoAkhir = saldoAwal + totalPemasukan - totalPengeluaran;
  
  return {
    bulan,
    tahun,
    totalPemasukan,
    totalPengeluaran,
    saldoAwal,
    saldoAkhir
  };
}

/**
 * Generate financial balance report (alias for calculateNeracaKeuangan)
 */
export function generateNeracaKeuangan(bulan: number, tahun: number): NeracaKeuangan {
  return calculateNeracaKeuangan(bulan.toString(), tahun);
}

/**
 * Get financial summary for dashboard
 */
export function getFinancialSummary() {
  const allTransactions = getAllPemasukanPengeluaran();
  
  const totalPemasukan = allTransactions
    .filter(t => t.jenis === "Pemasukan")
    .reduce((sum, t) => sum + t.jumlah, 0);
    
  const totalPengeluaran = allTransactions
    .filter(t => t.jenis === "Pengeluaran")
    .reduce((sum, t) => sum + t.jumlah, 0);
  
  return {
    totalPemasukan,
    totalPengeluaran,
    netIncome: totalPemasukan - totalPengeluaran,
    transactionCount: allTransactions.length
  };
}

/**
 * Sync transactions to accounting system (placeholder for future implementation)
 */
export function syncToAccounting(transaction: PemasukanPengeluaran): void {
  // This function will handle the auto-synchronization with the accounting system
  // For now, it's a placeholder that can be implemented when the accounting integration is ready
  console.log(`Syncing transaction ${transaction.id} to accounting system...`);
  
  // Future implementation would:
  // 1. Create journal entries based on the transaction
  // 2. Update relevant accounts (Cash, Revenue, Expense accounts)
  // 3. Maintain audit trail of the sync
}
