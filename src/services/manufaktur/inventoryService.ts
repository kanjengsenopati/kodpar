
import { ManufakturInventory, StockMovement } from "@/types/manufaktur";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { v4 as uuidv4 } from "uuid";

const INV_KEY = "manufaktur_inventory";
const MOV_KEY = "manufaktur_stock_movements";

// ===== Inventory CRUD =====

export function getAllInventory(): ManufakturInventory[] {
  return getFromLocalStorage<ManufakturInventory[]>(INV_KEY, []);
}

export function getInventoryById(id: string): ManufakturInventory | undefined {
  return getAllInventory().find((i) => i.id === id);
}

export function getInventoryByCode(code: string): ManufakturInventory | undefined {
  return getAllInventory().find((i) => i.materialCode === code);
}

export function createInventory(data: Partial<ManufakturInventory>): ManufakturInventory {
  const now = new Date().toISOString();
  const currentStock = data.currentStock || 0;
  const unitCost = data.unitCost || 0;
  const inv: ManufakturInventory = {
    id: uuidv4(),
    materialCode: data.materialCode || "",
    materialName: data.materialName || "",
    category: data.category || "Bahan Baku",
    unit: data.unit || "pcs",
    currentStock,
    minimumStock: data.minimumStock || 0,
    maximumStock: data.maximumStock,
    unitCost,
    totalValue: currentStock * unitCost,
    location: data.location || "",
    lastRestocked: data.lastRestocked,
    createdAt: now,
    updatedAt: now,
  };
  const list = getAllInventory();
  list.push(inv);
  saveToLocalStorage(INV_KEY, list);
  return inv;
}

export function updateInventory(id: string, data: Partial<ManufakturInventory>): ManufakturInventory | null {
  const list = getAllInventory();
  const idx = list.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  const updated = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
  updated.totalValue = updated.currentStock * updated.unitCost;
  list[idx] = updated;
  saveToLocalStorage(INV_KEY, list);
  return list[idx];
}

export function deleteInventory(id: string): boolean {
  const list = getAllInventory();
  const filtered = list.filter((i) => i.id !== id);
  if (filtered.length === list.length) return false;
  saveToLocalStorage(INV_KEY, filtered);
  return true;
}

// ===== Stock Movements =====

export function getAllStockMovements(): StockMovement[] {
  return getFromLocalStorage<StockMovement[]>(MOV_KEY, []);
}

export function getMovementsByInventoryId(inventoryId: string): StockMovement[] {
  return getAllStockMovements().filter((m) => m.inventoryId === inventoryId);
}

export function addStockMovement(
  inventoryId: string,
  type: 'In' | 'Out' | 'Adjustment',
  quantity: number,
  opts?: { referenceType?: string; referenceId?: string; referenceCode?: string; notes?: string; performedBy?: string }
): StockMovement | null {
  const inv = getInventoryById(inventoryId);
  if (!inv) return null;

  const previousStock = inv.currentStock;
  let newStock = previousStock;
  if (type === 'In') newStock += quantity;
  else if (type === 'Out') newStock -= quantity;
  else newStock = quantity; // Adjustment sets absolute

  // Update inventory stock
  updateInventory(inventoryId, { currentStock: newStock, lastRestocked: type === 'In' ? new Date().toISOString().split("T")[0] : inv.lastRestocked });

  const movement: StockMovement = {
    id: uuidv4(),
    inventoryId,
    materialCode: inv.materialCode,
    materialName: inv.materialName,
    type,
    quantity,
    previousStock,
    newStock,
    referenceType: opts?.referenceType as any,
    referenceId: opts?.referenceId,
    referenceCode: opts?.referenceCode,
    notes: opts?.notes || "",
    performedBy: opts?.performedBy || "",
    createdAt: new Date().toISOString(),
  };

  const movements = getAllStockMovements();
  movements.unshift(movement);
  saveToLocalStorage(MOV_KEY, movements);
  return movement;
}

// ===== Integration: consume materials for a Work Order =====

export function consumeMaterialsForWO(bomItems: { materialCode: string; quantity: number }[], woQuantity: number, woCode: string, woId: string): { success: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const item of bomItems) {
    const inv = getInventoryByCode(item.materialCode);
    if (!inv) {
      errors.push(`Material ${item.materialCode} tidak ditemukan di inventory`);
      continue;
    }
    const needed = item.quantity * woQuantity;
    if (inv.currentStock < needed) {
      errors.push(`Stok ${inv.materialName} tidak cukup (butuh ${needed} ${inv.unit}, tersedia ${inv.currentStock})`);
      continue;
    }
    addStockMovement(inv.id, 'Out', needed, {
      referenceType: 'WorkOrder',
      referenceId: woId,
      referenceCode: woCode,
      notes: `Konsumsi material untuk ${woCode}`,
    });
  }
  return { success: errors.length === 0, errors };
}

// ===== Low stock check =====
export function getLowStockItems(): ManufakturInventory[] {
  return getAllInventory().filter((i) => i.currentStock <= i.minimumStock);
}
