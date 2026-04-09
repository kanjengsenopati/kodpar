import { getAllTransaksi } from "./transaksiCore";
import { Transaksi } from "@/types";
import { getPengaturan } from "@/services/pengaturanService";

/**
 * Get remaining loan amount for a specific loan with PURE DATABASE-DRIVEN logic
 * SAK EP Compliant - Amortized Cost
 */
export async function getRemainingLoanAmount(loanId: string, cachedTransactions?: Transaksi[]): Promise<number> {
  const transaksiList = cachedTransactions || await getAllTransaksi();
  
  // Find the original loan (The Principal Debt)
  const loan = transaksiList.find(t => t.id === loanId && t.jenis === "Pinjam" && t.status === "Sukses");
  if (!loan) return 0;
  
  // Get all installments associated with this specific loan
  const angsuran = transaksiList.filter(t => 
    t.jenis === "Angsuran" && 
    t.status === "Sukses" && 
    t.referensiPinjamanId === loanId
  );
  
  // Calculate total principal paid using strictly structured nominalPokok fields
  const totalPrincipalPaid = angsuran.reduce((total, payment) => {
    // Priority: Structured nominalPokok preserved in DB
    return total + (payment.nominalPokok || 0);
  }, 0);
  
  // Return remaining principal amount
  return Math.max(0, (loan.jumlah || 0) - totalPrincipalPaid);
}

/**
 * Calculate jatuh tempo date based on structured tenor field
 */
export function calculateJatuhTempo(createdDate: string, tenorBulan: number): string {
  const date = new Date(createdDate);
  date.setMonth(date.getMonth() + (tenorBulan || 12));
  return date.toISOString();
}

/**
 * Get loan interest rate from database settings
 * (ELIMINATES HARDCODED DEFAULTS)
 */
export function getLoanInterestRate(kategori: string): number {
  const pengaturan = getPengaturan();
  let sukuBunga = pengaturan?.sukuBunga?.pinjaman || 0; // Default to 0 to prevent unauthorized interest
  
  if (pengaturan?.sukuBunga?.pinjamanByCategory && kategori) {
    sukuBunga = pengaturan.sukuBunga.pinjamanByCategory[kategori] || sukuBunga;
  }

  return sukuBunga / 100; // Convert 1.5 to 0.015
}

/**
 * Calculate penalty based on dynamic database settings
 */
export function calculatePenalty(loanAmount: number, daysOverdue: number): number {
  const pengaturan = getPengaturan();
  const penaltyRate = pengaturan.denda.persentase || 0; // Standardized to 0 default
  return loanAmount * (penaltyRate / 100) * daysOverdue;
}

/**
 * Get overdue loans using structured tenor data
 */
