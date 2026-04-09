import { 
  calculateSHU as calculateSHUFromFinancialOperations,
  calculateSHUDistribution,
  resetAllSHUValues
} from "./transaksi/financialOperations";

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
  getUpcomingDueLoans
} from "./transaksi/loanOperations";

import { generateTransaksiId } from "./transaksi/idGenerator";

// Import modular operations
import {
  createTransaksi,
  updateTransaksi,
  deleteTransaksi,
  resetTransaksiData
} from "./transaksi/crudOperations";

import {
  calculateTotalSimpanan,
  calculateTotalPinjaman,
  calculateTotalAngsuran
} from "./transaksi/calculationWrappers";

// Re-export all functions to maintain the same API
export {
  // Core functions
  getAllTransaksi,
  getTransaksiByAnggotaId,
  getTransaksiById,
  getAvailableKategori,
  isValidKategori,
  getTransaksiByTypeAndCategory,
  
  // CRUD operations
  createTransaksi,
  updateTransaksi,
  deleteTransaksi,
  resetTransaksiData,
  
  // Loan operations
  getRemainingLoanAmount,
  calculateJatuhTempo,
  calculatePenalty,
  getOverdueLoans,
  getUpcomingDueLoans,
  
  // ID generation
  generateTransaksiId,
  
  // Financial operations
  calculateSHUFromFinancialOperations as calculateSHU,
  calculateSHUDistribution,
  resetAllSHUValues,
  
  // Calculation wrappers
  calculateTotalSimpanan,
  calculateTotalPinjaman,
  calculateTotalAngsuran
};
