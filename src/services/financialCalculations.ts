import { db } from "@/db/db";
import { getAllTransaksi } from "./transaksi/transaksiCore";
import { Transaksi } from "@/types";
import { formatCurrency } from "@/utils/formatters";

/**
 * Centralized Financial Calculation Service - KOPERASI SIMPAN PINJAM (SAK EP)
 * Provides 100% pure database-driven calculations without hybrid string parsing.
 */

/**
 * Calculate member's remaining loan balance (Saldo Piutang Pokok)
 * SAK EP Compliant - Amortized Cost based on structured nominalPokok fields.
 */
export async function calculateMemberRemainingLoan(anggotaId: string): Promise<number> {
  const transaksiList = await getAllTransaksi();
  
  // 1. Total Plafon Pinjaman (Disbursed)
  const totalLoanAmount = transaksiList
    .filter(t => t.jenis === "Pinjam" && t.anggotaId === anggotaId && t.status === "Sukses")
    .reduce((sum, loan) => sum + (loan.jumlah || 0), 0);
  
  // 2. Total Angsuran Pokok (Repaid)
  const totalPrincipalPaid = transaksiList
    .filter(t => t.jenis === "Angsuran" && t.anggotaId === anggotaId && t.status === "Sukses")
    .reduce((sum, payment) => sum + (payment.nominalPokok || 0), 0);
  
  return Math.max(0, totalLoanAmount - totalPrincipalPaid);
}

/**
 * Calculate remaining balance for a SPECIFIC loan transaction
 */
export async function calculateSpecificLoanRemainingBalance(loanId: string): Promise<number> {
  const transaksiList = await getAllTransaksi();
  
  const loan = transaksiList.find(t => t.id === loanId && t.jenis === "Pinjam" && t.status === "Sukses");
  if (!loan) return 0;
  
  const totalPrincipalPaid = transaksiList
    .filter(t => t.jenis === "Angsuran" && t.status === "Sukses" && t.referensiPinjamanId === loanId)
    .reduce((sum, payment) => sum + (payment.nominalPokok || 0), 0);
  
  return Math.max(0, (loan.jumlah || 0) - totalPrincipalPaid);
}

/**
 * Calculate total savings (Total Simpanan) for a member
 */
export async function calculateMemberTotalSimpanan(anggotaId: string): Promise<number> {
  const transaksi = await db.transaksi
    .where("anggotaId")
    .equals(anggotaId)
    .and(t => t.status === "Sukses")
    .toArray();

  const totalSimpan = transaksi
    .filter(t => t.jenis === "Simpan")
    .reduce((sum, t) => sum + (t.jumlah || 0), 0);

  const totalTarik = transaksi
    .filter(t => t.jenis === "Penarikan")
    .reduce((sum, t) => sum + Math.abs(t.jumlah || 0), 0);

  return Math.max(0, totalSimpan - totalTarik);
}

/**
 * Calculate detailed financial summary for a member
 */
export async function calculateDetailedMemberFinancialSummary(anggotaId: string) {
  const transaksi = await db.transaksi
    .where("anggotaId")
    .equals(anggotaId)
    .and(t => t.status === "Sukses")
    .toArray();

  const totalSimpanan = transaksi
    .filter(t => t.jenis === "Simpan")
    .reduce((sum, t) => sum + (t.jumlah || 0), 0);

  const totalPenarikan = transaksi
    .filter(t => t.jenis === "Penarikan")
    .reduce((sum, t) => sum + Math.abs(t.jumlah || 0), 0);

  const totalPinjaman = transaksi
    .filter(t => t.jenis === "Pinjam")
    .reduce((sum, t) => sum + (t.jumlah || 0), 0);

  const totalAngsuran = transaksi
    .filter(t => t.jenis === "Angsuran")
    .reduce((sum, t) => sum + (t.jumlah || 0), 0);

  const sisaPinjaman = await calculateMemberRemainingLoan(anggotaId);

  return {
    totalSimpanan: totalSimpanan - totalPenarikan,
    totalPinjaman,
    totalAngsuran,
    sisaPinjaman,
    totalPenarikan,
    totalSHU: 0, // SHU calculation is separate, but we provide a placeholder
    rawSimpanan: totalSimpanan,
    rawPenarikan: totalPenarikan
  };
}

/**
 * Get comprehensive member financial overview
 */
export async function getMemberFinancialOverview(anggotaId: string) {
  const summary = await calculateDetailedMemberFinancialSummary(anggotaId);

  return {
    ...summary,
    formattedLoan: formatCurrency(summary.sisaPinjaman),
    formattedSavings: formatCurrency(summary.totalSimpanan)
  };
}

/**
 * Get comprehensive financial summary for all members with SAK EP reconciliation
 */
export async function getAllMembersFinancialSummary() {
  const transaksiList = await getAllTransaksi();
  
  const totalPinjaman = transaksiList
    .filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
    .reduce((total, t) => total + (t.jumlah || 0), 0);
  
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
    totalAngsuran,
    totalSisaPinjaman,
    totalMembers: uniqueAnggotaIds.length
  };
}
