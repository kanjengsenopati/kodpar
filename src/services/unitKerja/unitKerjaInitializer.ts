
import { UnitKerja } from "@/types/unitKerja";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";
import { initialUnitKerjaData } from "./unitKerjaInitialData";
import { logAuditEntry } from "../auditService";

const UNIT_KERJA_KEY = "koperasi_unit_kerja";

/**
 * Initialize unit kerja with mock data if not exists
 */
export function initializeUnitKerjaData(): UnitKerja[] {
  try {
    const existingData = getFromLocalStorage<UnitKerja[]>(UNIT_KERJA_KEY, []);
    
    // If no data exists, initialize with mock data
    if (existingData.length === 0) {
      console.log("Initializing unit kerja with mock data...");
      saveToLocalStorage(UNIT_KERJA_KEY, initialUnitKerjaData);
      
      // Log audit entry
      logAuditEntry(
        "CREATE",
        "SYSTEM",
        `Inisialisasi data unit kerja dengan ${initialUnitKerjaData.length} unit kerja mock`
      );
      
      // Notify that unit kerja has been initialized
      localStorage.setItem('unit_kerja_updated', new Date().toISOString());
      window.dispatchEvent(new CustomEvent('unitKerjaUpdated'));
      
      return initialUnitKerjaData;
    }
    
    // Check if we need to add missing mock data
    const existingNames = new Set(existingData.map(uk => uk.nama));
    const missingData = initialUnitKerjaData.filter(mockData => !existingNames.has(mockData.nama));
    
    if (missingData.length > 0) {
      console.log(`Adding ${missingData.length} missing unit kerja mock data...`);
      const updatedData = [...existingData, ...missingData];
      saveToLocalStorage(UNIT_KERJA_KEY, updatedData);
      
      // Log audit entry
      logAuditEntry(
        "CREATE",
        "SYSTEM",
        `Menambahkan ${missingData.length} unit kerja mock yang hilang`
      );
      
      // Notify that unit kerja has been updated
      localStorage.setItem('unit_kerja_updated', new Date().toISOString());
      window.dispatchEvent(new CustomEvent('unitKerjaUpdated'));
      
      return updatedData;
    }
    
    return existingData;
  } catch (error) {
    console.error("Error initializing unit kerja data:", error);
    return initialUnitKerjaData;
  }
}

/**
 * Reset unit kerja to initial mock data
 */
export function resetToInitialUnitKerjaData(): UnitKerja[] {
  try {
    console.log("Resetting unit kerja to initial mock data...");
    saveToLocalStorage(UNIT_KERJA_KEY, initialUnitKerjaData);
    
    // Log audit entry
    logAuditEntry(
      "DELETE",
      "SYSTEM",
      "Mereset data unit kerja ke data mock awal"
    );
    
    // Notify that unit kerja has been updated
    localStorage.setItem('unit_kerja_updated', new Date().toISOString());
    window.dispatchEvent(new CustomEvent('unitKerjaUpdated'));
    
    return initialUnitKerjaData;
  } catch (error) {
    console.error("Error resetting unit kerja data:", error);
    throw error;
  }
}
