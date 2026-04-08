
import { 
  calculateTotalSimpanan, 
  calculateTotalPinjaman, 
  calculateSHU 
} from "@/services/transaksiService";

export function useAnggotaCalculations() {
  const getTotalSimpanan = (anggotaId: string): number => {
    return calculateTotalSimpanan(anggotaId);
  };
  
  const getTotalPinjaman = (anggotaId: string): number => {
    const total = calculateTotalPinjaman(anggotaId);
    return total > 0 ? total : 0;
  };

  const getTotalSHU = (anggotaId: string): number => {
    return calculateSHU(anggotaId);
  };
  
  const getPetugas = (petugasId: string): string => {
    // This would normally come from a service that tracks which staff member
    // is assigned to this member. For now return a placeholder.
    return "Admin";
  };

  return {
    getTotalSimpanan,
    getTotalPinjaman,
    getTotalSHU,
    getPetugas
  };
}
