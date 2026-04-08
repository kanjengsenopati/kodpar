
export interface BOMItem {
  id: string;
  bomId: string;
  materialName: string;
  materialCode: string;
  quantity: number;
  unit: string; // pcs, kg, liter, meter, etc.
  unitCost: number;
  totalCost: number;
  notes?: string;
}

export interface BOM {
  id: string;
  code: string; // BOM-001, BOM-002, etc.
  productName: string;
  productCode: string;
  description?: string;
  category: string;
  items: BOMItem[];
  totalMaterialCost: number;
  overheadCost: number;
  laborCost: number;
  totalCost: number;
  outputQuantity: number;
  outputUnit: string;
  status: 'Draft' | 'Active' | 'Inactive';
  createdAt: string;
  updatedAt: string;
}

export const BOM_CATEGORIES = [
  'Makanan & Minuman',
  'Elektronik',
  'Tekstil',
  'Furnitur',
  'Kerajinan',
  'Kimia',
  'Lainnya',
];

export const MATERIAL_UNITS = [
  'pcs', 'kg', 'gram', 'liter', 'ml', 'meter', 'cm', 'lembar', 'batang', 'set', 'pack', 'roll',
];

// ===== Work Orders =====

export type WOStatus = 'Draft' | 'In Progress' | 'Completed' | 'Cancelled';
export type WOPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface WorkOrder {
  id: string;
  code: string; // WO-001, WO-002, etc.
  bomId: string;
  bomCode: string;
  productName: string;
  quantity: number;
  unit: string;
  status: WOStatus;
  priority: WOPriority;
  startDate: string;
  dueDate: string;
  completedDate?: string;
  assignedTo?: string;
  notes?: string;
  estimatedCost: number;
  actualCost?: number;
  createdAt: string;
  updatedAt: string;
}

export const WO_STATUSES: WOStatus[] = ['Draft', 'In Progress', 'Completed', 'Cancelled'];
export const WO_PRIORITIES: WOPriority[] = ['Low', 'Medium', 'High', 'Urgent'];

// ===== Production Planning =====

export type PPStatus = 'Draft' | 'Confirmed' | 'In Production' | 'Completed' | 'Cancelled';

export interface ProductionPlan {
  id: string;
  code: string; // PP-001
  name: string;
  description?: string;
  workOrderIds: string[]; // linked WOs
  startDate: string;
  endDate: string;
  status: PPStatus;
  targetOutput: number;
  actualOutput: number;
  outputUnit: string;
  shift?: string;
  supervisor?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const PP_STATUSES: PPStatus[] = ['Draft', 'Confirmed', 'In Production', 'Completed', 'Cancelled'];

// ===== Quality Control =====

export type QCStatus = 'Pending' | 'Passed' | 'Failed' | 'Conditional';
export type QCType = 'Incoming' | 'In-Process' | 'Final';

export interface QCCheckItem {
  id: string;
  parameter: string;
  standard: string;
  actual: string;
  passed: boolean;
  notes?: string;
}

export interface QualityControl {
  id: string;
  code: string; // QC-001
  type: QCType;
  workOrderId?: string;
  workOrderCode?: string;
  productName: string;
  productCode: string;
  batchNumber?: string;
  inspectionDate: string;
  inspector: string;
  sampleSize: number;
  defectsFound: number;
  status: QCStatus;
  checkItems: QCCheckItem[];
  overallNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export const QC_STATUSES: QCStatus[] = ['Pending', 'Passed', 'Failed', 'Conditional'];
export const QC_TYPES: QCType[] = ['Incoming', 'In-Process', 'Final'];

// ===== Inventory Management (Manufaktur) =====

export type StockMovementType = 'In' | 'Out' | 'Adjustment';

export interface ManufakturInventory {
  id: string;
  materialCode: string;
  materialName: string;
  category: string;
  unit: string;
  currentStock: number;
  minimumStock: number;
  maximumStock?: number;
  unitCost: number;
  totalValue: number;
  location?: string;
  lastRestocked?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  inventoryId: string;
  materialCode: string;
  materialName: string;
  type: StockMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  referenceType?: 'WorkOrder' | 'Purchase' | 'Manual';
  referenceId?: string;
  referenceCode?: string;
  notes?: string;
  performedBy?: string;
  createdAt: string;
}

export const STOCK_MOVEMENT_TYPES: StockMovementType[] = ['In', 'Out', 'Adjustment'];

export const INVENTORY_CATEGORIES = [
  'Bahan Baku',
  'Bahan Penolong',
  'Kemasan',
  'Suku Cadang',
  'Lainnya',
];
