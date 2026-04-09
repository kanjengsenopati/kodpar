import { 
  calculateMemberRemainingLoan, 
  calculateMemberTotalSimpanan,
  calculateMemberTotalAngsuran
} from "../financialCalculations";
import { SHUCalculator } from "./financialOperations/SHUCalculator";

/**
 * PURE DATABASE DRIVEN CALCULATION WRAPPERS (SAK EP)
 * Unified access for Koperasi Simpan Pinjam Financial Data
 */

export async function calculateTotalSimpanan(anggotaId: string): Promise<number> {
  return calculateMemberTotalSimpanan(anggotaId);
}

export async function calculateTotalPinjaman(anggotaId: string): Promise<number> {
  // Returns current outstanding principal balance (Piutang Pokok)
  return calculateMemberRemainingLoan(anggotaId);
}

export async function calculateTotalAngsuran(anggotaId: string): Promise<number> {
  return calculateMemberTotalAngsuran(anggotaId);
}

export async function calculateSHU(anggotaId: string): Promise<number> {
  return SHUCalculator.calculate(anggotaId);
}
