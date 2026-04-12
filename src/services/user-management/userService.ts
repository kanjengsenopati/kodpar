import { User } from "@/types/user";
import { db } from "@/db/db";
import { generateUUIDv7 } from "@/utils/idUtils";

/**
 * Get all users from local mirror (IndexedDB)
 */
export const getUsers = async (): Promise<User[]> => {
  return await db.table('users').toArray();
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User | undefined> => {
  return await db.table('users').get(id);
};

/**
 * Create a new user with sync (Registration driven by cloud)
 */
export const createUser = async (userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> => {
  const newUser: User = {
    id: generateUUIDv7(),
    ...userData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  await db.table('users').add(newUser);
  
  // Trigger Sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  centralizedSync.syncEntity('users', newUser.id, newUser);
  
  return newUser;
};

/**
 * Update user with sync
 */
export const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
  const existing = await getUserById(id);
  if (!existing) return null;
  
  const updatedUser = {
    ...existing,
    ...userData,
    updatedAt: new Date().toISOString()
  };
  
  await db.table('users').put(updatedUser);
  
  // Trigger Sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  centralizedSync.syncEntity('users', id, updatedUser);
  
  return updatedUser;
};

/**
 * Delete user with sync
 */
export const deleteUser = async (id: string): Promise<boolean> => {
  const existing = await getUserById(id);
  if (!existing) return false;
  
  await db.table('users').delete(id);
  
  // Trigger sync
  const { centralizedSync } = await import("../sync/centralizedSyncService");
  centralizedSync.syncEntity('users', id, null);
  
  return true;
};

/**
 * Default Users (Empty fallback to fix imports)
 */
export const defaultUsers: User[] = [];

/**
 * Initialize users (Rehydration Trigger)
 */
export const initUsers = async (): Promise<void> => {
  const users = await getUsers();
  if (users.length === 0) {
    const { neonMasterSync } = await import("../sync/neonMasterSyncService");
    await neonMasterSync.rehydrateFromCloud();
  }
};

