import { db } from "@/db/db";
import { 
  getRemainingLoanAmount 
} from "../loanOperations";

/**
 * Calculate total outstanding pinjaman for an anggota (remaining balance)
 * PURE DB DRIVEN
 */
export async function calculateTotalPinjaman(anggotaId: string): Promise<number> {
  const transaksi = await db.transaksi
    .where("anggotaId")
    .equals(anggotaId)
    .and(t => t.status === "Sukses")
    .toArray();

  const loans = transaksi.filter(t => t.jenis === "Pinjam");
  let totalSisa = 0;
  
  for (const loan of loans) {
    totalSisa += await getRemainingLoanAmount(loan.id, transaksi);
  }

  return totalSisa;
}

/**
 * Get total remaining loan balance for all members
 */
export async function getTotalAllSisaPinjaman(): Promise<number> {
  const allTransaksi = await db.transaksi.where("status").equals("Sukses").toArray();
  const loans = allTransaksi.filter(t => t.jenis === "Pinjam");
  
  let totalSisa = 0;
  for (const loan of loans) {
    totalSisa += await getRemainingLoanAmount(loan.id, allTransaksi);
  }
  
  return totalSisa;
}

/**
 * Get detailed loan summary for all members with pure DB driven logic
 */
export async function getAllLoansDetailedSummary() {
  const allTransaksi = await db.transaksi.where("status").equals("Sukses").toArray();
  const loans = allTransaksi.filter(t => t.jenis === "Pinjam");
  
  const summary = [];
  for (const pinjaman of loans) {
    const sisa = await getRemainingLoanAmount(pinjaman.id, allTransaksi);
    summary.push({
      id: pinjaman.id,
      anggotaId: pinjaman.anggotaId,
      anggotaId: pinjaman.anggotaId,
      jumlahPinjaman: pinjaman.jumlah,
      sisaPinjaman: sisa,
      status: sisa > 0 ? "Aktif" : "Lunas",
      tanggalPinjam: pinjaman.tanggal,
      tenor: pinjaman.tenor || 12,
      rate: pinjaman.sukuBunga || 0
    });
  }
  
  return summary;
}
