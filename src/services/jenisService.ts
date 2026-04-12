import { db } from "../db/db";
import { Jenis } from "@/types/jenis";

/**
 * Get all jenis from local mirror (IndexedDB)
 */
export async function getAllJenis(): Promise<Jenis[]> {
  try {
    return await db.table('mst_jenis').toArray();
  } catch (error) {
    console.error("Error getting jenis:", error);
    return [];
  }
}

/**
 * Get jenis by ID
 */
export async function getJenisById(id: string): Promise<Jenis | undefined> {
  return await db.table('mst_jenis').get(id);
}

/**
 * Get all jenis by type (e.g., 'Simpanan', 'Pinjaman', 'Pengajuan')
 */
export async function getJenisByType(jenisTransaksi: string): Promise<Jenis[]> {
  return await db.table('mst_jenis')
    .where('jenisTransaksi').equals(jenisTransaksi)
    .toArray();
}

/**
 * Get active jenis by type
 */
export async function getActiveJenisByType(jenisTransaksi: "Pengajuan" | "Simpanan" | "Pinjaman"): Promise<Jenis[]> {
  const result = await getJenisByType(jenisTransaksi);
  return result.filter(j => j.isActive);
}

/**
 * Create a new jenis with sync
 */
export async function createJenis(jenis: Omit<Jenis, "id" | "createdAt" | "updatedAt">): Promise<Jenis> {
  const { generateUUIDv7 } = await import("@/utils/idUtils");
  const now = new Date().toISOString();
  
  const newJenis: Jenis = {
    ...jenis,
    id: generateUUIDv7(),
    createdAt: now,
    updatedAt: now
  } as Jenis;
  
  await db.table('mst_jenis').add(newJenis);
  
  // Trigger Sync
  const { centralizedSync } = await import("./sync/centralizedSyncService");
  centralizedSync.syncEntity('mst_jenis', newJenis.id, newJenis);
  
  return newJenis;
}

/**
 * Sync rehydration trigger
 */
export async function resetJenisData(): Promise<void> {
  const { neonMasterSync } = await import("./sync/neonMasterSyncService");
  await db.table('mst_jenis').clear();
  await neonMasterSync.rehydrateFromCloud();
}
