
import { UnitKerja } from "@/types/unitKerja";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { initializeUnitKerjaData } from "./unitKerjaInitializer";

const UNIT_KERJA_KEY = "koperasi_unit_kerja";

/**
 * Get all unit kerja from local storage with automatic initialization
 */
export function getAllUnitKerja(): UnitKerja[] {
  try {
    // Always ensure initialization on first access
    return initializeUnitKerjaData();
  } catch (error) {
    console.error("Error getting unit kerja:", error);
    return [];
  }
}

/**
 * Save unit kerja list to local storage
 */
export function saveUnitKerjaList(unitKerjaList: UnitKerja[]): void {
  try {
    saveToLocalStorage(UNIT_KERJA_KEY, unitKerjaList);
    
    // Notify that unit kerja has been updated
    localStorage.setItem('unit_kerja_updated', new Date().toISOString());
    window.dispatchEvent(new CustomEvent('unitKerjaUpdated'));
  } catch (error) {
    console.error("Error saving unit kerja list:", error);
    throw error;
  }
}

/**
 * Get unit kerja by ID
 */
export function getUnitKerjaById(id: string): UnitKerja | undefined {
  try {
    const unitKerjaList = getAllUnitKerja();
    return unitKerjaList.find(unitKerja => unitKerja.id === id);
  } catch (error) {
    console.error("Error getting unit kerja by ID:", error);
    return undefined;
  }
}

/**
 * Generate a new unit kerja ID
 */
export function generateUnitKerjaId(): string {
  try {
    const unitKerjaList = getAllUnitKerja();
    const existingIds = unitKerjaList.map(uk => parseInt(uk.id.replace("UK", ""))).filter(id => !isNaN(id));
    const lastId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    const newId = `UK${String(lastId + 1).padStart(3, "0")}`;
    return newId;
  } catch (error) {
    console.error("Error generating unit kerja ID:", error);
    return `UK${String(Date.now()).slice(-3)}`;
  }
}

/**
 * Reset unit kerja data to empty state
 */
export function clearUnitKerjaData(): void {
  try {
    saveToLocalStorage(UNIT_KERJA_KEY, []);
    localStorage.setItem('unit_kerja_updated', new Date().toISOString());
  } catch (error) {
    console.error("Error clearing unit kerja data:", error);
    throw error;
  }
}
