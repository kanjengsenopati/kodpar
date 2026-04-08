
import { Transaksi } from "@/types";

/**
 * Function to filter transactions by date range
 */
export const filterTransaksi = (transaksi: Transaksi[], startDate: string, endDate?: string) => {
  return transaksi.filter(t => {
    const transactionDate = new Date(t.tanggal).toISOString().split('T')[0];
    if (endDate) {
      return transactionDate >= startDate && transactionDate <= endDate;
    }
    return transactionDate >= startDate;
  });
};
