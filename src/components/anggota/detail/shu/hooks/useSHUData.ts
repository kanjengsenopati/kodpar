
import { useState, useEffect } from "react";
import { getPengaturan } from "@/services/pengaturanService";
import { calculateSHU } from "@/services/transaksi/financialOperations/shuOperations";

/**
 * Custom hook for managing SHU data and update operations
 */
export function useSHUData(anggotaId: string, initialSHU: number) {
  const [totalSHU, setTotalSHU] = useState(initialSHU);
  const [shuFormula, setShuFormula] = useState<string>("");
  
  // Get SHU formula from settings
  useEffect(() => {
    const settings = getPengaturan();
    setShuFormula(settings.shu?.formula || "simpanan_khusus * 0.03 + simpanan_wajib * 0.05 + pendapatan * 0.02");
  }, []);
  
  // Update SHU value when needed
  const updateSHUValue = () => {
    // Force recalculation of SHU by clearing cache first
    localStorage.removeItem(`shu_result_${anggotaId}`);
    
    // Calculate fresh value
    const newSHU = calculateSHU(anggotaId);
    if (newSHU !== totalSHU) {
      console.log("SHU value updated in drawer:", newSHU);
      setTotalSHU(newSHU);
    }
  };

  // Monitor changes to SHU formula
  useEffect(() => {
    const handleFormulaChanged = () => {
      console.log("Formula change event detected in SHUInfoDrawer");
      // Update formula
      const settings = getPengaturan();
      setShuFormula(settings.shu?.formula || "simpanan_khusus * 0.03 + simpanan_wajib * 0.05 + pendapatan * 0.02");
      // Update SHU value
      updateSHUValue();
    };
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'shu_formula_updated' || event.key === 'shu_refresh_timestamp') {
        console.log("Formula update detected in localStorage, updating in SHUInfoDrawer");
        handleFormulaChanged();
      }
    };
    
    // Set up event listeners
    window.addEventListener('shu-formula-changed', handleFormulaChanged);
    window.addEventListener('shu-calculations-refreshed', handleFormulaChanged);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('shu-formula-changed', handleFormulaChanged);
      window.removeEventListener('shu-calculations-refreshed', handleFormulaChanged);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [anggotaId, totalSHU]);

  return {
    totalSHU,
    shuFormula,
    updateSHUValue
  };
}
