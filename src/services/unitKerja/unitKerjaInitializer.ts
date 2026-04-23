
import { UnitKerja } from "@/types/unitKerja";
import { initialUnitKerjaData } from "./unitKerjaInitialData";
import { db } from "@/db/db";
import { logAuditEntry } from "../auditService";
import { getAllUnitKerja, saveUnitKerjaList } from "./unitKerjaData";

/**
 * Initialize unit kerja with mock data if not exists
 */
export async function initializeUnitKerjaData(): Promise<UnitKerja[]> {
  try {
    const existingData = await getAllUnitKerja();
    
    // If no data exists, initialize with mock data
    if (existingData.length === 0) {
      console.log("Initializing unit kerja with mock data...");
      await saveUnitKerjaList(initialUnitKerjaData);
      
      // Log audit entry
      logAuditEntry(
        "CREATE",
        "SYSTEM",
        `Inisialisasi data unit kerja dengan ${initialUnitKerjaData.length} unit kerja mock`
      );
      
      // Notify that unit kerja has been initialized
      if (typeof window !== 'undefined') {
        localStorage.setItem('unit_kerja_updated', new Date().toISOString());
        window.dispatchEvent(new CustomEvent('unitKerjaUpdated'));
      }
      
      return initialUnitKerjaData;
    }
    
    // Check if we need to add missing mock data
    const existingNames = new Set(existingData.map(uk => uk.nama));
    const missingData = initialUnitKerjaData.filter(mockData => !existingNames.has(mockData.nama));
    
    if (missingData.length > 0) {
      console.log(`Adding ${missingData.length} missing unit kerja mock data...`);
      const updatedData = [...existingData, ...missingData];
      await saveUnitKerjaList(updatedData);
      
      // Log audit entry
      logAuditEntry(
        "CREATE",
        "SYSTEM",
        `Menambahkan ${missingData.length} unit kerja mock yang hilang`
      );
      
      // Notify that unit kerja has been updated
      if (typeof window !== 'undefined') {
        localStorage.setItem('unit_kerja_updated', new Date().toISOString());
        window.dispatchEvent(new CustomEvent('unitKerjaUpdated'));
      }
      
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
export async function resetToInitialUnitKerjaData(): Promise<UnitKerja[]> {
  try {
    console.log("Resetting unit kerja to initial mock data...");
    await saveUnitKerjaList(initialUnitKerjaData);
    
    // Log audit entry
    logAuditEntry(
      "DELETE",
      "SYSTEM",
      "Mereset data unit kerja ke data mock awal"
    );
    
    // Notify that unit kerja has been updated
    if (typeof window !== 'undefined') {
      localStorage.setItem('unit_kerja_updated', new Date().toISOString());
      window.dispatchEvent(new CustomEvent('unitKerjaUpdated'));
    }
    
    return initialUnitKerjaData;
  } catch (error) {
    console.error("Error resetting unit kerja data:", error);
    throw error;
  }
}
