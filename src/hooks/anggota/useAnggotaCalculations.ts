import { useState, useCallback } from "react";
import { 
  calculateTotalSimpanan, 
  calculateTotalPinjaman, 
  calculateSHU 
} from "@/services/transaksiService";

export interface AnggotaCalculatedData {
  totalSimpanan: number;
  totalPinjaman: number;
  totalSHU: number;
}

export function useAnggotaCalculations() {
  const [calculatedDataMap, setCalculatedDataMap] = useState<Record<string, AnggotaCalculatedData>>({});
  const [isCalculating, setIsCalculating] = useState(false);

  const performBulkCalculations = useCallback(async (anggotaList: any[]) => {
    if (!anggotaList || anggotaList.length === 0) return;
    
    setIsCalculating(true);
    try {
      const results = await Promise.all(
        anggotaList.map(async (anggota) => {
          const [simpanan, pinjaman, shu] = await Promise.all([
            calculateTotalSimpanan(anggota.id),
            calculateTotalPinjaman(anggota.id),
            calculateSHU(anggota.id)
          ]);
          
          return {
            id: anggota.id,
            data: {
              totalSimpanan: simpanan,
              totalPinjaman: pinjaman,
              totalSHU: shu
            }
          };
        })
      );

      const newMap: Record<string, AnggotaCalculatedData> = {};
      results.forEach(result => {
        newMap[result.id] = result.data;
      });
      
      setCalculatedDataMap(newMap);
    } catch (error) {
      console.error("Error performing bulk calculations:", error);
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const getTotalSimpanan = (anggotaId: string): number => {
    return calculatedDataMap[anggotaId]?.totalSimpanan || 0;
  };
  
  const getTotalPinjaman = (anggotaId: string): number => {
    return calculatedDataMap[anggotaId]?.totalPinjaman || 0;
  };

  const getTotalSHU = (anggotaId: string): number => {
    return calculatedDataMap[anggotaId]?.totalSHU || 0;
  };
  
  const getPetugas = (petugasId: string): string => {
    return "Admin";
  };

  return {
    getTotalSimpanan,
    getTotalPinjaman,
    getTotalSHU,
    getPetugas,
    isCalculating,
    performBulkCalculations
  };
}
