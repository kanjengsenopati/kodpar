import { useEffect, useState, useMemo } from "react";
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
import { Transaksi, Anggota } from "@/types";

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
  isLoading: boolean;
}

/**
 * Custom hook to fetch and process all data needed for the dashboard with CONSISTENT calculations
 * Now handles async data fetching from IndexedDB and provides a loading state
 * @returns All dashboard data and loading status
 */
export function useDashboardData(): DashboardData {
  const [data, setData] = useState<{
    allTransaksi: Transaksi[];
    anggotaList: Anggota[];
    totalSimpanan: number;
    totalPinjaman: number;
    totalSisaPinjaman: number;
    totalAngsuran: number;
  }>({
    allTransaksi: [],
    anggotaList: [],
    totalSimpanan: 0,
    totalPinjaman: 0,
    totalSisaPinjaman: 0,
    totalAngsuran: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [
          allTransaksi, 
          anggotaList, 
          totalSimpanan, 
          totalPinjaman, 
          totalSisaPinjaman, 
          totalAngsuran
        ] = await Promise.all([
          getAllTransaksi(),
          getAnggotaList(),
          getTotalAllSimpanan(),
          getTotalAllPinjaman(),
          getTotalAllSisaPinjaman(),
          getTotalAllAngsuran()
        ]);

        setData({
          allTransaksi,
          anggotaList,
          totalSimpanan,
          totalPinjaman,
          totalSisaPinjaman,
          totalAngsuran
        });
      } catch (error) {
        console.error("Dashboard data load error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const { allTransaksi, anggotaList, totalSimpanan, totalPinjaman, totalSisaPinjaman, totalAngsuran } = data;
  
  // Calculate various dashboard metrics using useMemo for performance
  return useMemo(() => {
    // Basic stats already fetched
    const totalAnggota = anggotaList.length;
    
    // Get recent transactions for tabular display
    const recentTransaksi = [...allTransaksi]
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
      .slice(0, 5);
    
    // Calculate SHU distribution using sample anggota IDs (now properly awaited)
    const shuDistribution = await calculateSHUForSamples();
    
    // Prepare productivity data
    const productivityData = {
      anggotaBaru: {
        current: getAnggotaBaru(anggotaList, 0),
        previous: getAnggotaBaru(anggotaList, 1)
      },
      transaksiSimpanan: {
        current: getTransaksiCount(allTransaksi, "Simpan", 0),
        previous: getTransaksiCount(allTransaksi, "Simpan", 1)
      },
      transaksiPinjaman: {
        current: getTransaksiCount(allTransaksi, "Pinjam", 0),
        previous: getTransaksiCount(allTransaksi, "Pinjam", 1)
      },
      shuBulanIni: {
        current: getSHUByMonth(0),
        previous: getSHUByMonth(1)
      },
      nilaiPenjualan: {
        current: getPenjualanByMonth(0),
        previous: getPenjualanByMonth(1)
      }
    };

    return {
      totalAnggota,
      totalSimpanan,
      totalPinjaman,
      totalSisaPinjaman,
      totalAngsuran,
      totalPenjualan: 0, // Placeholder
      recentTransaksi,
      allTransaksi,
      shuDistribution,
      productivityData,
      isLoading
    };
  }, [data, isLoading]);
}
