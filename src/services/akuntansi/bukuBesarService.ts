
import { BukuBesar, BukuBesarDetail, ChartOfAccount } from "@/types/akuntansi";
import { getAllJurnalEntries } from "./jurnalService";
import { getAllChartOfAccounts } from "./coaService";

/**
 * Get Buku Besar by account ID with proper balance calculation
 */
export function getBukuBesarByAccount(coaId: string, periode: string): BukuBesar | null {
  const accounts = getAllChartOfAccounts();
  const account = accounts.find(acc => acc.id === coaId);
  
  if (!account) {
    return null;
  }
  
  // Get all posted journals within the period
  const [year, month] = periode.split('-');
  const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
  const endDate = new Date(parseInt(year), parseInt(month), 0);
  
  const journals = getAllJurnalEntries()
    .filter(journal => {
      const journalDate = new Date(journal.tanggal);
      return journal.status === 'POSTED' && 
             journalDate >= startDate && 
             journalDate <= endDate;
    })
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());
  
  console.log(`📊 Processing ${journals.length} posted journals for account ${account.nama} in period ${periode}`);
  
  const transaksi: BukuBesarDetail[] = [];
  let saldo = 0;
  
  journals.forEach(journal => {
    const detail = journal.details.find(d => d.coaId === coaId);
    if (detail) {
      const debit = detail.debit || 0;
      const kredit = detail.kredit || 0;
      
      // Calculate running balance based on account normal balance
      if (account.saldoNormal === 'DEBIT') {
        saldo += debit - kredit;
      } else {
        saldo += kredit - debit;
      }
      
      transaksi.push({
        tanggal: journal.tanggal,
        nomorJurnal: journal.nomorJurnal,
        keterangan: detail.keterangan || journal.deskripsi,
        debit,
        kredit,
        saldo: Math.abs(saldo) // Always show positive balance
      });
    }
  });
  
  const totalDebit = transaksi.reduce((sum, t) => sum + t.debit, 0);
  const totalKredit = transaksi.reduce((sum, t) => sum + t.kredit, 0);
  
  console.log(`📈 Account ${account.nama}: ${transaksi.length} transactions, Total Debit: ${totalDebit}, Total Credit: ${totalKredit}`);
  
  return {
    coaId,
    coa: account,
    periode,
    saldoAwal: 0, // Could be enhanced to get from previous period
    totalDebit,
    totalKredit,
    saldoAkhir: Math.abs(saldo),
    transaksi
  };
}

/**
 * Get all Buku Besar entries for a period grouped by account type
 */
export function getAllBukuBesar(periode: string): BukuBesar[] {
  const accounts = getAllChartOfAccounts().filter(acc => acc.isActive);
  const bukuBesarEntries: BukuBesar[] = [];
  
  accounts.forEach(account => {
    const bukuBesar = getBukuBesarByAccount(account.id, periode);
    if (bukuBesar && bukuBesar.transaksi.length > 0) {
      bukuBesarEntries.push(bukuBesar);
    }
  });
  
  // Sort by account type and code
  return bukuBesarEntries.sort((a, b) => {
    if (a.coa.jenis !== b.coa.jenis) {
      const typeOrder = ['ASET', 'KEWAJIBAN', 'MODAL', 'PENDAPATAN', 'BEBAN'];
      return typeOrder.indexOf(a.coa.jenis) - typeOrder.indexOf(b.coa.jenis);
    }
    return a.coa.kode.localeCompare(b.coa.kode);
  });
}

/**
 * Get Buku Besar by account type
 */
export function getBukuBesarByAccountType(jenis: ChartOfAccount['jenis'], periode: string): BukuBesar[] {
  const accounts = getAllChartOfAccounts().filter(acc => acc.jenis === jenis && acc.isActive);
  const bukuBesarEntries: BukuBesar[] = [];
  
  accounts.forEach(account => {
    const bukuBesar = getBukuBesarByAccount(account.id, periode);
    if (bukuBesar && bukuBesar.transaksi.length > 0) {
      bukuBesarEntries.push(bukuBesar);
    }
  });
  
  return bukuBesarEntries.sort((a, b) => a.coa.kode.localeCompare(b.coa.kode));
}

/**
 * Generate summary by account type for reports
 */
export function getBukuBesarSummaryByType(periode: string): { [key: string]: { totalDebit: number; totalKredit: number; saldoAkhir: number } } {
  const allBukuBesar = getAllBukuBesar(periode);
  const summary: { [key: string]: { totalDebit: number; totalKredit: number; saldoAkhir: number } } = {};
  
  ['ASET', 'KEWAJIBAN', 'MODAL', 'PENDAPATAN', 'BEBAN'].forEach(jenis => {
    const entries = allBukuBesar.filter(entry => entry.coa.jenis === jenis);
    summary[jenis] = {
      totalDebit: entries.reduce((sum, entry) => sum + entry.totalDebit, 0),
      totalKredit: entries.reduce((sum, entry) => sum + entry.totalKredit, 0),
      saldoAkhir: entries.reduce((sum, entry) => sum + entry.saldoAkhir, 0)
    };
  });
  
  return summary;
}

// Keep existing functions for backward compatibility
export function generateBukuBesar(coaId: string, periode: string): BukuBesar | null {
  return getBukuBesarByAccount(coaId, periode);
}

export function getBukuBesarByPeriode(periode: string): BukuBesar[] {
  return getAllBukuBesar(periode);
}
