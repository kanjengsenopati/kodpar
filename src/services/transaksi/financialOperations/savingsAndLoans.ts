
import { calculateMemberTotalSimpanan, calculateMemberRemainingLoan, getAllMembersFinancialSummary } from "@/services/financialCalculations";

/**
 * Calculate total savings for a specific member including withdrawals
 * 
 * @param anggotaId Member ID to calculate for
 * @returns Total amount of savings minus withdrawals
 */
export function calculateTotalSimpanan(anggotaId: string | number): number {
  return calculateMemberTotalSimpanan(anggotaId.toString());
}

/**
 * Calculate total loans for a specific member (remaining balance)
 * 
 * @param anggotaId Member ID to calculate for
 * @returns Total amount of remaining loan balance
 */
export function calculateTotalPinjaman(anggotaId: string | number): number {
  return calculateMemberRemainingLoan(anggotaId.toString());
}

/**
 * Get total savings for all members including withdrawals
 * 
 * @returns Total amount of all member savings minus withdrawals
 */
export function getTotalAllSimpanan(): number {
  const summary = getAllMembersFinancialSummary();
  return summary.totalSimpanan;
}

/**
 * Get total loans for all members (original loan amounts)
 * 
 * @returns Total amount of all member loans
 */
export function getTotalAllPinjaman(): number {
  const summary = getAllMembersFinancialSummary();
  return summary.totalPinjaman;
}
