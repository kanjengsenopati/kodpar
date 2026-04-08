
import { Transaksi } from "@/types";
import { getAllTransaksi } from "@/services/transaksiService";
import { getPengaturan } from "@/services/pengaturanService";

export interface LoanDetails {
  id: string;
  anggotaId: string;
  kategori: string;
  jumlahPinjaman: number;
  tenor: number;
  sukuBunga: number;
  angsuranPerBulan: number;
  totalPengembalian: number;
  sisaPinjaman: number;
  totalDibayar: number;
  tanggalPinjam: string;
  status: "Aktif" | "Lunas";
  jatuhTempo: string;
}

export interface InstallmentDetails {
  angsuranKe: number;
  jatuhTempo: string;
  jumlah: number;
  status: "belum-bayar" | "lunas" | "terlambat";
  tanggalBayar?: string;
  petugas?: string;
  nominalPokok?: number;
  nominalJasa?: number;
}

/**
 * Extract loan information from keterangan with standardized parsing
 */
export function extractLoanDetailsFromKeterangan(keterangan: string): {
  tenor: number;
  sukuBunga: number;
  angsuranPerBulan: number;
  totalPengembalian: number;
} {
  // Default values
  let tenor = 12;
  let sukuBunga = 1.5;
  let angsuranPerBulan = 0;
  let totalPengembalian = 0;

  if (!keterangan) return { tenor, sukuBunga, angsuranPerBulan, totalPengembalian };

  // Extract tenor
  const tenorMatch = keterangan.match(/(?:Jumlah Tenor|Tenor):\s*(\d+)\s*bulan/i);
  if (tenorMatch) {
    tenor = parseInt(tenorMatch[1]);
  }

  // Extract suku bunga
  const bungaMatch = keterangan.match(/(?:Rate\s*)?Suku Bunga:\s*([\d.]+)%/i);
  if (bungaMatch) {
    sukuBunga = parseFloat(bungaMatch[1]);
  }

  // Extract angsuran per bulan
  const angsuranMatch = keterangan.match(/Angsuran per Bulan:\s*Rp\s*([\d,.]+)/i);
  if (angsuranMatch) {
    angsuranPerBulan = parseInt(angsuranMatch[1].replace(/[,.]/g, ''));
  }

  // Extract total pengembalian
  const totalMatch = keterangan.match(/Total Pengembalian:\s*Rp\s*([\d,.]+)/i);
  if (totalMatch) {
    totalPengembalian = parseInt(totalMatch[1].replace(/[,.]/g, ''));
  }

  return { tenor, sukuBunga, angsuranPerBulan, totalPengembalian };
}

/**
 * Get comprehensive loan details for a specific loan
 */
export function getLoanDetails(loanId: string): LoanDetails | null {
  const allTransaksi = getAllTransaksi();
  const loan = allTransaksi.find(t => t.id === loanId && t.jenis === "Pinjam");
  
  if (!loan) return null;

  // Extract loan details from keterangan
  const loanInfo = extractLoanDetailsFromKeterangan(loan.keterangan || "");

  // Calculate payments made
  const payments = allTransaksi.filter(
    t => t.jenis === "Angsuran" && 
        t.status === "Sukses" && 
        t.anggotaId === loan.anggotaId &&
        t.keterangan?.includes(loanId)
  );

  const totalDibayar = payments.reduce((sum, payment) => sum + payment.jumlah, 0);
  const sisaPinjaman = Math.max(0, loan.jumlah - totalDibayar);

  // Calculate due date
  const loanDate = new Date(loan.tanggal);
  const dueDate = new Date(loanDate);
  dueDate.setMonth(dueDate.getMonth() + loanInfo.tenor);

  return {
    id: loan.id,
    anggotaId: loan.anggotaId,
    kategori: loan.kategori || "Pinjaman Reguler",
    jumlahPinjaman: loan.jumlah,
    tenor: loanInfo.tenor,
    sukuBunga: loanInfo.sukuBunga,
    angsuranPerBulan: loanInfo.angsuranPerBulan,
    totalPengembalian: loanInfo.totalPengembalian,
    sisaPinjaman,
    totalDibayar,
    tanggalPinjam: loan.tanggal,
    status: sisaPinjaman > 0 ? "Aktif" : "Lunas",
    jatuhTempo: dueDate.toISOString()
  };
}

/**
 * Get all loans for a member
 */
export function getMemberLoans(anggotaId: string): LoanDetails[] {
  const allTransaksi = getAllTransaksi();
  const loans = allTransaksi.filter(
    t => t.jenis === "Pinjam" && t.anggotaId === anggotaId && t.status === "Sukses"
  );

  return loans.map(loan => getLoanDetails(loan.id)).filter(Boolean) as LoanDetails[];
}

/**
 * Generate installment schedule for a loan
 */
export function generateInstallmentSchedule(loanId: string): InstallmentDetails[] {
  const loanDetails = getLoanDetails(loanId);
  if (!loanDetails) return [];

  const allTransaksi = getAllTransaksi();
  const payments = allTransaksi.filter(
    t => t.jenis === "Angsuran" && 
        t.status === "Sukses" && 
        t.anggotaId === loanDetails.anggotaId &&
        t.keterangan?.includes(loanId)
  );

  const schedule: InstallmentDetails[] = [];
  const startDate = new Date(loanDetails.tanggalPinjam);

  for (let i = 1; i <= loanDetails.tenor; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    // Find payment for this installment
    const payment = payments.find(p => {
      const paymentDate = new Date(p.tanggal);
      const dueDateEnd = new Date(dueDate);
      dueDateEnd.setDate(dueDateEnd.getDate() + 30); // 30 days grace period
      return paymentDate <= dueDateEnd;
    });

    const currentDate = new Date();
    let status: "belum-bayar" | "lunas" | "terlambat" = "belum-bayar";
    
    if (payment) {
      status = "lunas";
    } else if (currentDate > dueDate) {
      status = "terlambat";
    }

    schedule.push({
      angsuranKe: i,
      jatuhTempo: dueDate.toISOString().split('T')[0],
      jumlah: loanDetails.angsuranPerBulan,
      status,
      tanggalBayar: payment?.tanggal,
      petugas: payment ? "System" : undefined,
      nominalPokok: payment ? Math.floor(loanDetails.angsuranPerBulan * 0.8) : undefined,
      nominalJasa: payment ? Math.floor(loanDetails.angsuranPerBulan * 0.2) : undefined
    });
  }

  return schedule;
}

/**
 * Calculate total remaining loans for a member
 */
export function calculateMemberTotalPinjaman(anggotaId: string): number {
  const loans = getMemberLoans(anggotaId);
  return loans.reduce((total, loan) => total + loan.sisaPinjaman, 0);
}

/**
 * Calculate total payments made by a member
 */
export function calculateMemberTotalAngsuran(anggotaId: string): number {
  const allTransaksi = getAllTransaksi();
  return allTransaksi
    .filter(t => t.jenis === "Angsuran" && t.anggotaId === anggotaId && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}
