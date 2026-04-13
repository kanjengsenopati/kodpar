
import { 
  calculateSHU as calculateSHUFromFinancialOperations,
  calculateSHUDistribution,
  resetAllSHUValues,
  refreshAllSHUCalculations
} from "./transaksi/financialOperations/shuOperations";

import { 
  getAllTransaksi, 
  getTransaksiByAnggotaId, 
  getTransaksiById, 
  getAvailableKategori,
  isValidKategori,
  getTransaksiByTypeAndCategory
} from "./transaksi/transaksiCore";

import {
  getRemainingLoanAmount,
  calculateJatuhTempo,
  calculatePenalty,
  getOverdueLoans,
  getUpcomingDueLoans,
  getAnggotaWithActiveLoans,
  getActiveLoansByAnggotaId,
  getLoanInterestRate,
  generateInstallmentSchedule
} from "./transaksi/loanOperations";

import { generateUUIDv7 } from "@/utils/idUtils";

// Import modular operations
import {
  createTransaksi,
  updateTransaksi,
  deleteTransaksi,
  resetTransaksiData
} from "./transaksi/crudOperations";

import {
  calculateMemberTotalSimpanan,
  calculateMemberRemainingLoan,
  calculateMemberTotalAngsuran,
  calculateDetailedMemberFinancialSummary,
  getMemberFinancialOverview,
  getAllMembersFinancialSummary,
  calculateSpecificLoanRemainingBalance
} from "./financialCalculations";

import {
  calculateTotalSimpanan as calcTotalSimpanan,
  getTotalAllSimpanan
} from "./transaksi/financialOperations/savingsAndLoans";

import {
  calculateTotalAngsuran as calcTotalAngsuran,
  getTotalAllAngsuran
} from "./transaksi/financialOperations/payments";

import { SHUManager } from "./transaksi/financialOperations/SHUManager";


/**
 * Stabilized Transaction Service Entry Point
 * Bypasses all barrel files to prevent Rollup circular dependency tracing errors.
 */
export const transaksiService = {
  // Core
  getAllTransaksi,
  getTransaksiByAnggotaId,
  getTransaksiById,
  getAvailableKategori,
  isValidKategori,
  getTransaksiByTypeAndCategory,
  generateId: generateUUIDv7,
  
  // CRUD
  create: createTransaksi,
  update: updateTransaksi,
  delete: deleteTransaksi,
  resetData: resetTransaksiData,
  
  // Loans
  getRemainingLoanAmount,
  getOverdueLoans,
  getUpcomingDueLoans,
  getActiveLoansByAnggotaId,
  getAnggotaWithActiveLoans,
  getLoanInterestRate,
  generateInstallmentSchedule,
  calculatePenalty,
  calculateJatuhTempo,
  
  // Financial Calculations (Aggregate)
  calculateTotalSimpanan: calculateMemberTotalSimpanan,
  calculateTotalPinjaman: calculateMemberRemainingLoan,
  calculateTotalAngsuran: calculateMemberTotalAngsuran,
  getMemberFinancialOverview,
  getDetailedSummary: calculateDetailedMemberFinancialSummary,
  getAllMembersSummary: getAllMembersFinancialSummary,
  calculateSpecificLoanRemainingBalance,
  
  // SHU
  calculateSHU: calculateSHUFromFinancialOperations,
  calculateSHUDistribution,
  resetAllSHUValues,
  refreshAllSHUCalculations,
  shuManager: SHUManager
};

// Also export as individual functions for backward compatibility with components using named imports
export { 
  getAllTransaksi, 
  getTransaksiByAnggotaId, 
  getTransaksiById, 
  getAvailableKategori,
  isValidKategori,
  getTransaksiByTypeAndCategory,
  generateUUIDv7 as generateTransaksiId,
  createTransaksi,
  updateTransaksi,
  deleteTransaksi,
  resetTransaksiData,
  getRemainingLoanAmount,
  getOverdueLoans,
  getUpcomingDueLoans,
  getAnggotaWithActiveLoans,
  getLoanInterestRate,
  generateInstallmentSchedule,
  calculatePenalty,
  calculateJatuhTempo,
  calculateMemberTotalSimpanan as calculateTotalSimpanan,
  calculateMemberRemainingLoan as calculateTotalPinjaman,
  calculateMemberTotalAngsuran as calculateTotalAngsuran,
  getMemberFinancialOverview,
  calculateDetailedMemberFinancialSummary as getDetailedMemberFinancialSummary,
  getAllMembersFinancialSummary as getAllMembersSummary,
  calculateSpecificLoanRemainingBalance,
  calculateSHUFromFinancialOperations as calculateSHU,
  calculateSHUDistribution,
  resetAllSHUValues,
  refreshAllSHUCalculations,
  getActiveLoansByAnggotaId,
  SHUManager
};
