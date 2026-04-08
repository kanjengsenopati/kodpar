
import { getAllTransaksi } from "../transaksiCore";

/**
 * Calculate total simpanan for an anggota
 */
export function calculateTotalSimpanan(anggotaId: string): number {
  const transaksiList = getAllTransaksi();
  
  // Sum up all simpanan transactions
  return transaksiList
    .filter(t => t.anggotaId === anggotaId && t.jenis === "Simpan" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}

/**
 * Get total simpanan for all members
 */
export function getTotalAllSimpanan(): number {
  const transaksiList = getAllTransaksi();
  
  // Sum up all simpanan transactions
  return transaksiList
    .filter(t => t.jenis === "Simpan" && t.status === "Sukses")
    .reduce((total, t) => total + t.jumlah, 0);
}
