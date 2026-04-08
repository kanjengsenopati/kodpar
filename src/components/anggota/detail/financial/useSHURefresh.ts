
import { useEffect, useState } from "react";
import { calculateSHU } from "@/services/transaksi/financialOperations/shuOperations";

export function useSHURefresh(initialSHU: number, anggotaId?: string) {
  const [totalSHU, setTotalSHU] = useState(initialSHU);
  
  // Watch for formula updates
  useEffect(() => {
    if (!anggotaId) return;
    
    const handleFormulaChanged = () => {
      console.log("Formula change detected in FinancialSummary, refreshing SHU");
      refreshSHU();
    };
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'shu_formula_updated' || event.key === 'shu_refresh_timestamp') {
        console.log("Formula update detected in localStorage, refreshing SHU");
        refreshSHU();
      }
    };
    
    // Use both custom event and storage event for better coverage
    window.addEventListener('shu-formula-changed', handleFormulaChanged);
    window.addEventListener('shu-calculations-refreshed', handleFormulaChanged);
    window.addEventListener('storage', handleStorageChange);
    
    // Check for initial formula update indicator
    const formulaUpdated = localStorage.getItem('shu_formula_updated');
    if (formulaUpdated) {
      const updateTime = parseInt(formulaUpdated);
      const currentTime = Date.now();
      
      // If formula was updated in the last minute, refresh SHU
      if (currentTime - updateTime < 60000) {
        console.log("Recent formula update detected on mount, refreshing SHU");
        refreshSHU();
      }
    }
    
    return () => {
      window.removeEventListener('shu-formula-changed', handleFormulaChanged);
      window.removeEventListener('shu-calculations-refreshed', handleFormulaChanged);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [anggotaId]);
  
  const refreshSHU = () => {
    if (!anggotaId) return;
    
    try {
      // Force recalculation by clearing cache first
      localStorage.removeItem(`shu_result_${anggotaId}`);
      
      // Then call the service to calculate
      const newSHU = calculateSHU(anggotaId);
      setTotalSHU(newSHU);
      console.log(`SHU recalculated for ${anggotaId}: ${newSHU}`);
    } catch (error) {
      console.error("Error recalculating SHU:", error);
    }
  };
  
  return { totalSHU, setTotalSHU, refreshSHU };
}
