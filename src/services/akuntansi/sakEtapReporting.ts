
import { getAllJurnalEntries } from "./jurnalService";
import { getAllChartOfAccounts } from "./coaService";
import { JurnalEntry, ChartOfAccount } from "@/types/akuntansi";

export interface SAKETAPBalanceSheet {
  periode: string;
  aset: {
    asetLancar: {
      kas: number;
      bank: number;
      piutangAnggota: number;
      totalAsetLancar: number;
    };
    totalAset: number;
  };
  kewajibanDanEkuitas: {
    kewajibanJangkaPendek: {
      utangSimpananSukarela: number;
      totalKewajiban: number;
    };
    ekuitas: {
      simpananPokok: number;
      simpananWajib: number;
      cadanganUmum: number;
      shuBelumDibagi: number;
      totalEkuitas: number;
    };
    totalKewajibanDanEkuitas: number;
  };
}

export interface SAKETAPIncomeStatement {
  periode: string;
  pendapatan: {
    pendapatanJasaPinjaman: number;
    pendapatanLain: number;
    totalPendapatan: number;
  };
  beban: {
    bebanOperasional: number;
    bebanAdministrasi: number;
    totalBeban: number;
  };
  shuSebelumPajak: number;
  shuBersih: number;
}

/**
 * Generate SAK ETAP compliant Balance Sheet (Neraca)
 */
export function generateSAKETAPBalanceSheet(periode: string): SAKETAPBalanceSheet {
  const journals = getAllJurnalEntries();
  const accounts = getAllChartOfAccounts();
  
  // Calculate account balances
  const balances = calculateAccountBalances(journals, accounts, periode);
  
  const report: SAKETAPBalanceSheet = {
    periode,
    aset: {
      asetLancar: {
        kas: balances["2"] || 0, // Kas
        bank: balances["3"] || 0, // Bank
        piutangAnggota: balances["4"] || 0, // Piutang Anggota
        totalAsetLancar: 0
      },
      totalAset: 0
    },
    kewajibanDanEkuitas: {
      kewajibanJangkaPendek: {
        utangSimpananSukarela: Math.abs(balances["6"] || 0), // Utang Simpanan Sukarela
        totalKewajiban: 0
      },
      ekuitas: {
        simpananPokok: Math.abs(balances["8"] || 0), // Simpanan Pokok
        simpananWajib: Math.abs(balances["9"] || 0), // Simpanan Wajib
        cadanganUmum: Math.abs(balances["10"] || 0), // Cadangan Umum
        shuBelumDibagi: Math.abs(balances["11"] || 0), // SHU Belum Dibagi
        totalEkuitas: 0
      },
      totalKewajibanDanEkuitas: 0
    }
  };
  
  // Calculate totals
  report.aset.asetLancar.totalAsetLancar = 
    report.aset.asetLancar.kas + 
    report.aset.asetLancar.bank + 
    report.aset.asetLancar.piutangAnggota;
  
  report.aset.totalAset = report.aset.asetLancar.totalAsetLancar;
  
  report.kewajibanDanEkuitas.kewajibanJangkaPendek.totalKewajiban = 
    report.kewajibanDanEkuitas.kewajibanJangkaPendek.utangSimpananSukarela;
  
  report.kewajibanDanEkuitas.ekuitas.totalEkuitas = 
    report.kewajibanDanEkuitas.ekuitas.simpananPokok +
    report.kewajibanDanEkuitas.ekuitas.simpananWajib +
    report.kewajibanDanEkuitas.ekuitas.cadanganUmum +
    report.kewajibanDanEkuitas.ekuitas.shuBelumDibagi;
  
  report.kewajibanDanEkuitas.totalKewajibanDanEkuitas = 
    report.kewajibanDanEkuitas.kewajibanJangkaPendek.totalKewajiban +
    report.kewajibanDanEkuitas.ekuitas.totalEkuitas;
  
  return report;
}

/**
 * Generate SAK ETAP compliant Income Statement (Laporan Laba Rugi)
 */
export function generateSAKETAPIncomeStatement(periode: string): SAKETAPIncomeStatement {
  const journals = getAllJurnalEntries();
  const accounts = getAllChartOfAccounts();
  
  // Filter journals for the period
  const periodJournals = journals.filter(j => {
    const journalMonth = j.tanggal.substring(0, 7); // YYYY-MM
    return journalMonth === periode;
  });
  
  const balances = calculateAccountBalances(periodJournals, accounts, periode);
  
  const report: SAKETAPIncomeStatement = {
    periode,
    pendapatan: {
      pendapatanJasaPinjaman: Math.abs(balances["13"] || 0), // Pendapatan Jasa Pinjaman
      pendapatanLain: 0,
      totalPendapatan: 0
    },
    beban: {
      bebanOperasional: balances["15"] || 0, // Beban Operasional
      bebanAdministrasi: 0,
      totalBeban: 0
    },
    shuSebelumPajak: 0,
    shuBersih: 0
  };
  
  // Calculate totals
  report.pendapatan.totalPendapatan = 
    report.pendapatan.pendapatanJasaPinjaman + 
    report.pendapatan.pendapatanLain;
  
  report.beban.totalBeban = 
    report.beban.bebanOperasional + 
    report.beban.bebanAdministrasi;
  
  report.shuSebelumPajak = report.pendapatan.totalPendapatan - report.beban.totalBeban;
  report.shuBersih = report.shuSebelumPajak; // Assuming no tax for cooperatives
  
  return report;
}

/**
 * Calculate account balances from journal entries
 */
function calculateAccountBalances(
  journals: JurnalEntry[], 
  accounts: ChartOfAccount[], 
  periode: string
): Record<string, number> {
  const balances: Record<string, number> = {};
  
  journals.forEach(journal => {
    if (journal.status !== 'POSTED') return;
    
    journal.details.forEach(detail => {
      const account = accounts.find(acc => acc.id === detail.coaId);
      if (!account) return;
      
      if (!balances[detail.coaId]) {
        balances[detail.coaId] = 0;
      }
      
      // Apply normal balance rules
      if (account.saldoNormal === 'DEBIT') {
        balances[detail.coaId] += detail.debit - detail.kredit;
      } else {
        balances[detail.coaId] += detail.kredit - detail.debit;
      }
    });
  });
  
  return balances;
}

/**
 * Generate comprehensive SAK ETAP compliance report
 */
export function generateSAKETAPComplianceReport(periode: string) {
  const balanceSheet = generateSAKETAPBalanceSheet(periode);
  const incomeStatement = generateSAKETAPIncomeStatement(periode);
  
  return {
    periode,
    balanceSheet,
    incomeStatement,
    complianceNotes: [
      "Laporan disusun berdasarkan SAK ETAP untuk koperasi",
      "Simpanan Pokok dan Wajib dicatat sebagai ekuitas anggota",
      "Simpanan Sukarela dicatat sebagai kewajiban jangka pendek",
      "Pendapatan jasa pinjaman diakui secara kas basis",
      "SHU belum dibagi menunggu keputusan RAT"
    ],
    disclaimer: "Laporan ini disusun sesuai dengan Standar Akuntansi Keuangan Entitas Tanpa Akuntabilitas Publik (SAK ETAP) yang berlaku untuk koperasi di Indonesia."
  };
}
