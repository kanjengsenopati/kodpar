
import { calculateRealTimeFinancialData } from "../realTimeCalculationService";

/**
 * Wrapper functions for consistent API using real-time calculations
 */
/**
 * Wrapper functions for consistent API using real-time calculations
 */
export async function calculateTotalSimpanan(anggotaId: string): Promise<number> {
  const data = await calculateRealTimeFinancialData(anggotaId);
  return data.totalSimpanan;
}

export async function calculateTotalPinjaman(anggotaId: string): Promise<number> {
  const data = await calculateRealTimeFinancialData(anggotaId);
  return data.sisaPinjaman;
}

export async function calculateTotalAngsuran(anggotaId: string): Promise<number> {
  const data = await calculateRealTimeFinancialData(anggotaId);
  return data.totalAngsuran;
}
