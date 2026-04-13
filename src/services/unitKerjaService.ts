
import { UnitKerja } from "@/types/unitKerja";
import { logAuditEntry } from "./auditService";
import { 
  getAllUnitKerja, 
  saveUnitKerjaList, 
  getUnitKerjaById, 
  generateUnitKerjaId 
} from "./unitKerja/unitKerjaData";
import { 
  validateForCreate, 
  validateForUpdate, 
  validateForDelete 
} from "./unitKerja/unitKerjaValidation";
import { 
  initializeUnitKerjaFromAnggota, 
  resetUnitKerjaFromAnggota, 
  syncUnitKerjaWithAnggota 
} from "./unitKerja/unitKerjaSync";

// Re-export data functions for backward compatibility
export { getAllUnitKerja, getUnitKerjaById, generateUnitKerjaId };

/**
 * Get all unit kerja with initialization from anggota data if needed
 */
export async function getAllUnitKerjaWithInit(): Promise<UnitKerja[]> {
  return await initializeUnitKerjaFromAnggota();
}

/**
 * Create a new unit kerja
 */
export async function createUnitKerja(nama: string, keterangan?: string): Promise<UnitKerja> {
  try {
    // Validate input
    await validateForCreate(nama, keterangan);
    
    const unitKerjaList = await getAllUnitKerja();
    
    const newUnitKerja: UnitKerja = {
      id: generateUnitKerjaId(),
      nama: nama.trim(),
      keterangan: keterangan?.trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    unitKerjaList.push(newUnitKerja);
    await saveUnitKerjaList(unitKerjaList);
    
    // Log audit entry
    logAuditEntry(
      "CREATE",
      "UNIT_KERJA",
      `Membuat unit kerja baru: ${newUnitKerja.nama} (${newUnitKerja.id})`,
      newUnitKerja.id
    );
    
    return newUnitKerja;
  } catch (error) {
    console.error("Error creating unit kerja:", error);
    throw error;
  }
}

/**
 * Update an existing unit kerja
 */
export async function updateUnitKerja(id: string, nama: string, keterangan?: string): Promise<UnitKerja | null> {
  try {
    const unitKerjaList = await getAllUnitKerja();
    const index = unitKerjaList.findIndex(uk => uk.id === id);
    
    if (index === -1) {
      throw new Error("Unit kerja tidak ditemukan");
    }
    
    // Validate input
    await validateForUpdate(id, nama, keterangan);
    
    const oldUnitKerja = unitKerjaList[index];
    unitKerjaList[index] = {
      ...unitKerjaList[index],
      nama: nama.trim(),
      keterangan: keterangan?.trim(),
      updatedAt: new Date().toISOString(),
    };
    
    await saveUnitKerjaList(unitKerjaList);
    
    // Log audit entry
    logAuditEntry(
      "UPDATE",
      "UNIT_KERJA",
      `Memperbarui unit kerja: ${oldUnitKerja.nama} → ${nama} (${id})`,
      id
    );
    
    return unitKerjaList[index];
  } catch (error) {
    console.error("Error updating unit kerja:", error);
    throw error;
  }
}

/**
 * Delete a unit kerja by ID
 */
export async function deleteUnitKerja(id: string): Promise<boolean> {
  try {
    const unitKerjaList = await getAllUnitKerja();
    const unitKerjaToDelete = unitKerjaList.find(uk => uk.id === id);
    
    if (!unitKerjaToDelete) {
      throw new Error("Unit kerja tidak ditemukan");
    }
    
    // Validate deletion
    await validateForDelete(unitKerjaToDelete);
    
    const filteredList = unitKerjaList.filter(unitKerja => unitKerja.id !== id);
    await saveUnitKerjaList(filteredList);
    
    // Log audit entry
    logAuditEntry(
      "DELETE",
      "UNIT_KERJA",
      `Menghapus unit kerja: ${unitKerjaToDelete.nama} (${id})`,
      id
    );
    
    return true;
  } catch (error) {
    console.error("Error deleting unit kerja:", error);
    throw error;
  }
}

// Re-export sync functions for backward compatibility
export { syncUnitKerjaWithAnggota };

/**
 * Reset unit kerja data to initial state - add alias for UI compatibility
 */
export async function resetUnitKerja(): Promise<UnitKerja[]> {
  return await resetUnitKerjaFromAnggota();
}

/**
 * Reset unit kerja data to data from anggota - keep original function name
 */
export async function resetUnitKerjaData(): Promise<UnitKerja[]> {
  return await resetUnitKerjaFromAnggota();
}
