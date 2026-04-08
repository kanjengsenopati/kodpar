
import { useMemo } from "react";

export function useSHUVariables() {
  // Create example variables for SHU calculation
  // In a real application, these might come from actual data
  return useMemo(() => [
    { 
      id: "simpanan_pokok", 
      label: "Simpanan Pokok", 
      description: "Total simpanan pokok anggota",
      value: 500000 
    },
    { 
      id: "simpanan_wajib", 
      label: "Simpanan Wajib", 
      description: "Total simpanan wajib anggota",
      value: 1200000 
    },
    { 
      id: "simpanan_khusus", 
      label: "Simpanan Khusus", 
      description: "Total simpanan khusus anggota",
      value: 2500000 
    },
    { 
      id: "jasa", 
      label: "Jasa", 
      description: "Total jasa usaha anggota",
      value: 300000 
    },
    { 
      id: "pendapatan", 
      label: "Pendapatan", 
      description: "Total pendapatan usaha anggota",
      value: 450000 
    },
    { 
      id: "lama_keanggotaan", 
      label: "Lama Keanggotaan", 
      description: "Lama keanggotaan dalam tahun",
      value: 5 
    },
    { 
      id: "transaksi_amount", 
      label: "Total Transaksi", 
      description: "Total nilai transaksi anggota",
      value: 3500000 
    },
    { 
      id: "pinjaman", 
      label: "Pinjaman", 
      description: "Total pinjaman anggota",
      value: 5000000 
    }
  ], []);
}