export async function getOverdueLoans(anggotaId: string | "ALL" = "ALL"): Promise<{ 
  transaksi: Transaksi; 
  jatuhTempo: string;
  daysOverdue: number;
  penalty: number;
}[]> {
  const transaksiList = await getAllTransaksi();
  const currentDate = new Date();
  const results = [];
  
  const pinjamanList = transaksiList.filter(t => 
    t.jenis === "Pinjam" && 
    t.status === "Sukses" && 
    (anggotaId === "ALL" || t.anggotaId === anggotaId)
  );
  
  for (const pinjaman of pinjamanList) {
    // Pure DB Driven Tenor
    const tenor = pinjaman.tenor || 12;
    
    // Calculate due date
    const createdDate = new Date(pinjaman.tanggal);
    const dueDate = new Date(createdDate);
    dueDate.setMonth(dueDate.getMonth() + tenor);
    
    // Calculate days until due
    const timeDiff = currentDate.getTime() - dueDate.getTime();
    const daysOverdue = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysOverdue > 0) {
      const remainingAmount = await getRemainingLoanAmount(pinjaman.id, transaksiList);
      
      if (remainingAmount > 0) {
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
 * Get upcoming due loans using structured tenor data
 */
export async function getUpcomingDueLoans(anggotaId: string | "ALL" = "ALL", daysThreshold: number = 30): Promise<{ 
  transaksi: Transaksi; 
  jatuhTempo: string;
  daysUntilDue: number;
}[]> {
  const transaksiList = await getAllTransaksi();
  const currentDate = new Date();
  const results = [];
  
  const pinjamanList = transaksiList.filter(t => 
    t.jenis === "Pinjam" && 
    t.status === "Sukses" && 
    (anggotaId === "ALL" || t.anggotaId === anggotaId)
  );
  
  for (const pinjaman of pinjamanList) {
    const tenor = pinjaman.tenor || 12;
    const createdDate = new Date(pinjaman.tanggal);
    const dueDate = new Date(createdDate);
    dueDate.setMonth(dueDate.getMonth() + tenor);
    
    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const daysUntilDue = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysUntilDue > 0 && daysUntilDue <= daysThreshold) {
      const remainingAmount = await getRemainingLoanAmount(pinjaman.id, transaksiList);
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

/**
 * Get all members with active principal debt
 */
export async function getAnggotaWithActiveLoans(): Promise<string[]> {
  const transaksiList = await getAllTransaksi();
  const pinjamList = transaksiList.filter(t => t.jenis === "Pinjam" && t.status === "Sukses");
  const anggotaWithLoans = new Set<string>();
  
  for (const loan of pinjamList) {
    if (anggotaWithLoans.has(loan.anggotaId)) continue;
    const remaining = await getRemainingLoanAmount(loan.id, transaksiList);
    if (remaining > 0) {
      anggotaWithLoans.add(loan.anggotaId);
    }
  }
  return Array.from(anggotaWithLoans);
}

/**
 * Generate installment schedule for a loan - PURE DATABASE DRIVEN
 */
export async function generateInstallmentSchedule(loanId: string): Promise<any[]> {
  const allTransaksi = await getAllTransaksi();
  const loan = allTransaksi.find(t => t.id === loanId && t.jenis === "Pinjam" && t.status === "Sukses");
  if (!loan) return [];

  const payments = allTransaksi.filter(
    t => t.jenis === "Angsuran" && 
        t.status === "Sukses" && 
        t.referensiPinjamanId === loanId
  );

  const schedule = [];
  const startDate = new Date(loan.tanggal);
  const tenor = loan.tenor || 12;
  const angsuranPerBulan = Math.floor(loan.jumlah / tenor); // Estimation for UI only if matching doesn't exist

  for (let i = 1; i <= tenor; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    // Find payment for this installment
    const payment = payments.find(p => {
      // In a real system, we'd have a specific installment index link
      const paymentDate = new Date(p.tanggal);
      const dueDateEnd = new Date(dueDate);
      dueDateEnd.setDate(dueDateEnd.getDate() + 30);
      return paymentDate <= dueDateEnd;
    });

    schedule.push({
      angsuranKe: i,
      jatuhTempo: dueDate.toISOString().split('T')[0],
      jumlah: payment ? payment.jumlah : angsuranPerBulan,
      status: payment ? "lunas" : (new Date() > dueDate ? "terlambat" : "belum-bayar"),
      tanggalBayar: payment?.tanggal,
      nominalPokok: payment?.nominalPokok,
      nominalJasa: payment?.nominalJasa
    });
  }

  return schedule;
}

/**
 * Get all active loans for a specific member- PURE DATABASE DRIVEN
 * Returns only loans that have a remaining principal balance > 0
 */
export async function getActiveLoansByAnggotaId(anggotaId: string): Promise<Transaksi[]> {
  const transaksiList = await getAllTransaksi();
  
  // 1. Get all successful loan disbursements for this member
  const allLoans = transaksiList.filter(t => 
    t.jenis === "Pinjam" && 
    t.status === "Sukses" && 
    t.anggotaId === anggotaId
  );
  
  const activeLoans: Transaksi[] = [];
  
  // 2. Filter for loans with remaining balance
  for (const loan of allLoans) {
    const remaining = await getRemainingLoanAmount(loan.id, transaksiList);
    if (remaining > 0) {
      activeLoans.push(loan);
    }
  }
  
  return activeLoans;
}
