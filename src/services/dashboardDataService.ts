import { db } from "@/db/db";
import { getAllTransaksi } from "./transaksi/transaksiCore";
import { getAnggotaList } from "./anggotaService";

// Constant Category IDs mapped for reliable aggregate
export const CAT_IDS = {
  SIMPANAN_POKOK: "018e6a12-8c1d-7a01-8000-000000000501",
  SIMPANAN_WAJIB: "018e6a12-8c1d-7a01-8000-000000000502",
  SIMPANAN_SUKARELA: "018e6a12-8c1d-7a01-8000-000000000503",
  PINJAMAN_REGULER: "018e6a12-8c1d-7a01-8000-000000000601",
};

/**
 * Get Composition of Savings (Pie Chart)
 */
export async function getSavingsComposition() {
  const transactions = await getAllTransaksi();
  const successfulSavings = transactions.filter(t => t.jenis === "Simpan" && t.status === "Sukses");

  const pokok = successfulSavings
    .filter(t => t.kategori === CAT_IDS.SIMPANAN_POKOK || t.kategori === "Simpanan Pokok")
    .reduce((sum, t) => sum + (t.jumlah || 0), 0);

  const wajib = successfulSavings
    .filter(t => t.kategori === CAT_IDS.SIMPANAN_WAJIB || t.kategori === "Simpanan Wajib")
    .reduce((sum, t) => sum + (t.jumlah || 0), 0);

  const sukarela = successfulSavings
    .filter(t => t.kategori === CAT_IDS.SIMPANAN_SUKARELA || t.kategori === "Simpanan Sukarela" || t.kategori === "Simpanan Khusus")
    .reduce((sum, t) => sum + (t.jumlah || 0), 0);

  const total = pokok + wajib + sukarela;
  
  if (total === 0) return [];

  return [
    { name: 'Simpanan Pokok', value: Math.round((pokok / total) * 100), amount: pokok },
    { name: 'Simpanan Wajib', value: Math.round((wajib / total) * 100), amount: wajib },
    { name: 'Simpanan Sukarela', value: Math.round((sukarela / total) * 100), amount: sukarela }
  ];
}

/**
 * Get Loan Growth Data (Bar Chart)
 * Groups by the last 6 months
 */
export async function getLoanGrowthData() {
  const transactions = await getAllTransaksi();
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
  
  const last6Months = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last6Months.push({
      month: months[d.getMonth()],
      fullMonth: d.getMonth() + 1,
      year: d.getFullYear(),
      pinjaman: 0,
      lunas: 0
    });
  }

  transactions.forEach(t => {
    if (!t.tanggal) return;
    const tDate = new Date(t.tanggal);
    const mMatch = last6Months.find(m => m.fullMonth === (tDate.getMonth() + 1) && m.year === tDate.getFullYear());
    
    if (mMatch) {
      if (t.jenis === "Pinjam" && t.status === "Sukses") {
        mMatch.pinjaman += (t.jumlah || 0);
      } else if (t.jenis === "Angsuran" && t.status === "Sukses") {
        // Here we track "Principal repayment" as "Lunas contribution"
        mMatch.lunas += (t.nominalPokok || 0);
      }
    }
  });

  return last6Months;
}

/**
 * Get Monthly Piutang Analysis (Stacked Bar)
 * Showing aging or just total outstanding categories
 */
