
import { 
  calculateMemberTotalSimpanan, 
  getAllMembersFinancialSummary 
} from "../../financialCalculations";

/**
 * Calculate total simpanan for an anggota (net balance)
 */
export async function calculateTotalSimpanan(anggotaId: string): Promise<number> {
  return await calculateMemberTotalSimpanan(anggotaId);
}

/**
 * Get total simpanan for all members (net balance)
 */
export async function getTotalAllSimpanan(): Promise<number> {
  const summary = await getAllMembersFinancialSummary();
  return summary.totalSimpanan;
}
