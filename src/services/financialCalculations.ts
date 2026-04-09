
import { getAllTransaksi } from "./transaksi/transaksiCore";
import { Transaksi } from "@/types";

/**
 * Centralized Financial Calculation Service
 * Provides consistent calculations across all modules with SAK EP compliance
 */

/**
 * Calculate remaining loan balance for a specific member with SAK EP precision
 * SAK EP REQUIRES: Using amortized cost (Principal Balance)
 */
export async function calculateMemberRemainingLoan(anggotaId: string): Promise<number> {
  const transaksiList = await getAllTransaksi();
  
  // 1. Total Successful Loans (Pencairan)
  const totalLoanAmount = transaksiList
    .filter(t => t.jenis === "Pinjam" && t.anggotaId === anggotaId && t.status === "Sukses")
    .reduce((sum, loan) => sum + (loan.jumlah || 0), 0);
  
  // 2. Total Principal Repayments
  const memberPayments = transaksiList.filter(
    t => t.jenis === "Angsuran" && t.anggotaId === anggotaId && t.status === "Sukses"
  );
  
  let totalPrincipalPaid = 0;
  memberPayments.forEach(payment => {
    // Priority 1: Structured field (SAK EP Compliant)
    if (payment.nominalPokok !== undefined && payment.nominalPokok !== null) {
      totalPrincipalPaid += payment.nominalPokok;
    } 
    // Priority 2: Structured metadata in keterangan (Regex fallback)
    else {
      const pokokMatch = payment.keterangan?.match(/Pokok:\s*[\w\s]*?(\d+(?:[\.,]\d+)*)/);
      if (pokokMatch && pokokMatch[1]) {
        const pokokAmount = parseFloat(pokokMatch[1].replace(/[,\.]/g, ''));
        totalPrincipalPaid += pokokAmount;
      } 
      // NOTE: Removed arbitrary 80% estimation to maintain SAK EP integrity. 
      // If no principal data found, it defaults to 0 to prevent overstated repayments.
    }
  });
  
  const remainingBalance = Math.max(0, totalLoanAmount - totalPrincipalPaid);
  
  if (remainingBalance > 0) {
    console.log(`📊 SAK EP Member Balance Audit [${anggotaId}]: Gross=${totalLoanAmount}, Paid=${totalPrincipalPaid}, Balance=${remainingBalance}`);
  }
  
  return remainingBalance;
}

/**
 * Calculate remaining loan balance for a SPECIFIC loan transaction
 */
export async function calculateSpecificLoanRemainingBalance(loanId: string): Promise<number> {
  const transaksiList = await getAllTransaksi();
  
  const loan = transaksiList.find(t => t.id === loanId && t.jenis === "Pinjam" && t.status === "Sukses");
  if (!loan) return 0;
  
  const loanPayments = transaksiList.filter(
    t => t.jenis === "Angsuran" && 
         t.anggotaId === loan.anggotaId && 
         t.status === "Sukses" &&
         t.keterangan?.includes(loanId)
  );
  
  let totalPrincipalPaid = 0;
  loanPayments.forEach(payment => {
    if (payment.nominalPokok !== undefined && payment.nominalPokok !== null) {
      totalPrincipalPaid += payment.nominalPokok;
    } else {
      const pokokMatch = payment.keterangan?.match(/Pokok:\s*[\w\s]*?(\d+(?:[\.,]\d+)*)/);
      if (pokokMatch && pokokMatch[1]) {
        const pokokAmount = parseFloat(pokokMatch[1].replace(/[,\.]/g, ''));
        totalPrincipalPaid += pokokAmount;
      }
    }
  });
  
  return Math.max(0, (loan.jumlah || 0) - totalPrincipalPaid);
}

/**
 * Calculate total savings for a member (net savings after withdrawals)
 */
export async function calculateMemberTotalSimpanan(anggotaId: string): Promise<number> {
  const transaksiList = await getAllTransaksi();
  
  const totalDeposits = transaksiList
    .filter(t => t.anggotaId === anggotaId && t.jenis === "Simpan" && t.status === "Sukses" && (t.jumlah || 0) > 0)
    .reduce((total, t) => total + (t.jumlah || 0), 0);
  
  const totalWithdrawals = transaksiList
    .filter(t => t.anggotaId === anggotaId && t.status === "Sukses")
    .filter(t => (t.jenis === "Penarikan") || (t.jenis === "Simpan" && (t.jumlah || 0) < 0))
    .reduce((total, t) => total + Math.abs(t.jumlah || 0), 0);
  
  return Math.max(0, totalDeposits - totalWithdrawals);
}

/**
 * Calculate total installment payments for a member (Total cash flow)
 */
export async function calculateMemberTotalAngsuran(anggotaId: string): Promise<number> {
  const transaksiList = await getAllTransaksi();
  return transaksiList
    .filter(t => t.anggotaId === anggotaId && t.jenis === "Angsuran" && t.status === "Sukses")
    .reduce((total, t) => total + (t.jumlah || 0), 0);
}

/**
 * Get comprehensive financial summary for all members with SAK EP reconciliation
 */
export async function getAllMembersFinancialSummary() {
  const transaksiList = await getAllTransaksi();
  
  const totalPinjaman = transaksiList
    .filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
    .reduce((total, t) => total + (t.jumlah || 0), 0);
  
  const totalSimpanan = transaksiList
    .filter(t => t.jenis === "Simpan" && t.status === "Sukses" && (t.jumlah || 0) > 0)
    .reduce((total, t) => total + (t.jumlah || 0), 0);
  
  const totalPenarikan = transaksiList
    .filter(t => t.status === "Sukses")
    .filter(t => (t.jenis === "Penarikan") || (t.jenis === "Simpan" && (t.jumlah || 0) < 0))
    .reduce((total, t) => total + Math.abs(t.jumlah || 0), 0);
  
  const totalAngsuran = transaksiList
    .filter(t => t.jenis === "Angsuran" && t.status === "Sukses")
    .reduce((total, t) => total + (t.jumlah || 0), 0);
  
  // Aggregate sisa pinjaman using precise member-level logic
  const uniqueAnggotaIds = [...new Set(transaksiList
    .filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
    .map(t => t.anggotaId))];
  
  const loanBalancePromises = uniqueAnggotaIds.map(anggotaId => calculateMemberRemainingLoan(anggotaId));
  const loanBalances = await Promise.all(loanBalancePromises);
  const totalSisaPinjaman = loanBalances.reduce((total, balance) => total + balance, 0);
  
  return {
    totalPinjaman,
    totalSimpanan: totalSimpanan - totalPenarikan,
    totalPenarikan,
    totalAngsuran,
    totalSisaPinjaman
  };
}
