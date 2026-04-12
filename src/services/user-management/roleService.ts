import { Role } from "@/types";
import { db } from "@/db/db";
import { generateUUIDv7 } from "@/utils/idUtils";

/**
 * Get all roles from local mirror (IndexedDB)
 */
export const getRoles = async (): Promise<Role[]> => {
  return await db.table('roles').toArray();
};

/**
 * Get role by ID
 */
export const getRoleById = async (id: string): Promise<Role | undefined> => {
  return await db.table('roles').get(id);
};

/**
 * Create a new role with sync
 */
export const createRole = async (roleData: Omit<Role, "id" | "createdAt" | "updatedAt">): Promise<Role> => {
  const newRole: Role = {
    id: generateUUIDv7(),
    ...roleData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  await db.table('roles').add(newRole);
  
  // Trigger sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  centralizedSync.syncEntity('roles', newRole.id, newRole);
  
  return newRole;
};

/**
 * Update role with sync
 */
export const updateRole = async (id: string, roleData: Partial<Role>): Promise<Role | null> => {
  const existing = await getRoleById(id);
  if (!existing) return null;
  
  const updatedRole = {
    ...existing,
    ...roleData,
    updatedAt: new Date().toISOString()
  };
  
  await db.table('roles').put(updatedRole);
  
  // Trigger sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  centralizedSync.syncEntity('roles', id, updatedRole);
  
  return updatedRole;
};

/**
 * Delete role with sync
 */
export const deleteRole = async (id: string): Promise<boolean> => {
  const existing = await getRoleById(id);
  if (!existing) return false;
  
  await db.table('roles').delete(id);
  
  // Trigger sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  centralizedSync.syncEntity('roles', id, null);
  
  return true;
};

/**
 * Initialize roles (Rehydration Trigger)
 */
export const initRoles = async (): Promise<void> => {
  const roles = await getRoles();
  if (roles.length === 0) {
    const { neonMasterSync } = await import("../sync/neonMasterSyncService");
    await neonMasterSync.rehydrateFromCloud();
  }
};

