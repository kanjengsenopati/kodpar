import { Penjualan, PenjualanItem } from "@/types";
import { db } from "@/db/db";
import { generateUUIDv7 } from "@/utils/idUtils";
import { logAuditEntry } from "@/services/auditService";

/**
 * Get all sales transactions from local mirror
 */
export const getAllPenjualan = async (): Promise<Penjualan[]> => {
  const sales = await db.table('pos_penjualan').toArray();
  const items = await db.table('pos_penjualan_item').toArray();

  return sales.map(s => ({
    ...s,
    items: items.filter(item => item.penjualanId === s.id)
  }));
};

/**
 * Create a new sale with sync
 */
export const createPenjualan = async (penjualanData: Omit<Penjualan, "id" | "nomorTransaksi" | "createdAt">): Promise<Penjualan> => {
  const id = generateUUIDv7();
  
  // Generate transaction number
  const count = await db.table('pos_penjualan').count();
  const nomorTransaksi = `SLS-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(count + 1).padStart(4, '0')}`;

  const newPenjualan: Penjualan = {
    id,
    nomorTransaksi,
    ...penjualanData,
    createdAt: new Date().toISOString()
  };

  const saleItems = (penjualanData.items || []).map(item => ({
    id: generateUUIDv7(),
    penjualanId: id,
    ...item
  }));

  // Atomic Transaction
  await db.transaction('rw', [db.table('pos_penjualan'), db.table('pos_penjualan_item'), db.table('mst_produk')], async () => {
    // 1. Add Sales Records
    await db.table('pos_penjualan').add({ ...newPenjualan, items: undefined });
    await db.table('pos_penjualan_item').bulkAdd(saleItems);

    // 2. Adjust Stock
    if (newPenjualan.status === "sukses") {
      for (const item of saleItems) {
        const prod = await db.table('mst_produk').get(item.produkId);
        if (prod) {
          await db.table('mst_produk').update(item.produkId, { stok: prod.stok - item.jumlah });
        }
      }
    }
  });

  // Log audit entry
  logAuditEntry(
    "CREATE",
    "PENJUALAN",
    `Transaksi penjualan baru: ${newPenjualan.nomorTransaksi} (Total: ${newPenjualan.total})`,
    newPenjualan.id
  );

  // Trigger Sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('pos_penjualan', newPenjualan.id, newPenjualan);

  return { ...newPenjualan, items: saleItems };
};

/**
 * Get sales transaction by ID
 */
export const getPenjualanById = async (id: string): Promise<Penjualan | null> => {
  const sale = await db.table('pos_penjualan').get(id);
  if (!sale) return null;

  const items = await db.table('pos_penjualan_item').where('penjualanId').equals(id).toArray();
  return { ...sale, items };
};

/**
 * Calculate total
 */
export const calculateTotal = (items: PenjualanItem[]): number => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

/**
 * Delete sale
 */
export const deletePenjualan = async (id: string): Promise<boolean> => {
  const existing = await getPenjualanById(id);
  if (!existing) return false;

  await db.transaction('rw', [db.table('pos_penjualan'), db.table('pos_penjualan_item'), db.table('mst_produk')], async () => {
    if (existing.status === "sukses") {
      for (const item of existing.items) {
        const prod = await db.table('mst_produk').get(item.produkId);
        if (prod) {
          await db.table('mst_produk').update(item.produkId, { stok: prod.stok + item.jumlah });
        }
      }
    }
    await db.table('pos_penjualan').delete(id);
    await db.table('pos_penjualan_item').where('penjualanId').equals(id).delete();
  });

  // Log audit
  logAuditEntry("DELETE", "PENJUALAN", `Menghapus transaksi ${existing.nomorTransaksi}`, id);

  // Sync deletion
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('pos_penjualan', id, null);

  return true;
};

/**
 * Update sale transaction status
 */
export const updatePenjualan = async (id: string, updates: Partial<Penjualan>): Promise<Penjualan | null> => {
  const existing = await getPenjualanById(id);
  if (!existing) return null;

  const updatedPenjualan = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  await db.transaction('rw', [db.table('pos_penjualan'), db.table('pos_penjualan_item'), db.table('mst_produk')], async () => {
    // Handle stock reversal if status changes from sukses to cancelled
    if (existing.status === "sukses" && updates.status === "batal") {
       for (const item of existing.items) {
        const prod = await db.table('mst_produk').get(item.produkId);
        if (prod) {
          await db.table('mst_produk').update(item.produkId, { stok: prod.stok + item.jumlah });
        }
      }
    }

    // Handle stock deduction if status changes from pending/cancelled to sukses
    if (existing.status !== "sukses" && updates.status === "sukses") {
       for (const item of existing.items) {
        const prod = await db.table('mst_produk').get(item.produkId);
        if (prod) {
          await db.table('mst_produk').update(item.produkId, { stok: prod.stok - item.jumlah });
        }
      }
    }

    await db.table('pos_penjualan').update(id, updates);
  });

  // Log audit
  logAuditEntry("UPDATE", "PENJUALAN", `Memperbarui transaksi ${existing.nomorTransaksi}`, id);

  // Trigger Sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('pos_penjualan', id, updatedPenjualan);

  return updatedPenjualan;
};
