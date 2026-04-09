import { getFromLocalStorage, clearLocalStorage } from "@/utils/localStorage";
import { db } from "@/db/db";

export interface BulkResetOptions {
  resetTransactions?: boolean;
  resetAnggota?: boolean;
  resetKeuangan?: boolean;
  resetPOS?: boolean;
  resetAkuntansi?: boolean;
  resetPengaturan?: boolean;
  resetAudit?: boolean;
  resetCache?: boolean;
}

export interface BulkResetResult {
  success: boolean;
  message: string;
  details: {
    transactionsReset: number;
    anggotaReset: number;
    keuanganReset: number;
    posReset: number;
    akuntansiReset: number;
    otherDataReset: number;
  };
}

/**
 * Perform bulk reset with selective options covering both LocalStorage and IndexedDB
 */
export async function performBulkReset(options: BulkResetOptions): Promise<BulkResetResult> {
  console.log('🔄 Starting unified bulk reset operation...', options);
  
  const result: BulkResetResult = {
    success: false,
    message: '',
    details: {
      transactionsReset: 0,
      anggotaReset: 0,
      keuanganReset: 0,
      posReset: 0,
      akuntansiReset: 0,
      otherDataReset: 0
    }
  };
  
  try {
    // 1. Reset Transactions & Pengajuan (IndexedDB + LocalStorage)
    if (options.resetTransactions) {
      await db.transaksi.clear();
      await db.pengajuan.clear();
      localStorage.removeItem('koperasi_transaksi');
      localStorage.removeItem('koperasi_pengajuan');
      result.details.transactionsReset = 1;
    }
    
    // 2. Reset Anggota (IndexedDB + LocalStorage)
    if (options.resetAnggota) {
      await db.anggota.clear();
      localStorage.removeItem('koperasi_anggota');
      localStorage.removeItem('koperasi_unit_kerja');
      result.details.anggotaReset = 1;
    }
    
    // 3. Reset Keuangan (LocalStorage Patterns)
    if (options.resetKeuangan) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('koperasi_pemasukan_pengeluaran') || key.includes('koperasi_kategori_transaksi')) {
          localStorage.removeItem(key);
        }
      });
      result.details.keuanganReset = 1;
    }
    
    // 4. Reset Akuntansi (IndexedDB + LocalStorage)
    if (options.resetAkuntansi) {
      await db.jurnal.clear();
      await db.coa.clear();
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.includes('koperasi_jurnal') || key.includes('koperasi_chart_of_accounts') || key.includes('koperasi_buku_besar')) {
          localStorage.removeItem(key);
        }
      });
      result.details.akuntansiReset = 1;
    }
    
    // 5. Reset POS (LocalStorage)
    if (options.resetPOS) {
      const posPatterns = ['koperasi_produk', 'koperasi_penjualan', 'koperasi_pembelian', 'koperasi_pemasok'];
      Object.keys(localStorage).forEach(key => {
        if (posPatterns.some(p => key.includes(p))) localStorage.removeItem(key);
      });
      result.details.posReset = 1;
    }
    
    // 6. Reset Pengaturan (LocalStorage)
    if (options.resetPengaturan) {
      localStorage.removeItem('koperasi_pengaturan');
    }
    
    // 7. Reset Audit (LocalStorage)
    if (options.resetAudit) {
      localStorage.removeItem('koperasi_audit_trail');
    }
    
    // 8. Global Clear if requested
    if (options.resetCache) {
      await db.delete(); // Delete entire IndexedDB
      clearLocalStorage();
      result.details.otherDataReset = 1;
    }
    
    result.success = true;
    result.message = "Reset data berhasil diselesaikan untuk kategori yang dipilih.";
    return result;
    
  } catch (error) {
    console.error('❌ Reset error:', error);
    result.success = false;
    result.message = `Gagal melakukan reset: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return result;
  }
}

export const quickResetPresets = {
  async resetFinancialData() {
    return performBulkReset({
      resetTransactions: true,
      resetKeuangan: true,
      resetAkuntansi: true
    });
  },
  
  async resetAllDataKeepSettings() {
    return performBulkReset({
      resetTransactions: true,
      resetAnggota: true,
      resetKeuangan: true,
      resetPOS: true,
      resetAkuntansi: true,
      resetAudit: true
    });
  },
  
  async factoryReset() {
    return performBulkReset({
      resetTransactions: true,
      resetAnggota: true,
      resetKeuangan: true,
      resetPOS: true,
      resetAkuntansi: true,
      resetPengaturan: true,
      resetAudit: true,
      resetCache: true
    });
  }
};

export function estimateResetImpact(options: BulkResetOptions): { [key: string]: number } {
  const impact: { [key: string]: number } = {};
  if (options.resetTransactions) impact.Transactions = 1;
  if (options.resetAnggota) impact.Anggota = 1;
  if (options.resetKeuangan) impact.Keuangan = 1;
  if (options.resetAkuntansi) impact.Akuntansi = 1;
  return impact;
}
