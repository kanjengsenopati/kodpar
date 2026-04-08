
import { Transaksi } from "@/types";
import { getTransaksiByAnggotaId } from "./transaksiCore";

export interface SimpananBalance {
  kategori: string;
  totalSimpan: number;
  totalPenarikan: number;
  saldoBersih: number;
  transaksi: Transaksi[];
}

/**
 * Calculate simpanan balance by category for a specific member
 */
export function calculateSimpananBalanceByKategori(anggotaId: string): SimpananBalance[] {
  const transaksi = getTransaksiByAnggotaId(anggotaId);
  const simpananTransaksi = transaksi.filter(t => t.jenis === "Simpan" || t.jenis === "Penarikan");
  
  // Group by kategori
  const groupedByKategori: { [key: string]: Transaksi[] } = {};
  
  simpananTransaksi.forEach(tr => {
    const kategori = tr.kategori || "Simpanan Umum";
    if (!groupedByKategori[kategori]) {
      groupedByKategori[kategori] = [];
    }
    groupedByKategori[kategori].push(tr);
  });
  
  // Calculate balances
  const balances: SimpananBalance[] = [];
  
  Object.entries(groupedByKategori).forEach(([kategori, transactions]) => {
    let totalSimpan = 0;
    let totalPenarikan = 0;
    
    transactions.forEach(tr => {
      if (tr.jenis === "Simpan") {
        totalSimpan += tr.jumlah;
      } else if (tr.jenis === "Penarikan") {
        totalPenarikan += tr.jumlah;
      }
    });
    
    balances.push({
      kategori,
      totalSimpan,
      totalPenarikan,
      saldoBersih: totalSimpan - totalPenarikan,
      transaksi: transactions
    });
  });
  
  return balances.sort((a, b) => b.saldoBersih - a.saldoBersih);
}

/**
 * Get available balance for a specific simpanan category
 */
export function getAvailableBalanceForKategori(anggotaId: string, kategori: string): number {
  const balances = calculateSimpananBalanceByKategori(anggotaId);
  const balance = balances.find(b => b.kategori === kategori);
  return balance ? balance.saldoBersih : 0;
}

/**
 * Validate if withdrawal amount is allowed for a specific category
 */
export function validateWithdrawalAmount(anggotaId: string, kategori: string, amount: number): {
  isValid: boolean;
  availableBalance: number;
  message?: string;
} {
  const availableBalance = getAvailableBalanceForKategori(anggotaId, kategori);
  
  if (amount <= 0) {
    return {
      isValid: false,
      availableBalance,
      message: "Amount must be greater than zero"
    };
  }
  
  if (amount > availableBalance) {
    return {
      isValid: false,
      availableBalance,
      message: `Insufficient balance. Available: ${availableBalance}, Requested: ${amount}`
    };
  }
  
  return {
    isValid: true,
    availableBalance
  };
}
