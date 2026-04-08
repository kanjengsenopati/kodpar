
import { PemasukanPengeluaran } from "@/types";
import { 
  PEMASUKAN_PENGELUARAN_KEY, 
  getStorageData, 
  saveStorageData,
  initialPemasukanPengeluaran
} from "./baseService";

/**
 * Get all pemasukan & pengeluaran transactions
 */
export function getAllPemasukanPengeluaran(): PemasukanPengeluaran[] {
  return getStorageData<PemasukanPengeluaran[]>(PEMASUKAN_PENGELUARAN_KEY, initialPemasukanPengeluaran);
}

/**
 * Get transaction by ID
 */
export function getPemasukanPengeluaranById(id: string): PemasukanPengeluaran | undefined {
  const transactions = getAllPemasukanPengeluaran();
  return transactions.find(transaction => transaction.id === id);
}

/**
 * Generate new transaction ID
 */
export function generatePemasukanPengeluaranId(): string {
  const transactions = getAllPemasukanPengeluaran();
  const lastId = transactions.length > 0
    ? parseInt(transactions[transactions.length - 1].id.replace("PP", ""))
    : 0;
  
  return `PP${String(lastId + 1).padStart(4, "0")}`;
}

/**
 * Create new income or expense transaction
 */
export function createPemasukanPengeluaran(transaction: Omit<PemasukanPengeluaran, "id" | "createdAt" | "updatedAt">): PemasukanPengeluaran {
  const transactions = getAllPemasukanPengeluaran();
  const now = new Date().toISOString();
  
  const newTransaction: PemasukanPengeluaran = {
    ...transaction,
    id: generatePemasukanPengeluaranId(),
    createdAt: now,
    updatedAt: now
  };
  
  transactions.push(newTransaction);
  saveStorageData(PEMASUKAN_PENGELUARAN_KEY, transactions);
  
  return newTransaction;
}

/**
 * Update transaction
 */
export function updatePemasukanPengeluaran(id: string, transaction: Partial<PemasukanPengeluaran>): PemasukanPengeluaran | null {
  const transactions = getAllPemasukanPengeluaran();
  const index = transactions.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  transactions[index] = {
    ...transactions[index],
    ...transaction,
    updatedAt: new Date().toISOString()
  };
  
  saveStorageData(PEMASUKAN_PENGELUARAN_KEY, transactions);
  return transactions[index];
}

/**
 * Delete transaction
 */
export function deletePemasukanPengeluaran(id: string): boolean {
  const transactions = getAllPemasukanPengeluaran();
  const filteredTransactions = transactions.filter(t => t.id !== id);
  
  if (filteredTransactions.length === transactions.length) return false;
  
  saveStorageData(PEMASUKAN_PENGELUARAN_KEY, filteredTransactions);
  return true;
}

/**
 * Get transactions by type
 */
export function getPemasukanPengeluaranByJenis(jenis: "Pemasukan" | "Pengeluaran"): PemasukanPengeluaran[] {
  const transactions = getAllPemasukanPengeluaran();
  return transactions.filter(t => t.jenis === jenis);
}

/**
 * Get transactions by period
 */
export function getPemasukanPengeluaranByPeriod(startDate: string, endDate: string): PemasukanPengeluaran[] {
  const transactions = getAllPemasukanPengeluaran();
  return transactions.filter(t => {
    const transactionDate = new Date(t.tanggal).getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return transactionDate >= start && transactionDate <= end;
  });
}
