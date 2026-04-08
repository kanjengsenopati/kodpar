
import { useState, useEffect } from "react";
import { validateAnggotaUnitKerja } from "@/services/anggotaService";
import { useToast } from "@/components/ui/use-toast";

export function useAnggotaWatchers(onRefresh: () => void) {
  const [shuFormulaTrigger, setShuFormulaTrigger] = useState<string | null>(null);
  const [unitKerjaTrigger, setUnitKerjaTrigger] = useState<string | null>(null);
  const [shuResetTrigger, setShuResetTrigger] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkFormulaUpdate = () => {
      // Watch for formula updates
      const formulaUpdated = localStorage.getItem('shu_formula_updated');
      if (formulaUpdated && formulaUpdated !== shuFormulaTrigger) {
        console.log("Formula update detected in AnggotaList, refreshing SHU values");
        setShuFormulaTrigger(formulaUpdated);
        onRefresh();
      }
      
      // Check for SHU reset updates
      const shuReset = localStorage.getItem('shu_reset_timestamp');
      if (shuReset && shuReset !== shuResetTrigger) {
        console.log("SHU reset detected in AnggotaList, refreshing data");
        setShuResetTrigger(shuReset);
        onRefresh();
      }
      
      // Also check for unit kerja updates
      const unitKerjaUpdated = localStorage.getItem('unit_kerja_updated');
      if (unitKerjaUpdated && unitKerjaUpdated !== unitKerjaTrigger) {
        console.log("Unit Kerja update detected in AnggotaList, refreshing data");
        setUnitKerjaTrigger(unitKerjaUpdated);
        
        // Validate all anggota unit kerja references
        const updatedCount = validateAnggotaUnitKerja();
        if (updatedCount > 0) {
          toast({
            title: "Data Anggota diperbarui",
            description: `${updatedCount} anggota telah diperbarui Unit Kerjanya`,
          });
          
          onRefresh();
        }
      }
    };
    
    // Check initially
    checkFormulaUpdate();
    
    // Set up interval to check periodically
    const interval = setInterval(checkFormulaUpdate, 5000);
    
    // Listen for SHU reset events
    const handleSHUReset = () => {
      console.log("SHU reset event detected in AnggotaList, refreshing data");
      onRefresh();
    };
    
    window.addEventListener('shu-values-reset', handleSHUReset);
    
    // Clean up interval and event listeners
    return () => {
      clearInterval(interval);
      window.removeEventListener('shu-values-reset', handleSHUReset);
    };
  }, [shuFormulaTrigger, unitKerjaTrigger, shuResetTrigger, toast, onRefresh]);

  return {
    shuFormulaTrigger,
    unitKerjaTrigger,
    shuResetTrigger
  };
}
