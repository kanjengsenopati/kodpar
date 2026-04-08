
import { calculateMemberTotalAngsuran, getAllMembersFinancialSummary } from "@/services/financialCalculations";

/**
 * Calculate total angsuran (installment payments) for a specific member
 * 
 * @param anggotaId Member ID to calculate for
 * @returns Total amount of installment payments
 */
export function calculateTotalAngsuran(anggotaId: string | number): number {
  return calculateMemberTotalAngsuran(anggotaId.toString());
}

/**
 * Get total installment payments for all members
 * 
 * @returns Total amount of all member installment payments
 */
export function getTotalAllAngsuran(): number {
  const summary = getAllMembersFinancialSummary();
  return summary.totalAngsuran;
}
