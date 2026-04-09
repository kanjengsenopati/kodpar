
import { calculateMemberTotalSimpanan, calculateMemberRemainingLoan, getAllMembersFinancialSummary } from "@/services/financialCalculations";

/**
 * Calculate total savings for a specific member including withdrawals
 * 
 * @param anggotaId Member ID to calculate for
 * @returns Total amount of savings minus withdrawals
 */
export async function calculateTotalSimpanan(anggotaId: string | number): Promise<number> {
  return await calculateMemberTotalSimpanan(anggotaId.toString());
}

/**
 * Calculate total loans for a specific member (remaining balance)
 * 
 * @param anggotaId Member ID to calculate for
 * @returns Total amount of remaining loan balance
 */
export async function calculateTotalPinjaman(anggotaId: string | number): Promise<number> {
  return await calculateMemberRemainingLoan(anggotaId.toString());
}

/**
 * Get total savings for all members including withdrawals
 * 
 * @returns Total amount of all member savings minus withdrawals
 */
export async function getTotalAllSimpanan(): Promise<number> {
  const summary = await getAllMembersFinancialSummary();
  // Map totalPinjaman to total savings balance logic if needed, 
  // but here we use the specific summary field.
  // Note: getAllMembersFinancialSummary returns totalPinjaman, totalAngsuran, etc.
  // For total Simpanan, we might need a separate aggregate or use the one from summary if added.
  // Current implementation of getAllMembersFinancialSummary doesn't have totalSimpanan.
  // I will update getAllMembersFinancialSummary in financialCalculations.ts first.
  return (summary as any).totalSimpanan || 0;
}

/**
 * Get total loans for all members (original loan amounts)
 * 
 * @returns Total amount of all member loans
 */
export async function getTotalAllPinjaman(): Promise<number> {
  const summary = await getAllMembersFinancialSummary();
  return summary.totalPinjaman;
}
