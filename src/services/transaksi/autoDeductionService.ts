
import { Transaksi } from "@/types";
import { getPengaturan } from "@/services/pengaturanService";
import { createPemasukanPengeluaran } from "@/services/keuangan";

export interface AutoDeductionResult {
  danaResikoKredit?: {
    enabled: boolean;
    amount: number;
    percentage: number;
  };
  simpananWajibKredit?: {
    enabled: boolean;
    amount: number;
    percentage: number;
  };
}

export interface AutoDeductionProcessResult {
  success: boolean;
  createdTransactions: Array<{
    id: string;
    type: 'danaResikoKredit' | 'simpananWajibKredit';
    amount: number;
  }>;
  errors: string[];
}

/**
 * Calculate auto deductions for Dana Resiko Kredit and Simpanan Wajib Kredit
 */
export function calculateAutoDeductions(loanAmount: number): AutoDeductionResult {
  const pengaturan = getPengaturan();
  const result: AutoDeductionResult = {};

  // Dana Resiko Kredit calculation
  if (pengaturan?.sukuBunga?.danaResikoKredit?.enabled) {
    const percentage = pengaturan.sukuBunga.danaResikoKredit.persentase;
    result.danaResikoKredit = {
      enabled: true,
      amount: (loanAmount * percentage) / 100,
      percentage
    };
  }

  // Simpanan Wajib Kredit calculation
  if (pengaturan?.sukuBunga?.simpananWajibKredit?.enabled) {
    const percentage = pengaturan.sukuBunga.simpananWajibKredit.persentase;
    result.simpananWajibKredit = {
      enabled: true,
      amount: (loanAmount * percentage) / 100,
      percentage
    };
  }

  return result;
}

/**
 * Process auto deductions by creating corresponding financial transactions
 */
export function processAutoDeductions(
  loanTransaction: Transaksi,
  deductions: AutoDeductionResult
): AutoDeductionProcessResult {
  const result: AutoDeductionProcessResult = {
    success: true,
    createdTransactions: [],
    errors: []
  };

  try {
    // Process Dana Resiko Kredit
    if (deductions.danaResikoKredit?.enabled && deductions.danaResikoKredit.amount > 0) {
      const drk = createPemasukanPengeluaran({
        tanggal: loanTransaction.tanggal,
        kategori: "Dana Resiko Kredit",
        jumlah: deductions.danaResikoKredit.amount,
        keterangan: `Auto deduction Dana Resiko Kredit ${deductions.danaResikoKredit.percentage}% dari pinjaman ${loanTransaction.anggotaNama} - ${loanTransaction.id}`,
        jenis: "Pemasukan",
        createdBy: "system_auto_deduction"
      });

      result.createdTransactions.push({
        id: drk.id,
        type: 'danaResikoKredit',
        amount: drk.jumlah
      });
    }

    // Process Simpanan Wajib Kredit
    if (deductions.simpananWajibKredit?.enabled && deductions.simpananWajibKredit.amount > 0) {
      const swk = createPemasukanPengeluaran({
        tanggal: loanTransaction.tanggal,
        kategori: "Simpanan Wajib Kredit",
        jumlah: deductions.simpananWajibKredit.amount,
        keterangan: `Auto deduction Simpanan Wajib Kredit ${deductions.simpananWajibKredit.percentage}% dari pinjaman ${loanTransaction.anggotaNama} - ${loanTransaction.id}`,
        jenis: "Pemasukan",
        createdBy: "system_auto_deduction"
      });

      result.createdTransactions.push({
        id: swk.id,
        type: 'simpananWajibKredit',
        amount: swk.jumlah
      });
    }

  } catch (error) {
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Unknown error in auto deduction');
    console.error('Auto deduction processing error:', error);
  }

  return result;
}
