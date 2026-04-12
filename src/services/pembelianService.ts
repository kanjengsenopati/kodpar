import { Pembelian, PembelianItem } from "@/types";
import { db } from "@/db/db";
import { generateUUIDv7 } from "@/utils/idUtils";

/**
 * Get all purchases from local mirror
 */
export const getAllPembelian = async (): Promise<Pembelian[]> => {
  const purchases = await db.table('pos_pembelian').toArray();
  const items = await db.table('pos_pembelian_item').toArray();

  return purchases.map(p => ({
    ...p,
    items: items.filter(item => item.pembelianId === p.id)
  }));
};

/**
 * Get purchase by ID
 */
export const getPembelianById = async (id: string): Promise<Pembelian | undefined> => {
  const purchase = await db.table('pos_pembelian').get(id);
  if (!purchase) return undefined;

  const items = await db.table('pos_pembelian_item').where('pembelianId').equals(id).toArray();
  return { ...purchase, items };
};

/**
 * Helper to generate purchase number
 */
async function generatePembelianNumber(): Promise<string> {
  const count = await db.table('pos_pembelian').count();
  const now = new Date();
  const year = now.getFullYear().toString().slice(2);
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  return `PB${year}${month}-${String(count + 1).padStart(3, "0")}`;
}

/**
 * Create a new purchase with sync
 */
export const createPembelian = async (pembelianData: Omit<Pembelian, "id" | "nomorTransaksi" | "createdAt">): Promise<Pembelian> => {
  const purchaseId = generateUUIDv7();
  const newPembelian: Pembelian = {
    ...pembelianData,
    id: purchaseId,
    nomorTransaksi: await generatePembelianNumber(),
    createdAt: new Date().toISOString(),
  };

  const purchaseItems = (pembelianData.items || []).map(item => ({
    id: generateUUIDv7(),
    pembelianId: purchaseId,
    ...item
  }));

  // Atomic Transaction
  await db.transaction('rw', [db.table('pos_pembelian'), db.table('pos_pembelian_item'), db.table('mst_produk')], async () => {
    // 1. Add Purchase Records
    await db.table('pos_pembelian').add({ ...newPembelian, items: undefined });
    await db.table('pos_pembelian_item').bulkAdd(purchaseItems);

    // 2. Adjust Stock if finished
    if (newPembelian.status === "selesai") {
      for (const item of purchaseItems) {
        const prod = await db.table('mst_produk').get(item.produkId);
        if (prod) {
          await db.table('mst_produk').update(item.produkId, { stok: prod.stok + item.jumlah });
        }
      }
    }
  });

  // Trigger Sync
  const { centralizedSync } = await import("./sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('pos_pembelian', newPembelian.id, newPembelian);
  
  return { ...newPembelian, items: purchaseItems };
};

/**
 * Update existing purchase with sync
 */
export const updatePembelian = async (id: string, pembelianData: Partial<Pembelian>): Promise<Pembelian | null> => {
  const existing = await getPembelianById(id);
  if (!existing) return null;

  const updatedPembelian = {
    ...existing,
    ...pembelianData,
    updatedAt: new Date().toISOString(),
  };

  await db.transaction('rw', [db.table('pos_pembelian'), db.table('pos_pembelian_item'), db.table('mst_produk')], async () => {
    // Logic for stock update if status changes to finished
    if (existing.status !== "selesai" && updatedPembelian.status === "selesai") {
      for (const item of existing.items) {
        const prod = await db.table('mst_produk').get(item.produkId);
        if (prod) {
          await db.table('mst_produk').update(item.produkId, { stok: prod.stok + item.jumlah });
        }
      }
    }

    const { items, ...header } = updatedPembelian;
    await db.table('pos_pembelian').put(header);
  });

  // Trigger Sync
  const { centralizedSync } = await import("./sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('pos_pembelian', id, updatedPembelian);
  
  return updatedPembelian;
};

/**
 * Delete purchase
 */
export const deletePembelian = async (id: string): Promise<boolean> => {
  const existing = await db.table('pos_pembelian').get(id);
  if (!existing) return false;

  await db.transaction('rw', [db.table('pos_pembelian'), db.table('pos_pembelian_item')], async () => {
    await db.table('pos_pembelian').delete(id);
    await db.table('pos_pembelian_item').where('pembelianId').equals(id).delete();
  });

  // Sync deletion
  const { centralizedSync } = await import("./sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('pos_pembelian', id, null);

  return true;
};

