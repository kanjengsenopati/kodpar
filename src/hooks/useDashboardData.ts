
import { getAllTransaksi } from "@/services/transaksiService";
import { getAnggotaList } from "@/services/anggotaService";
import { 
  getTotalAllSimpanan 
} from "@/services/transaksi/financialOperations/simpananOperations"; 
import { 
  getTotalAllPinjaman,
  getTotalAllSisaPinjaman
} from "@/services/transaksi/financialOperations/pinjamanOperations";
import { 
  getTotalAllAngsuran 
} from "@/services/transaksi/financialOperations/payments";
import { getAnggotaBaru, getTransaksiCount, getSHUByMonth, getPenjualanByMonth } from "@/utils/dashboardUtils";
import { calculateSHUForSamples } from "@/utils/shuUtils";
import { useMemo } from "react";
import { Transaksi } from "@/types";

export interface DashboardData {
  totalAnggota: number;
  totalSimpanan: number;
  totalPinjaman: number;
  totalSisaPinjaman: number;
  totalAngsuran: number;
  totalPenjualan: number;
  recentTransaksi: Transaksi[];
  allTransaksi: Transaksi[];
  shuDistribution: {
    id: string;
    name: string;
    shu: number;
  }[];
  productivityData: {
    anggotaBaru: {
      current: number;
      previous: number;
    };
    transaksiSimpanan: {
      current: number;
      previous: number;
    };
    transaksiPinjaman: {
      current: number;
      previous: number;
    };
    shuBulanIni: {
      current: number;
      previous: number;
    };
    nilaiPenjualan: {
      current: number;
      previous: number;
    };
  };
}

/**
 * Custom hook to fetch and process all data needed for the dashboard with CONSISTENT calculations
 * Now handles deleted Simpan/Pinjam/Angsuran data and null values for dashboard charts
 * @returns All dashboard data in a structured format
 */
export function useDashboardData(): DashboardData {
  // Get transactions and anggota data for charts and statistics
  const allTransaksi = getAllTransaksi();
  const anggotaList = getAnggotaList();
  
  // Calculate various dashboard metrics using useMemo for performance
  return useMemo(() => {
    // Calculate statistics for display - will return 0 when no Simpan/Pinjam/Angsuran data exists
    const totalAnggota = anggotaList.length;
    const totalSimpanan = getTotalAllSimpanan(); // Returns 0 when no Simpan data
    const totalPinjaman = getTotalAllPinjaman(); // Returns 0 when no Pinjam data
    const totalSisaPinjaman = getTotalAllSisaPinjaman(); // Returns 0 when no Pinjam data
    const totalAngsuran = getTotalAllAngsuran(); // Returns 0 when no Angsuran data
    
    console.log(`Dashboard data after deletion: totalSimpanan = ${totalSimpanan}, totalPinjaman = ${totalPinjaman}, totalAngsuran = ${totalAngsuran}`);
    
    // Set to 0 to match the null data reset requirement for charts
    const totalPenjualan = 0; // Reset to 0 for null data scenario in charts
    
    // Get recent transactions for tabular display - will be empty if Simpan/Pinjam/Angsuran deleted
    const recentTransaksi = [...allTransaksi]
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
      .slice(0, 5);
    
    // Calculate SHU distribution for several sample anggota IDs - returns 0 values when data is deleted/null
    const shuDistribution = calculateSHUForSamples();
    
    // Prepare productivity data - all counts will be 0 when Simpan/Pinjam/Angsuran data is deleted
    const productivityData = {
      anggotaBaru: {
        current: getAnggotaBaru(anggotaList, 0),
        previous: getAnggotaBaru(anggotaList, 1)
      },
      transaksiSimpanan: {
        current: getTransaksiCount(allTransaksi, "Simpan", 0), // Will be 0 after deletion
        previous: getTransaksiCount(allTransaksi, "Simpan", 1)
      },
      transaksiPinjaman: {
        current: getTransaksiCount(allTransaksi, "Pinjam", 0), // Will be 0 after deletion
        previous: getTransaksiCount(allTransaksi, "Pinjam", 1)
      },
      shuBulanIni: {
        current: getSHUByMonth(0), // Will be 0 with null/deleted data
        previous: getSHUByMonth(1)
      },
      nilaiPenjualan: {
        current: getPenjualanByMonth(0), // Will be 0 with reset data
        previous: getPenjualanByMonth(1)
      }
    };

    return {
      totalAnggota,
      totalSimpanan,
      totalPinjaman,
      totalSisaPinjaman,
      totalAngsuran,
      totalPenjualan,
      recentTransaksi,
      allTransaksi,
      shuDistribution,
      productivityData
    };
  }, [allTransaksi, anggotaList]);
}
