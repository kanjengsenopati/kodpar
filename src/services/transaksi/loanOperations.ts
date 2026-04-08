import { getAllTransaksi } from "./transaksiCore";
import { Transaksi } from "@/types";
import { getPengaturan } from "@/services/pengaturanService";

/**
 * Get remaining loan amount for a specific loan with accurate calculation
 */
export function getRemainingLoanAmount(loanId: string): number {
  const transaksiList = getAllTransaksi();
  
  // Find the loan
  const loan = transaksiList.find(t => t.id === loanId && t.jenis === "Pinjam");
  if (!loan) return 0;
  
  // Get all angsuran for this loan
  const angsuran = transaksiList.filter(
    t => t.jenis === "Angsuran" && 
         t.status === "Sukses" && 
         t.anggotaId === loan.anggotaId && 
         t.keterangan?.includes(loanId)
  );
  
  // Calculate total principal paid (only pokok, not jasa)
  let totalPrincipalPaid = 0;
  angsuran.forEach(payment => {
    // Extract pokok amount from keterangan if available
    const pokokMatch = payment.keterangan?.match(/Pokok:\s*[\w\s]*?(\d+(?:[\.,]\d+)*)/);
    if (pokokMatch && pokokMatch[1]) {
      const pokokAmount = parseFloat(pokokMatch[1].replace(/[,\.]/g, ''));
      totalPrincipalPaid += pokokAmount;
    } else {
      // If no allocation info in keterangan, assume full payment to principal (fallback for old data)
      totalPrincipalPaid += payment.jumlah;
    }
  });
  
  // Return remaining principal amount
  return Math.max(0, loan.jumlah - totalPrincipalPaid);
}

/**
 * Calculate jatuh tempo date for a loan
 */
export function calculateJatuhTempo(createdDate: string, tenorBulan: number = 12): string {
  const date = new Date(createdDate);
  date.setMonth(date.getMonth() + tenorBulan);
  return date.toISOString();
}

/**
 * Calculate penalty for overdue loans
 */
export function calculatePenalty(loanAmount: number, daysOverdue: number): number {
  // Get penalty rate from settings or use default
  const pengaturan = getPengaturan();
  const penaltyRate = pengaturan.denda.persentase || 0.001; // Default 0.1% per day
  
  return loanAmount * penaltyRate * daysOverdue;
}

/**
 * Calculate interest (bunga) portion of an angsuran (installment)
 * @param pokokSisa sisa pokok pinjaman sebelum angsuran ini
 * @param bungaPersen rate per bulan (0.015 = 1.5% per bulan)
 */
export function calculateAngsuranBunga(pokokSisa: number, bungaPersen: number): number {
  return Math.round(pokokSisa * bungaPersen);
}

/**
 * Get loan interest rate with proper conversion
 */
export function getLoanInterestRate(kategori: string): number {
  const pengaturan = getPengaturan();
  
  // Get interest rate for the loan category (stored as percentage)
  let sukuBunga = pengaturan?.sukuBunga?.pinjaman || 1.5;
  if (pengaturan?.sukuBunga?.pinjamanByCategory && kategori) {
    sukuBunga = pengaturan.sukuBunga.pinjamanByCategory[kategori] || sukuBunga;
  }

  // Convert percentage to decimal (1.5% = 0.015)
  return sukuBunga / 100;
}

/**
 * Get overdue loans
 */
export function getOverdueLoans(anggotaId: string | "ALL" = "ALL"): { 
  transaksi: Transaksi; 
  jatuhTempo: string;
  daysOverdue: number;
  penalty: number;
}[] {
  const transaksiList = getAllTransaksi();
  const currentDate = new Date();
  const results = [];
  
  // Filter for pinjaman transactions
  const pinjamanList = anggotaId === "ALL"
    ? transaksiList.filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
    : transaksiList.filter(t => t.jenis === "Pinjam" && t.status === "Sukses" && t.anggotaId === anggotaId);
  
  for (const pinjaman of pinjamanList) {
    // Extract tenor from keterangan
    let tenor = 12; // Default tenor
    if (pinjaman.keterangan) {
      const tenorMatch = pinjaman.keterangan.match(/Tenor: (\d+) bulan/);
      if (tenorMatch && tenorMatch[1]) {
        tenor = parseInt(tenorMatch[1]);
      }
    }
    
    // Calculate due date
    const createdDate = new Date(pinjaman.tanggal);
    const dueDate = new Date(createdDate);
    dueDate.setMonth(dueDate.getMonth() + tenor);
    
    // Calculate days until due
    const timeDiff = currentDate.getTime() - dueDate.getTime();
    const daysOverdue = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Check if overdue
    if (daysOverdue > 0) {
      // Get remaining amount
      const remainingAmount = getRemainingLoanAmount(pinjaman.id);
      
      // Only include if there's still an outstanding balance
      if (remainingAmount > 0) {
        // Calculate penalty
        const penalty = calculatePenalty(remainingAmount, daysOverdue);
        
        results.push({
          transaksi: pinjaman,
          jatuhTempo: dueDate.toISOString(),
          daysOverdue,
          penalty
        });
      }
    }
  }
  
  return results;
}

/**
 * Get upcoming due loans (not yet overdue)
 */
export function getUpcomingDueLoans(anggotaId: string | "ALL" = "ALL", daysThreshold: number = 30): { 
  transaksi: Transaksi; 
  jatuhTempo: string;
  daysUntilDue: number;
}[] {
  const transaksiList = getAllTransaksi();
  const currentDate = new Date();
  const results = [];
  
  // Filter for pinjaman transactions
  const pinjamanList = anggotaId === "ALL"
    ? transaksiList.filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
    : transaksiList.filter(t => t.jenis === "Pinjam" && t.status === "Sukses" && t.anggotaId === anggotaId);
  
  for (const pinjaman of pinjamanList) {
    // Extract tenor from keterangan
    let tenor = 12; // Default tenor
    if (pinjaman.keterangan) {
      const tenorMatch = pinjaman.keterangan.match(/Tenor: (\d+) bulan/);
      if (tenorMatch && tenorMatch[1]) {
        tenor = parseInt(tenorMatch[1]);
      }
    }
    
    // Calculate due date
    const createdDate = new Date(pinjaman.tanggal);
    const dueDate = new Date(createdDate);
    dueDate.setMonth(dueDate.getMonth() + tenor);
    
    // Calculate days until due
    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const daysUntilDue = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Check if within threshold and not overdue
    if (daysUntilDue > 0 && daysUntilDue <= daysThreshold) {
      // Get remaining amount
      const remainingAmount = getRemainingLoanAmount(pinjaman.id);
      
      // Only include if there's still an outstanding balance
      if (remainingAmount > 0) {
        results.push({
          transaksi: pinjaman,
          jatuhTempo: dueDate.toISOString(),
          daysUntilDue
        });
      }
    }
  }
  
  return results;
}
