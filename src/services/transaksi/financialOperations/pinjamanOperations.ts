
import { getAllTransaksi } from "../transaksiCore";
import { calculateMemberRemainingLoan, getAllMembersFinancialSummary } from "@/services/financialCalculations";
import { getLoanDetails } from "@/services/loanDataService";

/**
 * Calculate total outstanding pinjaman for an anggota (remaining balance) - CONSISTENT VERSION
 */
export function calculateTotalPinjaman(anggotaId: string): number {
  return calculateMemberRemainingLoan(anggotaId);
}

/**
 * Get total pinjaman for all members (original amounts)
 */
export function getTotalAllPinjaman(): number {
  const summary = getAllMembersFinancialSummary();
  return summary.totalPinjaman;
}

/**
 * Get total remaining loan balance for all members - CONSISTENT VERSION
 */
export function getTotalAllSisaPinjaman(): number {
  const transaksiList = getAllTransaksi();
  const uniqueAnggotaIds = [...new Set(transaksiList
    .filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
    .map(t => t.anggotaId))];
  
  return uniqueAnggotaIds.reduce((total, anggotaId) => {
    return total + calculateMemberRemainingLoan(anggotaId);
  }, 0);
}

/**
 * Get detailed loan summary for all members with consistent calculations
 */
export function getAllLoansDetailedSummary() {
  const transaksiList = getAllTransaksi();
  const pinjamanList = transaksiList.filter(t => t.jenis === "Pinjam" && t.status === "Sukses");
  
  return pinjamanList.map(pinjaman => {
    const loanDetails = getLoanDetails(pinjaman.id);
    return {
      id: pinjaman.id,
      anggotaId: pinjaman.anggotaId,
      anggotaNama: pinjaman.anggotaNama,
      jumlahPinjaman: pinjaman.jumlah,
      sisaPinjaman: loanDetails ? loanDetails.sisaPinjaman : calculateMemberRemainingLoan(pinjaman.anggotaId),
      status: loanDetails ? loanDetails.status : "Aktif",
      tanggalPinjam: pinjaman.tanggal
    };
  });
}
