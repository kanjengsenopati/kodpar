import { UnitKerja } from "@/types/unitKerja";
import { db } from "@/db/db";

/**
 * Get all unit kerja from local mirror (IndexedDB)
 */
export async function getAllUnitKerja(): Promise<UnitKerja[]> {
  try {
    return await db.unit_kerja.toArray();
  } catch (error) {
    console.error("Error getting unit kerja:", error);
    return [];
  }
}

/**
 * Save unit kerja list to Local Mirror (Triggered by Sync)
 */
export async function saveUnitKerjaList(unitKerjaList: UnitKerja[]): Promise<void> {
  try {
    await db.unit_kerja.clear();
    await db.unit_kerja.bulkAdd(unitKerjaList);
  } catch (error) {
    console.error("Error saving unit kerja list:", error);
    throw error;
  }
}

/**
 * Get unit kerja by ID
 */
export async function getUnitKerjaById(id: string): Promise<UnitKerja | undefined> {
  try {
    return await db.unit_kerja.get(id);
  } catch (error) {
    console.error("Error getting unit kerja by ID:", error);
    return undefined;
  }
}

/**
 * Reset unit kerja data (Trigger Cloud Rehydration)
 */
export async function clearUnitKerjaData(): Promise<void> {
  try {
    const { neonMasterSync } = await import("../sync/neonMasterSyncService");
    await db.unit_kerja.clear();
    await neonMasterSync.rehydrateFromCloud();
  } catch (error) {
    console.error("Error clearing unit kerja data:", error);
    throw error;
  }
}

