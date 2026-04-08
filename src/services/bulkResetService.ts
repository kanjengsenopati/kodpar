import { getFromLocalStorage, saveToLocalStorage, clearLocalStorage } from "@/utils/localStorage";
import { resetAllMonetaryValues } from "./resetDataService";
import { completeReset } from "./backupResetService";

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
 * Get all localStorage keys that belong to the cooperative system
 */
export function getKoperasiKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('koperasi_')) {
      keys.push(key);
    }
  }
  return keys;
}

/**
 * Get storage usage statistics
 */
export function getStorageStats(): { [key: string]: number } {
  const stats: { [key: string]: number } = {};
  const keys = getKoperasiKeys();
  
  keys.forEach(key => {
    const data = localStorage.getItem(key);
    if (data) {
      stats[key] = new Blob([data]).size; // Size in bytes
    }
  });
  
  return stats;
}

/**
 * Reset specific data categories
 */
export function resetDataCategory(category: 'transaksi' | 'anggota' | 'keuangan' | 'pos' | 'akuntansi' | 'pengaturan' | 'audit'): number {
  const keys = getKoperasiKeys();
  let resetCount = 0;
  
  const categoryPatterns = {
    transaksi: ['koperasi_transaksi', 'koperasi_pengajuan', 'koperasi_jenis'],
    anggota: ['koperasi_anggota'],
    keuangan: ['koperasi_pemasukan_pengeluaran', 'koperasi_kategori_transaksi'],
    pos: ['koperasi_produk', 'koperasi_penjualan', 'koperasi_pembelian', 'koperasi_pemasok'],
    akuntansi: ['koperasi_jurnal', 'koperasi_chart_of_accounts', 'koperasi_buku_besar'],
    pengaturan: ['koperasi_pengaturan'],
    audit: ['koperasi_audit_trail']
  };
  
  const patterns = categoryPatterns[category] || [];
  
  keys.forEach(key => {
    const shouldReset = patterns.some(pattern => key.includes(pattern));
    if (shouldReset) {
      localStorage.removeItem(key);
      resetCount++;
    }
  });
  
  console.log(`Reset ${resetCount} items for category: ${category}`);
  return resetCount;
}

/**
 * Perform bulk reset with selective options
 */
export async function performBulkReset(options: BulkResetOptions): Promise<BulkResetResult> {
  console.log('🔄 Starting bulk reset operation with options:', options);
  
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
    // Reset transactions and related data
    if (options.resetTransactions) {
      const transactionResult = resetAllMonetaryValues();
      result.details.transactionsReset = transactionResult.totalAffected;
      console.log(`✅ Reset ${result.details.transactionsReset} transaction records`);
    }
    
    // Reset anggota data
    if (options.resetAnggota) {
      result.details.anggotaReset = resetDataCategory('anggota');
    }
    
    // Reset keuangan data
    if (options.resetKeuangan) {
      result.details.keuanganReset = resetDataCategory('keuangan');
    }
    
    // Reset POS data
    if (options.resetPOS) {
      result.details.posReset = resetDataCategory('pos');
    }
    
    // Reset akuntansi data
    if (options.resetAkuntansi) {
      result.details.akuntansiReset = resetDataCategory('akuntansi');
    }
    
    // Reset pengaturan
    if (options.resetPengaturan) {
      resetDataCategory('pengaturan');
    }
    
    // Reset audit trail
    if (options.resetAudit) {
      resetDataCategory('audit');
    }
    
    // Clear cache and cookies if requested
    if (options.resetCache) {
      await completeReset();
      result.details.otherDataReset = 1;
    }
    
    const totalReset = Object.values(result.details).reduce((sum, count) => sum + count, 0);
    
    result.success = true;
    result.message = `Bulk reset completed successfully. Total items reset: ${totalReset}`;
    
    console.log('✅ Bulk reset operation completed:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Error during bulk reset:', error);
    result.success = false;
    result.message = `Bulk reset failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
    return result;
  }
}

/**
 * Quick reset functions for common scenarios
 */
export const quickResetPresets = {
  // Reset only financial data (transactions, accounting)
  async resetFinancialData(): Promise<BulkResetResult> {
    return performBulkReset({
      resetTransactions: true,
      resetKeuangan: true,
      resetAkuntansi: true
    });
  },
  
  // Reset all data but keep settings
  async resetAllDataKeepSettings(): Promise<BulkResetResult> {
    return performBulkReset({
      resetTransactions: true,
      resetAnggota: true,
      resetKeuangan: true,
      resetPOS: true,
      resetAkuntansi: true,
      resetAudit: true
    });
  },
  
  // Complete factory reset
  async factoryReset(): Promise<BulkResetResult> {
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

/**
 * Estimate reset impact before executing
 */
export function estimateResetImpact(options: BulkResetOptions): { [key: string]: number } {
  const impact: { [key: string]: number } = {};
  const keys = getKoperasiKeys();
  
  if (options.resetTransactions) {
    const transaksiCount = getFromLocalStorage('koperasi_transaksi', []).length;
    const pengajuanCount = getFromLocalStorage('koperasi_pengajuan', []).length;
    impact.transactions = transaksiCount + pengajuanCount;
  }
  
  if (options.resetAnggota) {
    impact.anggota = getFromLocalStorage('koperasi_anggota', []).length;
  }
  
  if (options.resetKeuangan) {
    impact.keuangan = getFromLocalStorage('koperasi_pemasukan_pengeluaran', []).length;
  }
  
  if (options.resetPOS) {
    const produkCount = getFromLocalStorage('koperasi_produk', []).length;
    const penjualanCount = getFromLocalStorage('koperasi_penjualan', []).length;
    impact.pos = produkCount + penjualanCount;
  }
  
  if (options.resetAkuntansi) {
    impact.akuntansi = keys.filter(key => key.includes('jurnal') || key.includes('chart_of_accounts')).length;
  }
  
  return impact;
}
