
import { Transaksi } from "@/types";

// Helper function to get new anggota count by month offset
export function getAnggotaBaru(anggotaList: any[], monthOffset: number) {
  const today = new Date();
  const targetMonth = new Date(today.getFullYear(), today.getMonth() - monthOffset);
  const firstDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
  
  return anggotaList.filter(anggota => {
    const joinDate = new Date(anggota.tanggalBergabung || anggota.createdAt);
    return joinDate >= firstDayOfMonth && joinDate <= lastDayOfMonth;
  }).length;
}

// Helper function to get transaction count by type and month offset
export function getTransaksiCount(transaksiList: Transaksi[], jenis: string, monthOffset: number) {
  const today = new Date();
  const targetMonth = new Date(today.getFullYear(), today.getMonth() - monthOffset);
  const firstDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
  
  return transaksiList.filter(transaksi => {
    const transaksiDate = new Date(transaksi.tanggal);
    return transaksi.jenis === jenis && 
           transaksiDate >= firstDayOfMonth && 
           transaksiDate <= lastDayOfMonth;
  }).length;
}

// Helper function to calculate SHU by month
export function getSHUByMonth(monthOffset: number) {
  // In a real application, this would calculate from actual financial data
  // For now, we'll return sample values
  const baseValue = 8500000;
  return monthOffset === 0 ? baseValue : baseValue * 0.85;
}

// Helper function to calculate penjualan by month
export function getPenjualanByMonth(monthOffset: number) {
  // In a real application, this would calculate from actual sales data
  // For now, we'll return sample values
  const baseValue = 15700000;
  return monthOffset === 0 ? baseValue : baseValue * 0.9;
}
