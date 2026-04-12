import { Anggota, AnggotaKeluarga } from "@/types/anggota";
import { db } from "@/db/db";
import { getAllUnitKerja, syncUnitKerjaWithAnggota } from "./unitKerjaService";
import { logAuditEntry } from "./auditService";
import { getCurrentUser } from "./auth/sessionManagement";
import * as IdUtils from "../utils/idUtils";

import { neonMasterSync } from "./sync/neonMasterSyncService";

/**
 * Reset anggota data to initial state - TRIGGER CLOUD REHYDRATION
 */
export async function resetAnggotaData(): Promise<void> {
  await db.anggota.clear();
  await neonMasterSync.rehydrateFromCloud();
  
  // After resetting anggota data, sync unit kerja
  syncUnitKerjaWithAnggota();
}


/**
 * Get all anggota from IndexedDB
 */
export async function getAllAnggota(): Promise<Anggota[]> {
  const user = getCurrentUser();
  const isAnggota = user?.roleId === "role_anggota" || user?.roleId === "anggota";
  
  const count = await db.anggota.count();
  if (count === 0) {
    await db.anggota.bulkAdd(initialAnggota);
    return isAnggota && user?.anggotaId 
      ? initialAnggota.filter(a => a.id === user.anggotaId)
      : initialAnggota;
  }
  
  if (isAnggota && user?.anggotaId) {
    return await db.anggota.where('id').equals(user.anggotaId).toArray();
  }
  
  return await db.anggota.toArray();
}

// Alias function for getAllAnggota to fix the import issue
export async function getAnggotaList(): Promise<Anggota[]> {
  return await getAllAnggota();
}

/**
 * Get anggota by ID
 */
export async function getAnggotaById(id: string): Promise<Anggota | undefined> {
  const user = getCurrentUser();
  const isAnggota = user?.roleId === "role_anggota" || user?.roleId === "anggota";
  
  if (isAnggota && user?.anggotaId && user.anggotaId !== id) {
    console.warn(`An anggota (${user.anggotaId}) tried to access another anggota's data (${id})`);
    return undefined;
  }
  
  return await db.anggota.get(id);
}

export async function generateAnggotaNumber(): Promise<string> {
  // Optimization: Get only the last record by index to determine sequence
  const lastAnggota = await db.anggota.orderBy('noAnggota').last();
  
  let lastSeq = 0;
  if (lastAnggota) {
    lastSeq = IdUtils.extractNumericSuffix(lastAnggota.noAnggota || lastAnggota.id);
  }
  
  return IdUtils.formatReferenceNumber({
    prefix: "AG",
    year: new Date().getFullYear(),
    sequence: lastSeq + 1
  });
}

/**
 * Create a new anggota
 */
export async function createAnggota(anggota: Omit<Anggota, 'id' | 'noAnggota' | 'createdAt' | 'updatedAt'>): Promise<Anggota> {
  const id = IdUtils.generateUUIDv7();
  const noAnggota = await generateAnggotaNumber();
  
  const newAnggota: Anggota = {
    ...anggota,
    id,
    noAnggota,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  await db.anggota.add(newAnggota);
  
  // Sync unit kerja after creating anggota
  syncUnitKerjaWithAnggota();
  
  // Log audit entry
  logAuditEntry(
    "CREATE",
    "ANGGOTA",
    `Membuat data anggota baru: ${newAnggota.nama} (${newAnggota.id})`,
    newAnggota.id
  );
  
  return newAnggota;
}

/**
 * Update an existing anggota
 */
export async function updateAnggota(id: string, anggota: Partial<Anggota>): Promise<Anggota | null> {
  const existing = await db.anggota.get(id);
  
  if (!existing) {
    return null;
  }
  
  const updatedAnggota: Anggota = {
    ...existing,
    ...anggota,
    updatedAt: new Date().toISOString(),
  };
  
  await db.anggota.put(updatedAnggota);
  
  // Sync unit kerja after updating anggota (in case unit kerja changed)
  syncUnitKerjaWithAnggota();
  
  // Log audit entry
  logAuditEntry(
    "UPDATE",
    "ANGGOTA",
    `Memperbarui data anggota: ${existing.nama} (${id})`,
    id
  );
  
  return updatedAnggota;
}

/**
 * Delete an anggota by ID
 */
export async function deleteAnggota(id: string): Promise<boolean> {
  const existing = await db.anggota.get(id);
  
  if (!existing) {
    return false;
  }
  
  await db.anggota.delete(id);
  
  // Log audit entry
  logAuditEntry(
    "DELETE",
    "ANGGOTA",
    `Menghapus data anggota: ${existing.nama} (${id})`,
    id
  );
  
  return true;
}

/**
 * Validate anggota data against current unit kerja and update if needed
 */
export async function validateAnggotaUnitKerja(): Promise<number> {
  const anggotaList = await getAllAnggota();
  const unitKerjaList = getAllUnitKerja().map(uk => uk.nama);
  
  const defaultUnitKerja = unitKerjaList.length > 0 ? unitKerjaList[0] : "";
  
  let updatedCount = 0;
  
  for (const anggota of anggotaList) {
    if (!unitKerjaList.includes(anggota.unitKerja) && defaultUnitKerja) {
      updatedCount++;
      await db.anggota.update(anggota.id, {
        unitKerja: defaultUnitKerja,
        updatedAt: new Date().toISOString()
      });
    }
  }
  
  if (updatedCount > 0) {
    localStorage.setItem('anggota_updated', new Date().toISOString());
  }
  
  return updatedCount;
}
