import { BOM, BOMItem } from "@/types/manufaktur";
import { db } from "@/db/db";
import { generateUUIDv7 } from "@/utils/idUtils";

/**
 * Get all BOMs from local mirror
 */
export const getAllBOM = async (): Promise<BOM[]> => {
  const boms = await db.table('mfg_bom').toArray();
  const items = await db.table('mfg_bom_item').toArray();

  return boms.map(bom => ({
    ...bom,
    items: items.filter(item => item.bomId === bom.id)
  }));
};

/**
 * Get BOM by ID
 */
export const getBOMById = async (id: string): Promise<BOM | undefined> => {
  const bom = await db.table('mfg_bom').get(id);
  if (!bom) return undefined;

  const items = await db.table('mfg_bom_item').where('bomId').equals(id).toArray();
  return { ...bom, items };
};

/**
 * Helper to generate internal BOM codes
 */
async function generateBOMCode(): Promise<string> {
  const count = await db.table('mfg_bom').count();
  return `BOM-${String(count + 1).padStart(3, "0")}`;
}

/**
 * Create a new BOM with sync
 */
export const createBOM = async (data: Partial<BOM>): Promise<BOM> => {
  const now = new Date().toISOString();
  const bomId = generateUUIDv7();
  const items: BOMItem[] = (data.items || []).map(item => ({
    ...item,
    id: generateUUIDv7(),
    bomId: bomId
  }));

  const totalMaterialCost = items.reduce((sum, i) => sum + i.totalCost, 0);
  const overheadCost = data.overheadCost || 0;
  const laborCost = data.laborCost || 0;

  const newBOM: BOM = {
    id: bomId,
    code: await generateBOMCode(),
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

  // Atomic Transaction
  await db.transaction('rw', [db.table('mfg_bom'), db.table('mfg_bom_item')], async () => {
    const { items: bomItems, ...bomData } = newBOM;
    await db.table('mfg_bom').add(bomData);
    await db.table('mfg_bom_item').bulkAdd(bomItems);
  });

  // Trigger Sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('mfg_bom', newBOM.id, newBOM);

  return newBOM;
};

/**
 * Update BOM with sync
 */
export const updateBOM = async (id: string, data: Partial<BOM>): Promise<BOM | null> => {
  const existing = await getBOMById(id);
  if (!existing) return null;

  const items = data.items || existing.items;
  const totalMaterialCost = items.reduce((sum, i) => sum + i.totalCost, 0);
  const overheadCost = data.overheadCost ?? existing.overheadCost;
  const laborCost = data.laborCost ?? existing.laborCost;

  const updatedBOM = {
    ...existing,
    ...data,
    items,
    totalMaterialCost,
    totalCost: totalMaterialCost + overheadCost + laborCost,
    updatedAt: new Date().toISOString(),
  };

  await db.transaction('rw', [db.table('mfg_bom'), db.table('mfg_bom_item')], async () => {
    const { items: bomItems, ...bomData } = updatedBOM;
    await db.table('mfg_bom').put(bomData);
    await db.table('mfg_bom_item').where('bomId').equals(id).delete();
    await db.table('mfg_bom_item').bulkAdd(bomItems);
  });

  // Trigger Sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('mfg_bom', id, updatedBOM);

  return updatedBOM;
};

/**
 * Delete BOM
 */
export const deleteBOM = async (id: string): Promise<boolean> => {
  const existing = await db.table('mfg_bom').get(id);
  if (!existing) return false;

  await db.transaction('rw', [db.table('mfg_bom'), db.table('mfg_bom_item')], async () => {
    await db.table('mfg_bom').delete(id);
    await db.table('mfg_bom_item').where('bomId').equals(id).delete();
  });

  // Trigger Sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('mfg_bom', id, null);

  return true;
};
