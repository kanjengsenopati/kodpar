
// Main export file for keuangan services
export * from './kategoriService';
export * from './transaksiService';
export * from './reportingService';

// Import and ensure auto-deduction categories on module load
import { ensureAutoDeductionCategories } from './baseService';

// Initialize auto-deduction categories when the module loads
ensureAutoDeductionCategories();
