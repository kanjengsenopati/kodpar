
import { SHUCalculator } from "./SHUCalculator";
import { getPengaturan } from "../../pengaturanService";
import { getAnggotaList } from "../../anggotaService";

/**
 * Calculate SHU (Sisa Hasil Usaha) for an anggota using the formula from settings
 * 
 * @param anggotaId The anggota ID as a string or number
 * @returns The SHU amount
 */
export function calculateSHU(anggotaId: string | number): number {
  // Check if calculation is being forced by a recent formula update
  const formulaUpdated = localStorage.getItem('shu_formula_updated');
  const cachedResult = localStorage.getItem(`shu_result_${anggotaId}`);
  const currentTime = Date.now();
  
  // If formula was recently updated or no cached result exists, force recalculation
  if (
    formulaUpdated &&
    currentTime - parseInt(formulaUpdated) < 60000 || // Within last minute 
    !cachedResult
  ) {
    console.log("Forcing fresh SHU calculation due to formula update or missing cache");
    return SHUCalculator.calculate(anggotaId);
  }
  
  // Otherwise use cached result if available and recent (within last hour)
  if (cachedResult) {
    const cacheTimestamp = localStorage.getItem(`shu_result_timestamp_${anggotaId}`);
    const cacheTime = cacheTimestamp ? parseInt(cacheTimestamp) : 0;
    
    // Check if cache is still fresh (less than 1 hour old)
    if (currentTime - cacheTime < 3600000) {
      console.log("Using cached SHU calculation result:", cachedResult);
      return parseInt(cachedResult);
    }
    
    // Otherwise calculate fresh
    console.log("Cache expired, calculating fresh SHU value");
    return SHUCalculator.calculate(anggotaId);
  }
  
  // Default case: calculate fresh
  return SHUCalculator.calculate(anggotaId);
}

/**
 * Get the current SHU formula from settings
 * @returns The current SHU formula string
 */
export function getCurrentSHUFormula(): string {
  const settings = getPengaturan();
  return settings.shu?.formula || "simpanan_khusus * 0.03 + simpanan_wajib * 0.05 + pendapatan * 0.02";
}

/**
 * Calculate SHU distribution based on settings
 * @param totalSHU The total SHU amount
 * @returns Object with distributed values
 */
export function calculateSHUDistribution(totalSHU: number) {
  const settings = getPengaturan();
  const distribution = settings.shu?.distribution || {
    rekening_penyimpan: 25,
    rekening_berjasa: 25,
    pengurus: 10,
    dana_karyawan: 5,
    dana_pendidikan: 10,
    dana_pembangunan_daerah: 2.5,
    dana_sosial: 2.5,
    cadangan: 20
  };

  const result: Record<string, number> = {};
  
  // Calculate each distribution value
  Object.entries(distribution).forEach(([key, percentage]) => {
    result[key] = (totalSHU * percentage) / 100;
  });
  
  return result;
}

/**
 * Get explanation of variables used in SHU formula
 * @returns Array of variable names and their explanations
 */
export function getSHUVariableExplanations(): Array<{name: string; description: string; defaultValue: number}> {
  return [
    {
      name: "simpanan_khusus",
      description: "Simpanan khusus/sukarela anggota, merupakan 40% dari total simpanan",
      defaultValue: 0
    },
    {
      name: "simpanan_wajib",
      description: "Simpanan wajib anggota, merupakan 60% dari total simpanan",
      defaultValue: 0
    },
    {
      name: "simpanan_pokok", 
      description: "Simpanan pokok anggota, merupakan 20% dari total simpanan",
      defaultValue: 0
    },
    {
      name: "pendapatan",
      description: "Pendapatan anggota, diestimasi sebagai 20% dari jasa",
      defaultValue: 0
    },
    {
      name: "jasa",
      description: "Jasa dari bunga pinjaman anggota",
      defaultValue: 0
    },
    {
      name: "lama_keanggotaan",
      description: "Lama keanggotaan dalam tahun",
      defaultValue: 1
    },
    {
      name: "transaksi_amount",
      description: "Total nilai transaksi anggota",
      defaultValue: 0
    },
    {
      name: "angsuran",
      description: "Total angsuran yang telah dibayar",
      defaultValue: 0
    }
  ];
}

/**
 * Force recalculation of SHU for all members
 * Can be called when formula changes
 */
export function refreshAllSHUCalculations(): void {
  console.log("Refreshing all SHU calculations after formula update");
  
  // Clear all cached SHU results
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('shu_result_')) {
      localStorage.removeItem(key);
    }
  });
  
  // Set current timestamp in localStorage to indicate when the refresh occurred
  localStorage.setItem('shu_refresh_timestamp', Date.now().toString());
  
  // Notify components that SHU calculations have been refreshed
  const refreshEvent = new CustomEvent('shu-calculations-refreshed', {
    detail: { timestamp: Date.now() }
  });
  window.dispatchEvent(refreshEvent);
}

/**
 * Reset SHU values for all members and recalculate based on current formula
 * @returns Number of members whose SHU values were reset
 */
export function resetAllSHUValues(): number {
  console.log("Resetting all SHU values for all members...");
  
  // Get all members
  const anggotaList = getAnggotaList();
  let resetCount = 0;
  
  // Clear all cached SHU results first
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('shu_result_')) {
      localStorage.removeItem(key);
      localStorage.removeItem(`shu_result_timestamp_${key.replace('shu_result_', '')}`);
    }
  });
  
  // Force recalculation for each member
  anggotaList.forEach(anggota => {
    try {
      // Calculate fresh SHU value
      const newSHUValue = SHUCalculator.calculate(anggota.id);
      
      // Store the result in localStorage with timestamp
      localStorage.setItem(`shu_result_${anggota.id}`, newSHUValue.toString());
      localStorage.setItem(`shu_result_timestamp_${anggota.id}`, Date.now().toString());
      
      resetCount++;
    } catch (error) {
      console.error(`Error resetting SHU for member ${anggota.id}:`, error);
    }
  });
  
  // Set a trigger to notify components of reset
  localStorage.setItem('shu_reset_timestamp', Date.now().toString());
  
  // Dispatch event for immediate notification
  const resetEvent = new CustomEvent('shu-values-reset', {
    detail: { 
      timestamp: Date.now(),
      count: resetCount
    }
  });
  window.dispatchEvent(resetEvent);
  
  return resetCount;
}
