
import { getAllJurnalEntries } from "./jurnalService";
import { getAllChartOfAccounts, getCoaIdByCode } from "./coaService";
import { JurnalEntry, ChartOfAccount } from "@/types/akuntansi";

export interface SAKEPFinancialPosition {
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

export interface SAKEPComprehensiveIncome {
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
 * Generate SAK EP compliant Statement of Financial Position (Laporan Posisi Keuangan)
 */
export function generateSAKEPFinancialPosition(periode: string): SAKEPFinancialPosition {
  const journals = getAllJurnalEntries();
  const accounts = getAllChartOfAccounts();
  
  // Calculate account balances
  const balances = calculateAccountBalances(journals, accounts, periode);
  
  // Dynamic ID resolution for SAK EP standards
  const coaIds = {
    kas: getCoaIdByCode("1000"),
    piutang: getCoaIdByCode("1100"),
    sukarela: getCoaIdByCode("2100"),
    pokok: getCoaIdByCode("3100"),
    wajib: getCoaIdByCode("3200"),
    cadangan: getCoaIdByCode("3300"),
    shu: getCoaIdByCode("cadangan-shu") // Adjust if needed
  };

  const report: SAKEPFinancialPosition = {
    periode,
    aset: {
      asetLancar: {
        kas: balances[coaIds.kas] || 0,
        bank: 0, // Bank coa ID needed if separate
        piutangAnggota: balances[coaIds.piutang] || 0,
        totalAsetLancar: 0
      },
      totalAset: 0
    },
    kewajibanDanEkuitas: {
      kewajibanJangkaPendek: {
        utangSimpananSukarela: Math.abs(balances[coaIds.sukarela] || 0),
        totalKewajiban: 0
      },
      ekuitas: {
        simpananPokok: Math.abs(balances[coaIds.pokok] || 0),
        simpananWajib: Math.abs(balances[coaIds.wajib] || 0),
        cadanganUmum: Math.abs(balances[coaIds.cadangan] || 0),
        shuBelumDibagi: Math.abs(balances[coaIds.shu] || 0),
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
 * Generate SAK EP compliant Statement of Comprehensive Income (Laporan Penghasilan Komprehensif)
 */
export function generateSAKEPComprehensiveIncome(periode: string): SAKEPComprehensiveIncome {
  const journals = getAllJurnalEntries();
  const accounts = getAllChartOfAccounts();
  
  // Filter journals for the period
  const periodJournals = journals.filter(j => {
    const journalMonth = j.tanggal.substring(0, 7); // YYYY-MM
    return journalMonth === periode;
  });
  
  const balances = calculateAccountBalances(periodJournals, accounts, periode);
  
  const coaIds = {
    jasa: getCoaIdByCode("4000"),
    bebanOps: getCoaIdByCode("5000"),
    bebanAdmin: getCoaIdByCode("5100")
  };

  const report: SAKEPComprehensiveIncome = {
    periode,
    pendapatan: {
      pendapatanJasaPinjaman: Math.abs(balances[coaIds.jasa] || 0),
      pendapatanLain: 0,
      totalPendapatan: 0
    },
    beban: {
      bebanOperasional: balances[coaIds.bebanOps] || 0,
      bebanAdministrasi: balances[coaIds.bebanAdmin] || 0,
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
 * Generate comprehensive SAK EP compliance report
 */
export function generateSAKEPComplianceReport(periode: string) {
  const financialPosition = generateSAKEPFinancialPosition(periode);
  const comprehensiveIncome = generateSAKEPComprehensiveIncome(periode);
  
  return {
    periode,
    financialPosition,
    comprehensiveIncome,
    complianceNotes: [
      "Laporan disusun berdasarkan SAK EP (Entitas Privat) untuk koperasi",
      "Simpanan Pokok dan Wajib dicatat sebagai ekuitas anggota",
      "Simpanan Sukarela dicatat sebagai kewajiban jangka pendek",
      "Pendapatan jasa pinjaman diakui secara kas basis",
      "SHU (Sisa Hasil Usaha) belum dibagi menunggu keputusan RAT"
    ],
    disclaimer: "Laporan ini disusun sesuai dengan Standar Akuntansi Keuangan Entitas Privat (SAK EP) yang berlaku sebagai pengganti SAK ETAP untuk koperasi di Indonesia."
  };
}

