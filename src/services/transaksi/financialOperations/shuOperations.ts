
import { SHUCalculator } from "./SHUCalculator";
import { getPengaturan } from "../../pengaturanService";
import { getAnggotaList } from "../../anggotaService";

/**
 * Calculate SHU (Sisa Hasil Usaha) for an anggota for a specific period (Fiscal Year)
 */
export async function calculateSHU(anggotaId: string | number, periode?: string): Promise<number> {
  const idAsString = String(anggotaId);
  const currentYear = periode || new Date().getFullYear().toString();
  
  const formulaUpdated = localStorage.getItem('shu_formula_updated');
  const cacheKey = `shu_result_${idAsString}_${currentYear}`;
  const cachedResult = localStorage.getItem(cacheKey);
  const currentTime = Date.now();
  
  // Force recalculation if formula was recently updated
  if (formulaUpdated && currentTime - parseInt(formulaUpdated) < 60000) {
    return await SHUCalculator.calculate(idAsString, currentYear);
  }
  
  if (cachedResult) {
    const cacheTimestamp = localStorage.getItem(`shu_result_timestamp_${idAsString}_${currentYear}`);
    const cacheTime = cacheTimestamp ? parseInt(cacheTimestamp) : 0;
    
    // Cache fresh for 24 hours
    if (currentTime - cacheTime < 86400000) {
      return parseInt(cachedResult);
    }
  }
  
  const result = await SHUCalculator.calculate(idAsString, currentYear);
  localStorage.setItem(cacheKey, result.toString());
  localStorage.setItem(`shu_result_timestamp_${idAsString}_${currentYear}`, currentTime.toString());
  
  return result;
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
      description: "Total Simpanan Sukarela/Khusus anggota berdasarkan riwayat transaksi",
      defaultValue: 0
    },
    {
      name: "simpanan_wajib",
      description: "Total Simpanan Wajib anggota berdasarkan riwayat transaksi",
      defaultValue: 0
    },
    {
      name: "simpanan_pokok", 
      description: "Total Simpanan Pokok anggota berdasarkan riwayat transaksi",
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
 * Reset SHU values for all members for a specific period
 */
export async function resetAllSHUValues(periode?: string): Promise<number> {
  const currentYear = periode || new Date().getFullYear().toString();
  console.log(`Resetting SHU values for period ${currentYear}...`);
  
  const anggotaList = await getAnggotaList();
  let resetCount = 0;
  
  for (const anggota of anggotaList) {
    try {
      const newSHUValue = await SHUCalculator.calculate(anggota.id, currentYear);
      
      const cacheKey = `shu_result_${anggota.id}_${currentYear}`;
      localStorage.setItem(cacheKey, newSHUValue.toString());
      localStorage.setItem(`shu_result_timestamp_${anggota.id}_${currentYear}`, Date.now().toString());
      
      resetCount++;
    } catch (error) {
      console.error(`Error resetting SHU for member ${anggota.id}:`, error);
    }
  }
  
  const resetEvent = new CustomEvent('shu-values-reset', {
    detail: { timestamp: Date.now(), count: resetCount, periode: currentYear }
  });
  window.dispatchEvent(resetEvent);
  
  return resetCount;
}
