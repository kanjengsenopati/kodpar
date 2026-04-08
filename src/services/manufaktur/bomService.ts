
import { BOM, BOMItem } from "@/types/manufaktur";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { v4 as uuidv4 } from "uuid";

const BOM_KEY = "manufaktur_bom";

export function getAllBOM(): BOM[] {
  return getFromLocalStorage<BOM[]>(BOM_KEY, []);
}

export function getBOMById(id: string): BOM | undefined {
  return getAllBOM().find((b) => b.id === id);
}

function generateBOMCode(): string {
  const list = getAllBOM();
  const num = list.length + 1;
  return `BOM-${String(num).padStart(3, "0")}`;
}

export function createBOM(data: Partial<BOM>): BOM {
  const now = new Date().toISOString();
  const items: BOMItem[] = data.items || [];
  const totalMaterialCost = items.reduce((sum, i) => sum + i.totalCost, 0);
  const overheadCost = data.overheadCost || 0;
  const laborCost = data.laborCost || 0;

  const newBOM: BOM = {
    id: uuidv4(),
    code: generateBOMCode(),
    productName: data.productName || "",
    productCode: data.productCode || "",
    description: data.description || "",
    category: data.category || "Lainnya",
    items,
    totalMaterialCost,
    overheadCost,
    laborCost,
    totalCost: totalMaterialCost + overheadCost + laborCost,
    outputQuantity: data.outputQuantity || 1,
    outputUnit: data.outputUnit || "pcs",
    status: data.status || "Draft",
    createdAt: now,
    updatedAt: now,
  };

  const list = getAllBOM();
  list.push(newBOM);
  saveToLocalStorage(BOM_KEY, list);
  return newBOM;
}

export function updateBOM(id: string, data: Partial<BOM>): BOM | null {
  const list = getAllBOM();
  const idx = list.findIndex((b) => b.id === id);
  if (idx === -1) return null;

  const items = data.items || list[idx].items;
  const totalMaterialCost = items.reduce((sum, i) => sum + i.totalCost, 0);
  const overheadCost = data.overheadCost ?? list[idx].overheadCost;
  const laborCost = data.laborCost ?? list[idx].laborCost;

  list[idx] = {
    ...list[idx],
    ...data,
    items,
    totalMaterialCost,
    totalCost: totalMaterialCost + overheadCost + laborCost,
    updatedAt: new Date().toISOString(),
  };

  saveToLocalStorage(BOM_KEY, list);
  return list[idx];
}

export function deleteBOM(id: string): boolean {
  const list = getAllBOM();
  const filtered = list.filter((b) => b.id !== id);
  if (filtered.length === list.length) return false;
  saveToLocalStorage(BOM_KEY, filtered);
  return true;
}
