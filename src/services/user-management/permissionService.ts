import { Permission } from "@/types";
import { db } from "@/db/db";

/**
 * Get all permissions from local mirror (IndexedDB)
 */
export const getPermissions = async (): Promise<Permission[]> => {
  return await db.table('permissions').toArray();
};

/**
 * Get permissions filtered by module
 */
export const getPermissionsByModule = async (module: string): Promise<Permission[]> => {
  return await db.table('permissions').where('module').equals(module).toArray();
};

/**
 * Initialize permissions (Rehydration Trigger)
 */
export const initPermissions = async (): Promise<void> => {
  const permissions = await getPermissions();
  if (permissions.length === 0) {
    const { neonMasterSync } = await import("../sync/neonMasterSyncService");
    await neonMasterSync.rehydrateFromCloud();
  }
};
