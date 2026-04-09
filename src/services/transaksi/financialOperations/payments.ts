
import { calculateMemberTotalAngsuran, getAllMembersFinancialSummary } from "@/services/financialCalculations";

/**
 * Calculate total angsuran (installment payments) for a specific member
 * 
 * @param anggotaId Member ID to calculate for
 * @returns Total amount of installment payments
 */
export async function calculateTotalAngsuran(anggotaId: string | number): Promise<number> {
  return await calculateMemberTotalAngsuran(anggotaId.toString());
}

/**
 * Get total installment payments for all members
 * 
 * @returns Total amount of all member installment payments
 */
export async function getTotalAllAngsuran(): Promise<number> {
  const summary = await getAllMembersFinancialSummary();
  return summary.totalAngsuran;
}
