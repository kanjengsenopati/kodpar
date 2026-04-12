import { Pemasok } from "@/types";
import { db } from "@/db/db";
import { generateUUIDv7 } from "@/utils/idUtils";

/**
 * Get all suppliers from local mirror
 */
export const getAllPemasok = async (): Promise<Pemasok[]> => {
  return await db.table('mst_pemasok').toArray();
};

/**
 * Get supplier by ID
 */
export const getPemasokById = async (id: string): Promise<Pemasok | undefined> => {
  return await db.table('mst_pemasok').get(id);
};

/**
 * Create a new supplier with sync
 */
export const createPemasok = async (pemasokData: Omit<Pemasok, "id" | "createdAt">): Promise<Pemasok> => {
  const newPemasok: Pemasok = {
    ...pemasokData,
    id: generateUUIDv7(),
    createdAt: new Date().toISOString(),
  };
  
  await db.table('mst_pemasok').add(newPemasok);
  
  // Trigger Sync
  const { centralizedSync } = await import("./sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('mst_pemasok', newPemasok.id, newPemasok);
  
  return newPemasok;
};

/**
 * Update existing supplier with sync
 */
export const updatePemasok = async (id: string, pemasokData: Partial<Pemasok>): Promise<Pemasok | null> => {
  const existing = await getPemasokById(id);
  if (!existing) return null;
  
  const updatedPemasok: Pemasok = {
    ...existing,
    ...pemasokData
  };
  
  await db.table('mst_pemasok').put(updatedPemasok);
  
  // Trigger Sync
  const { centralizedSync } = await import("./sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('mst_pemasok', id, updatedPemasok);
  
  return updatedPemasok;
};

/**
 * Delete supplier with sync
 */
export const deletePemasok = async (id: string): Promise<boolean> => {
  const existing = await getPemasokById(id);
  if (!existing) return false;
  
  await db.table('mst_pemasok').delete(id);
  
  // Trigger Sync (Deletion)
  const { centralizedSync } = await import("./sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('mst_pemasok', id, null);
  
  return true;
};

