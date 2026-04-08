
import { ChartOfAccount } from "@/types/akuntansi";

const COA_STORAGE_KEY = "chart_of_accounts";

// Initial Chart of Accounts data
const initialChartOfAccounts: ChartOfAccount[] = [
  // ASET
  {
    id: "coa-1",
    kode: "1000",
    nama: "KAS",
    jenis: "ASET",
    kategori: "Aset Lancar",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Kas di tangan dan bank",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-2",
    kode: "1100",
    nama: "PIUTANG ANGGOTA",
    jenis: "ASET",
    kategori: "Aset Lancar",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Piutang dari anggota koperasi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-3",
    kode: "1200",
    nama: "INVESTASI JANGKA PANJANG",
    jenis: "ASET",
    kategori: "Aset Tetap",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Investasi jangka panjang koperasi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // KEWAJIBAN
  {
    id: "coa-4",
    kode: "2000",
    nama: "SIMPANAN ANGGOTA",
    jenis: "KEWAJIBAN",
    kategori: "Kewajiban Lancar",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Simpanan pokok dan wajib anggota",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-5",
    kode: "2100",
    nama: "SIMPANAN SUKARELA",
    jenis: "KEWAJIBAN",
    kategori: "Kewajiban Lancar",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Simpanan sukarela anggota",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // MODAL
  {
    id: "coa-6",
    kode: "3000",
    nama: "MODAL DASAR",
    jenis: "MODAL",
    kategori: "Modal",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Modal dasar koperasi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-7",
    kode: "3100",
    nama: "CADANGAN UMUM",
    jenis: "MODAL",
    kategori: "Modal",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Cadangan umum koperasi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // PENDAPATAN
  {
    id: "coa-8",
    kode: "4000",
    nama: "PENDAPATAN JASA",
    jenis: "PENDAPATAN",
    kategori: "Pendapatan Operasional",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Pendapatan dari jasa pinjaman",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-9",
    kode: "4100",
    nama: "PENDAPATAN LAIN-LAIN",
    jenis: "PENDAPATAN",
    kategori: "Pendapatan Non-Operasional",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Pendapatan lain-lain",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // BEBAN
  {
    id: "coa-10",
    kode: "5000",
    nama: "BEBAN OPERASIONAL",
    jenis: "BEBAN",
    kategori: "Beban Operasional",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Beban operasional koperasi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-11",
    kode: "5100",
    nama: "BEBAN ADMINISTRASI",
    jenis: "BEBAN",
    kategori: "Beban Operasional",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Beban administrasi dan umum",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Get all Chart of Accounts
 */
export function getAllChartOfAccounts(): ChartOfAccount[] {
  try {
    const data = localStorage.getItem(COA_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(COA_STORAGE_KEY, JSON.stringify(initialChartOfAccounts));
      return initialChartOfAccounts;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading chart of accounts:", error);
    return initialChartOfAccounts;
  }
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
    id: `coa-${Date.now()}`,
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
