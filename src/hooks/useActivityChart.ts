
import { Transaksi } from "@/types";

// Types for the chart data
export interface ActivityData {
  name: string;
  simpanan: number;
  pinjaman: number;
  angsuran: number;
}

/**
 * Custom hook for preparing and formatting data for the Activity Bar Chart
 */
export function useActivityChart() {
  /**
   * Formats transaction data for display in the activity bar chart
   * @param transactions Array of transactions
   * @returns Formatted data for the bar chart
   */
  const prepareActivityChartData = (transactions: Transaksi[]): ActivityData[] => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
    const currentYear = new Date().getFullYear();
    
    // Initialize data structure
    const data = months.map(month => ({
      name: month,
      simpanan: 0,
      pinjaman: 0,
      angsuran: 0
    }));
    
    // Count transactions by month and type
    transactions.forEach(transaction => {
      const date = new Date(transaction.tanggal);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        
        if (transaction.jenis === "Simpan") {
          data[monthIndex].simpanan += 1;
        } else if (transaction.jenis === "Pinjam") {
          data[monthIndex].pinjaman += 1;
        } else if (transaction.jenis === "Angsuran") {
          data[monthIndex].angsuran += 1;
        }
      }
    });
    
    return data;
  };

  return {
    prepareActivityChartData
  };
}
