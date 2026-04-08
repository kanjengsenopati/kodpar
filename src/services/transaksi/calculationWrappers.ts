
import { calculateRealTimeFinancialData } from "../realTimeCalculationService";

/**
 * Wrapper functions for consistent API using real-time calculations
 */
export function calculateTotalSimpanan(anggotaId: string): number {
  const data = calculateRealTimeFinancialData(anggotaId);
  return data.totalSimpanan;
}

export function calculateTotalPinjaman(anggotaId: string): number {
  const data = calculateRealTimeFinancialData(anggotaId);
  return data.sisaPinjaman;
}

export function calculateTotalAngsuran(anggotaId: string): number {
  const data = calculateRealTimeFinancialData(anggotaId);
  return data.totalAngsuran;
}
