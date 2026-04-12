
import { UnitKerja } from "@/types/unitKerja";
import { db } from "@/db/db";
import { getAllUnitKerja, saveUnitKerjaList, generateUnitKerjaId } from "./unitKerjaData";
import { resetToInitialUnitKerjaData } from "./unitKerjaInitializer";
import { logAuditEntry } from "../auditService";

/**
 * Helper function to get unique unit kerja from anggota data in IndexedDB
 */
async function getUnitKerjaFromAnggotaData(): Promise<UnitKerja[]> {
  // Get anggota data from IndexedDB
  const anggotaData = await db.anggota.toArray();
  
  // Extract unique unit kerja names from anggota data
  const uniqueUnitKerja = new Set<string>();
  anggotaData.forEach((anggota) => {
    if (anggota.unitKerja && anggota.unitKerja.trim()) {
      uniqueUnitKerja.add(anggota.unitKerja.trim());
    }
  });

  // Convert to UnitKerja objects with generated IDs
  const unitKerjaList: UnitKerja[] = [];
  
  uniqueUnitKerja.forEach((nama) => {
    unitKerjaList.push({
      id: generateUnitKerjaId(),
      nama,
      keterangan: `Unit kerja ${nama}`,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });

  return unitKerjaList;
}

/**
 * Initialize unit kerja data from anggota if empty
 */
export async function initializeUnitKerjaFromAnggota(): Promise<UnitKerja[]> {
  const existingData = await getAllUnitKerja();
  
  if (existingData.length === 0) {
    const unitKerjaFromAnggota = await getUnitKerjaFromAnggotaData();
    if (unitKerjaFromAnggota.length > 0) {
      console.log("Initializing unit kerja from anggota data...");
      await saveUnitKerjaList(unitKerjaFromAnggota);
      return unitKerjaFromAnggota;
    }
  }
  
  return existingData;
}

/**
 * Reset unit kerja data to initial mock data
 */
export async function resetUnitKerjaFromAnggota(): Promise<UnitKerja[]> {
  return await resetToInitialUnitKerjaData();
}

/**
 * Sync unit kerja with current anggota data
 */
export async function syncUnitKerjaWithAnggota(): Promise<number> {
  const currentUnitKerja = await getAllUnitKerja();
  const unitKerjaFromAnggota = await getUnitKerjaFromAnggotaData();
  
  let addedCount = 0;
  const existingNames = new Set(currentUnitKerja.map(uk => uk.nama));
  
  for (const newUnitKerja of unitKerjaFromAnggota) {
    if (!existingNames.has(newUnitKerja.nama)) {
      currentUnitKerja.push({
        ...newUnitKerja,
        id: generateUnitKerjaId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      addedCount++;
    }
  }
  
  if (addedCount > 0) {
    await saveUnitKerjaList(currentUnitKerja);
    
    logAuditEntry(
      "UPDATE",
      "SYSTEM",
      `Sinkronisasi unit kerja dengan data anggota: ${addedCount} unit kerja baru ditambahkan`
    );
  }
  
  return addedCount;
}
