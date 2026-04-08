
import { getAllTransaksi } from "./transaksi/transaksiCore";
import { Transaksi } from "@/types";

/**
 * Centralized Financial Calculation Service
 * Provides consistent calculations across all modules
 */

/**
 * Calculate remaining loan balance for a specific member with CONSISTENT logic
 */
export function calculateMemberRemainingLoan(anggotaId: string): number {
  const transaksiList = getAllTransaksi();
  
  // Get all successful loans for this member
  const memberLoans = transaksiList.filter(
    t => t.jenis === "Pinjam" && t.anggotaId === anggotaId && t.status === "Sukses"
  );
  
  // Calculate total original loan amount
  const totalLoanAmount = memberLoans.reduce((sum, loan) => sum + loan.jumlah, 0);
  
  // Get all successful installment payments for this member
  const memberPayments = transaksiList.filter(
    t => t.jenis === "Angsuran" && t.anggotaId === anggotaId && t.status === "Sukses"
  );
  
  // Calculate total principal payments (extract pokok from keterangan or use full amount)
  let totalPrincipalPaid = 0;
  memberPayments.forEach(payment => {
    // Try to extract pokok amount from keterangan
    const pokokMatch = payment.keterangan?.match(/Pokok:\s*[\w\s]*?(\d+(?:[\.,]\d+)*)/);
    if (pokokMatch && pokokMatch[1]) {
      const pokokAmount = parseFloat(pokokMatch[1].replace(/[,\.]/g, ''));
      totalPrincipalPaid += pokokAmount;
    } else {
      // If no pokok info in keterangan, estimate 80% as principal (conservative approach)
      totalPrincipalPaid += Math.floor(payment.jumlah * 0.8);
    }
  });
  
  // Return remaining balance (cannot be negative)
  const remainingBalance = Math.max(0, totalLoanAmount - totalPrincipalPaid);
  
  console.log(`Member ${anggotaId}: Total Loans=${totalLoanAmount}, Principal Paid=${totalPrincipalPaid}, Remaining=${remainingBalance}`);
  
  return remainingBalance;
}

/**
 * Calculate remaining loan balance for a SPECIFIC loan transaction
 */
export function calculateSpecificLoanRemainingBalance(loanId: string): number {
  const transaksiList = getAllTransaksi();
  
  // Find the specific loan
  const loan = transaksiList.find(t => t.id === loanId && t.jenis === "Pinjam" && t.status === "Sukses");
  if (!loan) return 0;
  
  // Get all successful installment payments for this specific loan
  const loanPayments = transaksiList.filter(
    t => t.jenis === "Angsuran" && 
         t.anggotaId === loan.anggotaId && 
         t.status === "Sukses" &&
         t.keterangan?.includes(loanId)
  );
  
  // Calculate total principal payments for this specific loan
  let totalPrincipalPaid = 0;
  loanPayments.forEach(payment => {
    const pokokMatch = payment.keterangan?.match(/Pokok:\s*[\w\s]*?(\d+(?:[\.,]\d+)*)/);
    if (pokokMatch && pokokMatch[1]) {
      const pokokAmount = parseFloat(pokokMatch[1].replace(/[,\.]/g, ''));
      totalPrincipalPaid += pokokAmount;
    } else {
      // Fallback: assume 80% is principal
      totalPrincipalPaid += Math.floor(payment.jumlah * 0.8);
    }
  });
  
  const remainingBalance = Math.max(0, loan.jumlah - totalPrincipalPaid);
  
  console.log(`Loan ${loanId}: Original=${loan.jumlah}, Principal Paid=${totalPrincipalPaid}, Remaining=${remainingBalance}`);
  
  return remainingBalance;
}

/**
 * Calculate total savings for a member (net savings after withdrawals)
 */
export function calculateMemberTotalSimpanan(anggotaId: string): number {
  const transaksiList = getAllTransaksi();
  
  // Calculate total deposits
  const totalDeposits = transaksiList
    .filter(t => t.anggotaId === anggotaId && t.jenis === "Simpan" && t.status === "Sukses" && t.jumlah > 0)
    .reduce((total, t) => total + t.jumlah, 0);
  
  // Calculate total withdrawals (including negative simpan transactions)
  const totalWithdrawals = transaksiList
    .filter(t => t.anggotaId === anggotaId && t.status === "Sukses")
    .filter(t => 
      (t.jenis === "Penarikan") || 
      (t.jenis === "Simpan" && t.jumlah < 0)
    )
    .reduce((total, t) => total + Math.abs(t.jumlah), 0);
  
  return Math.max(0, totalDeposits - totalWithdrawals);
}

/**
 * Calculate total installment payments for a member
 */
export function calculateMemberTotalAngsuran(anggotaId: string): number {
  const transaksiList = getAllTransaksi();
  return transaksiList
    .filter(t => t.anggotaId === anggotaId && t.jenis === "Angsuran" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}

/**
 * Get comprehensive financial summary for all members
 */
export function getAllMembersFinancialSummary() {
  const transaksiList = getAllTransaksi();
  
  // Calculate total original loan amounts
  const totalPinjaman = transaksiList
    .filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
  
  // Calculate total savings (net after withdrawals)
  const totalSimpanan = transaksiList
    .filter(t => t.jenis === "Simpan" && t.status === "Sukses" && t.jumlah > 0)
    .reduce((total, t) => total + t.jumlah, 0);
  
  const totalPenarikan = transaksiList
    .filter(t => t.status === "Sukses")
    .filter(t => (t.jenis === "Penarikan") || (t.jenis === "Simpan" && t.jumlah < 0))
    .reduce((total, t) => total + Math.abs(t.jumlah), 0);
  
  // Calculate total installment payments
  const totalAngsuran = transaksiList
    .filter(t => t.jenis === "Angsuran" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
  
  // Calculate total remaining loans for all members
  const uniqueAnggotaIds = [...new Set(transaksiList
    .filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
    .map(t => t.anggotaId))];
  
  const totalSisaPinjaman = uniqueAnggotaIds.reduce((total, anggotaId) => {
    return total + calculateMemberRemainingLoan(anggotaId);
  }, 0);
  
  return {
    totalPinjaman,
    totalSimpanan: totalSimpanan - totalPenarikan,
    totalPenarikan,
    totalAngsuran,
    totalSisaPinjaman
  };
}
