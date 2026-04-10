
import { ChartOfAccount } from "@/types/akuntansi";

const COA_STORAGE_KEY = "chart_of_accounts";
const COA_VERSION_KEY = "coa_data_version";
const CURRENT_COA_VERSION = "3.0"; // Increment this to force reset for all users

// Standardized initial Chart of Accounts data
const initialChartOfAccounts: ChartOfAccount[] = [
  // ASET (1000s)
  {
    id: "coa-kas",
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
    id: "coa-piutang-anggota",
    kode: "1100",
    nama: "PIUTANG ANGGOTA",
    jenis: "ASET",
    kategori: "Aset Lancar",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Piutang pokok pinjaman dari anggota",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-cadangan-kerugian-piutang",
    kode: "1190",
    nama: "CADANGAN KERUGIAN PIUTANG",
    jenis: "ASET",
    kategori: "Aset Lancar",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Penyisihan kerugian piutang tak tertagih (Kontra-Aset)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-investasi",
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
  // KEWAJIBAN (2000s)
  {
    id: "coa-simpanan-sukarela",
    kode: "2100",
    nama: "SIMPANAN SUKARELA",
    jenis: "KEWAJIBAN",
    kategori: "Kewajiban Lancar",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Simpanan sukarela anggota (Liabilitas)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-utang-usaha",
    kode: "2200",
    nama: "UTANG USAHA",
    jenis: "KEWAJIBAN",
    kategori: "Kewajiban Lancar",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Utang kepada pihak ketiga",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // EKUITAS / MODAL (3000s)
  {
    id: "coa-simpanan-pokok",
    kode: "3100",
    nama: "SIMPANAN POKOK",
    jenis: "MODAL",
    kategori: "Modal",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Simpanan pokok anggota (Ekuitas)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-simpanan-wajib",
    kode: "3200",
    nama: "SIMPANAN WAJIB",
    jenis: "MODAL",
    kategori: "Modal",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Simpanan wajib anggota (Ekuitas)",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-modal-dasar",
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
    id: "coa-cadangan-umum",
    kode: "3300",
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
  // PENDAPATAN (4000s)
  {
    id: "coa-pendapatan-jasa-pinjaman",
    kode: "4000",
    nama: "PENDAPATAN JASA PINJAMAN",
    jenis: "PENDAPATAN",
    kategori: "Pendapatan Operasional",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Pendapatan dari bunga/jasa pinjaman",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-pendapatan-lain",
    kode: "4100",
    nama: "PENDAPATAN LAIN-LAIN",
    jenis: "PENDAPATAN",
    kategori: "Pendapatan Non-Operasional",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "KREDIT",
    deskripsi: "Pendapatan dari sumber lain non-koperasi",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  // BEBAN (5000s)
  {
    id: "coa-beban-operasional",
    kode: "5000",
    nama: "BEBAN OPERASIONAL",
    jenis: "BEBAN",
    kategori: "Beban Operasional",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Beban operasional harian",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "coa-beban-administrasi",
    kode: "5100",
    nama: "BEBAN ADMINISTRASI",
    jenis: "BEBAN",
    kategori: "Beban Operasional",
    level: 1,
    isGroup: false,
    isActive: true,
    saldoNormal: "DEBIT",
    deskripsi: "Beban administrasi kantor",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Get all Chart of Accounts with version check and automatic reset
 */
export function getAllChartOfAccounts(): ChartOfAccount[] {
  try {
    const data = localStorage.getItem(COA_STORAGE_KEY);
    const version = localStorage.getItem(COA_VERSION_KEY);
    
    // Force reset if no data, no version, or version mismatch
    if (!data || !version || version !== CURRENT_COA_VERSION) {
      console.log(`🔄 Standardizing Chart of Accounts to version ${CURRENT_COA_VERSION}...`);
      localStorage.setItem(COA_STORAGE_KEY, JSON.stringify(initialChartOfAccounts));
      localStorage.setItem(COA_VERSION_KEY, CURRENT_COA_VERSION);
      return initialChartOfAccounts;
    }
    
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading chart of accounts:", error);
    return initialChartOfAccounts;
  }
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