export async function getPiutangAnalysis() {
  const transactions = await getAllTransaksi();
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"]; // Simplified last 6 labels
  
  // Real logic: Calculate outstanding for each of the last 6 months
  // For demo/simplicity, we calculate currently active vs categories
  const analysis = [
    { month: 'Jan', lancar: 0, kurangLancar: 0, macet: 0 },
    { month: 'Feb', lancar: 0, kurangLancar: 0, macet: 0 },
    { month: 'Mar', lancar: 0, kurangLancar: 0, macet: 0 },
    { month: 'Apr', lancar: 0, kurangLancar: 0, macet: 0 },
    { month: 'Mei', lancar: 0, kurangLancar: 0, macet: 0 },
    { month: 'Jun', lancar: 0, kurangLancar: 0, macet: 0 }
  ];

  const pinjamanTransactions = transactions.filter(t => t.jenis === "Pinjam" && t.status === "Sukses");
  const angsuranTransactions = transactions.filter(t => t.jenis === "Angsuran" && t.status === "Sukses");

  // Approximate for dashboard: Distribute current outstanding across current month
  let totalOutstanding = 0;
  pinjamanTransactions.forEach(p => totalOutstanding += (p.nominalPokok || p.jumlah || 0));
  angsuranTransactions.forEach(a => totalOutstanding -= (a.nominalPokok || 0));

  if (totalOutstanding > 0) {
    analysis[5].lancar = totalOutstanding * 0.8;
    analysis[5].kurangLancar = totalOutstanding * 0.15;
    analysis[5].macet = totalOutstanding * 0.05;
  }

  return analysis;
}

/**
 * Get Savings vs Loans Comparison (Area Chart)
 */
export async function getSavingsVsLoansData() {
  const loans = await getLoanGrowthData();
  const transactions = await getAllTransaksi();
  
  const now = new Date();
  const result = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthIndex = d.getMonth() + 1;
    const year = d.getFullYear();

    const monthSimpanan = transactions
      .filter(t => t.jenis === "Simpan" && t.status === "Sukses")
      .filter(t => {
        const tDate = new Date(t.tanggal);
        return (tDate.getMonth() + 1) === monthIndex && tDate.getFullYear() === year;
      })
      .reduce((sum, t) => sum + (t.jumlah || 0), 0);
    
    const monthPinjaman = transactions
      .filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
      .filter(t => {
        const tDate = new Date(t.tanggal);
        return (tDate.getMonth() + 1) === monthIndex && tDate.getFullYear() === year;
      })
      .reduce((sum, t) => sum + (t.jumlah || 0), 0);

    result.push({
      month: loans[5-i].month,
      simpanan: monthSimpanan,
      pinjaman: monthPinjaman
    });
  }

  return result;
}

/**
 * Get Member Distribution (Donut Chart)
 */
export async function getMemberDistribution() {
  const anggota = await getAnggotaList();
  
  const distribution: Record<string, number> = {};
  anggota.forEach(a => {
    const unit = a.unitKerja || "Lainnya";
    distribution[unit] = (distribution[unit] || 0) + 1;
  });

  return Object.entries(distribution)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5); // top 5 units
}

/**
 * Get Performance Metrics (Radar Chart)
 */
export async function getKoperasiPerformance() {
  const transactions = await getAllTransaksi();
  const members = await getAnggotaList();

  // Metrics (0-100 scale)
  let liquidity = 75; // Base
  let solvability = 80;
  let memberGrowth = Math.min(100, (members.length / 50) * 100);
  let revenueRoi = 60;
  let serviceSpeed = 90;

  // Simple math derived from transactions
  const totalSavings = transactions.filter(t => t.jenis === "Simpan").reduce((s, t) => s + (t.jumlah || 0), 0);
  const totalLoans = transactions.filter(t => t.jenis === "Pinjam").reduce((s, t) => s + (t.jumlah || 0), 0);
  
  if (totalSavings > 0) {
    liquidity = Math.min(100, Math.max(20, (totalSavings / (totalLoans || 1)) * 50));
  }

  return [
    { subject: 'Likuiditas', A: liquidity, fullMark: 100 },
    { subject: 'Solvabilitas', A: solvability, fullMark: 100 },
    { subject: 'Pertumbuhan', A: memberGrowth, fullMark: 100 },
    { subject: 'ROI Pendapatan', A: revenueRoi, fullMark: 100 },
    { subject: 'Kecepatan Layanan', A: serviceSpeed, fullMark: 100 },
  ];
}
