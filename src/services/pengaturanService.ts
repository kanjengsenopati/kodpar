import { db } from "../db/db";

/**
 * Get pengaturan from Local Mirror (IndexedDB)
 */
export async function getPengaturan(): Promise<Pengaturan> {
  const settings = await db.table('settings').get('global_config');
  // If not found in DB, settings will rehydrate on next sync
  return settings as Pengaturan;
}

/**
 * Save pengaturan to Local Mirror and Sync Queue
 */
export async function savePengaturan(pengaturan: Pengaturan): Promise<void> {
  await db.table('settings').put({ id: 'global_config', ...pengaturan });
  
  // Trigger sync to cloud
  const { centralizedSync } = await import("./sync/centralizedSyncService");
  // @ts-ignore
  centralizedSync.syncEntity('settings', 'global_config', pengaturan);
}

/**
 * Update specific pengaturan fields
 */
export async function updatePengaturan(updatedFields: Partial<Pengaturan>): Promise<Pengaturan> {
  const current = await getPengaturan();
  const updated = { ...current, ...updatedFields };
  await savePengaturan(updated);
  return updated;
}

/**
 * Reset pengaturan to default values (Trigger Cloud Rehydration)
 */
export async function resetPengaturan(): Promise<void> {
  const { neonMasterSync } = await import("./sync/neonMasterSyncService");
  await db.table('settings').clear();
  await neonMasterSync.rehydrateFromCloud();
}

/**
 * Get default officer name for receipts and documents
 */
export function getDefaultOfficerName(): string {
  return "Retno";
}
