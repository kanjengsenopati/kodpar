
import { ChartOfAccount } from "@/types/akuntansi";

const COA_STORAGE_KEY = "chart_of_accounts";
const COA_VERSION_KEY = "coa_data_version";
const CURRENT_COA_VERSION = "3.0"; // Increment this to force reset for all users

// Standardized Chart of Accounts - Database Driven (NeonDB SSOT)
// No more local static initial data.

/**
 * Get all Chart of Accounts from Local Mirror (IndexedDB)
 */
export function getAllChartOfAccounts(): ChartOfAccount[] {
  // coaService now relies on neonMasterSync for data and Dexie for local access
  return []; // UI components should use useLiveQuery with db.coa
}


/**
 * Get COA ID by account code
 */
export function getCoaIdByCode(code: string): string {
  const accounts = getAllChartOfAccounts();
  const account = accounts.find(acc => acc.kode === code);
  return account ? account.id : "";
}

/**
 * Get COA by account code
 */
export function getCoaByCode(code: string): ChartOfAccount | undefined {
  const accounts = getAllChartOfAccounts();
  return accounts.find(acc => acc.kode === code);
}

/**
 * Get Chart of Account by ID
 */
export function getChartOfAccountById(id: string): ChartOfAccount | undefined {
  const accounts = getAllChartOfAccounts();
  return accounts.find(account => account.id === id);
}

/**
 * Create new Chart of Account
 */
export function createChartOfAccount(account: Omit<ChartOfAccount, "id" | "createdAt" | "updatedAt">): ChartOfAccount {
  const accounts = getAllChartOfAccounts();
  
  // Check if code already exists
  const existingAccount = accounts.find(acc => acc.kode === account.kode);
  if (existingAccount) {
    throw new Error("Kode akun sudah digunakan");
  }
  
  const newAccount: ChartOfAccount = {
    ...account,
    id: generateUUIDv7(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  accounts.push(newAccount);
  localStorage.setItem(COA_STORAGE_KEY, JSON.stringify(accounts));
  
  return newAccount;
}

/**
 * Update Chart of Account
 */
export function updateChartOfAccount(id: string, updates: Partial<ChartOfAccount>): ChartOfAccount {
  const accounts = getAllChartOfAccounts();
  const index = accounts.findIndex(acc => acc.id === id);
  
  if (index === -1) {
    throw new Error("Akun tidak ditemukan");
  }
  
  // Check if new code conflicts with existing accounts
  if (updates.kode && updates.kode !== accounts[index].kode) {
    const existingAccount = accounts.find(acc => acc.kode === updates.kode && acc.id !== id);
    if (existingAccount) {
      throw new Error("Kode akun sudah digunakan");
    }
  }
  
  accounts[index] = {
    ...accounts[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(COA_STORAGE_KEY, JSON.stringify(accounts));
  
  return accounts[index];
}

/**
 * Delete Chart of Account
 */
export function deleteChartOfAccount(id: string): boolean {
  const accounts = getAllChartOfAccounts();
  const filteredAccounts = accounts.filter(acc => acc.id !== id);
  
  if (filteredAccounts.length === accounts.length) {
    throw new Error("Akun tidak ditemukan");
  }
  
  localStorage.setItem(COA_STORAGE_KEY, JSON.stringify(filteredAccounts));
  return true;
}

/**
 * Generate next account code
 */
export function generateNextAccountCode(jenis: ChartOfAccount['jenis']): string {
  const accounts = getAllChartOfAccounts();
  const jenisAccounts = accounts.filter(acc => acc.jenis === jenis);
  
  const baseCode = {
    'ASET': 1000,
    'KEWAJIBAN': 2000,
    'MODAL': 3000,
    'PENDAPATAN': 4000,
    'BEBAN': 5000
  };
  
  const startCode = baseCode[jenis];
  const existingCodes = jenisAccounts
    .map(acc => parseInt(acc.kode))
    .filter(code => !isNaN(code) && code >= startCode && code < startCode + 1000)
    .sort((a, b) => b - a);
  
  if (existingCodes.length === 0) {
    return startCode.toString();
  }
  
  return (existingCodes[0] + 10).toString();
}
