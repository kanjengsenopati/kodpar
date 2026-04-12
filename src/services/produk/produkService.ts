import { ProdukItem } from "@/types";
import { db } from "@/db/db";
import { generateUUIDv7 } from "@/utils/idUtils";
import { logAuditEntry } from "@/services/auditService";

/**
 * Get all products from local mirror (IndexedDB)
 */
export const getAllProdukItems = async (): Promise<ProdukItem[]> => {
  return await db.table('mst_produk').toArray();
};

/**
 * Create a new product with sync
 */
export const createProdukItem = async (produkData: Omit<ProdukItem, "id" | "createdAt">): Promise<ProdukItem> => {
  const newProdukItem: ProdukItem = {
    id: generateUUIDv7(),
    ...produkData,
    createdAt: new Date().toISOString()
  };
  
  await db.table('mst_produk').add(newProdukItem);
  
  // Log audit entry
  logAuditEntry(
    "CREATE",
    "PRODUK",
    `Membuat produk baru: ${newProdukItem.nama} (${newProdukItem.kode})`,
    newProdukItem.id
  );

  // Trigger Sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('mst_produk', newProdukItem.id, newProdukItem);
  
  return newProdukItem;
};

/**
 * Get product by ID
 */
export const getProdukItemById = async (id: string): Promise<ProdukItem | null> => {
  const item = await db.table('mst_produk').get(id);
  return item || null;
};

/**
 * Update product with sync
 */
export const updateProdukItem = async (id: string, produkData: Partial<ProdukItem>): Promise<ProdukItem | null> => {
  const existing = await getProdukItemById(id);
  if (!existing) return null;
  
  const updatedProduk = {
    ...existing,
    ...produkData
  };
  
  await db.table('mst_produk').put(updatedProduk);
  
  // Log audit entry
  logAuditEntry(
    "UPDATE",
    "PRODUK",
    `Memperbarui produk: ${existing.nama} -> ${updatedProduk.nama}`,
    id
  );

  // Trigger Sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('mst_produk', id, updatedProduk);
  
  return updatedProduk;
};

/**
 * Delete product with sync
 */
export const deleteProdukItem = async (id: string): Promise<boolean> => {
  const existing = await getProdukItemById(id);
  if (!existing) return false;
  
  await db.table('mst_produk').delete(id);
  
  // Log audit entry
  logAuditEntry(
    "DELETE",
    "PRODUK",
    `Menghapus produk: ${existing.nama} (${existing.kode})`,
    id
  );

  // Trigger Sync (Deletion)
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('mst_produk', id, null);
  
  return true;
};

/**
 * Update product stock
 */
export const updateProdukStock = async (id: string, quantity: number): Promise<boolean> => {
  const existing = await getProdukItemById(id);
  if (!existing) return false;
  
  const oldStok = existing.stok;
  const newStok = existing.stok + quantity;
  
  await db.table('mst_produk').update(id, { stok: newStok });
  
  // Log audit entry
  logAuditEntry(
    "UPDATE",
    "PRODUK",
    `Update stok produk ${existing.nama}: ${oldStok} -> ${newStok}`,
    id
  );

  // Trigger Sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('mst_produk', id, { ...existing, stok: newStok });
  
  return true;
};

