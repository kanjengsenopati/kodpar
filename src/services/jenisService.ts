import { db } from "../db/db";
import { Jenis } from "@/types/jenis";

// Synchronous cache for high-performance UI lookups (tables, selects)
let jenisCache: Jenis[] = [];

/**
 * Get all jenis from local mirror (IndexedDB)
 */
export async function getAllJenis(): Promise<Jenis[]> {
  try {
    const data = await db.table('mst_jenis').toArray();
    jenisCache = data; // Update cache
    return data;
  } catch (error) {
    console.error("Error getting jenis:", error);
    return [];
  }
}

/**
 * Get results from cache if available, otherwise fetch from DB
 */
export async function getJenisOptions(jenisTransaksi: string): Promise<Jenis[]> {
  // If cache is empty, we must wait for at least one fetch
  if (jenisCache.length === 0) {
    await getAllJenis();
  }
  
  return jenisCache.filter(j => j.jenisTransaksi === jenisTransaksi);
}

/**
 * Legacy support for synchronous callers. 
 * Note: May return empty array if database hasn't been queried yet.
 */
export function getJenisOptionsSync(jenisTransaksi: string): Jenis[] {
  return jenisCache.filter(j => j.jenisTransaksi === jenisTransaksi);
}

/**
 * Get jenis by ID
 */
export async function getJenisById(id: string): Promise<Jenis | undefined> {
  // First try cache
  const cached = jenisCache.find(j => j.id === id);
  if (cached) return cached;
  
  // Fallback to DB
  return await db.table('mst_jenis').get(id);
}

/**
 * Synchronous version for use in rendering loops
 */
export function getJenisByIdSync(id: string): Jenis | undefined {
  return jenisCache.find(j => j.id === id);
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
  
  // Update cache
  jenisCache.push(newJenis);
  
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
  jenisCache = [];
  await neonMasterSync.rehydrateFromCloud();
  await getAllJenis(); // Refill cache
}
