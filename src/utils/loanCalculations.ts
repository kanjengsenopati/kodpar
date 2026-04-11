import { getPengaturan } from "@/services/pengaturanService";
import { getJenisById } from "@/services/jenisService";

export interface LoanCalculation {
  sukuBunga: number;
  nominalPokok: number;
  nominalJasa: number; // For flat/annuity, this is the first month or avg. For sliding, it's variable.
  totalNominalJasa: number;
  totalPengembalian: number;
  tenor: number;
  angsuranPerBulan: number;
  biayaAdmin: number;
  metodeBunga: string;
}

/**
 * Perform loan calculations based on settings (Flat, Sliding, Annuity)
 * @param jenisId The UUID of the loan type (JenisPinjaman)
 * @param jumlah Principal amount
 * @param tenor Optional tenor in months
 */
export function calculateLoanDetails(jenisId: string, jumlah: number, tenor?: number): LoanCalculation {
  const pengaturan = getPengaturan();
  const jenis = getJenisById(jenisId);
  
  // 1. Resolve Parameters
  const sukuBunga = (jenis && 'bungaPersen' in jenis) ? (jenis as any).bungaPersen : (pengaturan?.sukuBunga?.pinjaman || 1.5);
  const selectedTenor = tenor || (jenis && 'tenorMin' in jenis ? (jenis as any).tenorMin : 12);
  const metodeBunga = pengaturan.sukuBunga.metodeBunga || "flat";
  const rounding = pengaturan.sukuBunga.metodePembulatan || "none";
  
  let totalNominalJasa = 0;
  let angsuranPerBulan = 0;
  let nominalJasa = 0;

  // 2. Core Math based on Method
  if (metodeBunga === "flat") {
    nominalJasa = (jumlah * sukuBunga / 100);
    totalNominalJasa = nominalJasa * selectedTenor;
    angsuranPerBulan = (jumlah + totalNominalJasa) / selectedTenor;
  } 
  else if (metodeBunga === "menurun") {
    // Sliding (Menurun): Interest = Remaining Balance * Rate
    // Average installment calculation for summary (though schedule will vary)
    const totalPokok = jumlah;
    const monthlyPokok = totalPokok / selectedTenor;
    let currentBalance = totalPokok;
    
    for (let i = 0; i < selectedTenor; i++) {
      const interestThisMonth = (currentBalance * sukuBunga / 100);
      totalNominalJasa += interestThisMonth;
      currentBalance -= monthlyPokok;
    }
    nominalJasa = totalNominalJasa / selectedTenor; // Avg for summary
    angsuranPerBulan = (totalPokok + totalNominalJasa) / selectedTenor;
  }
  else if (metodeBunga === "anuitas") {
    // Annuity: Fixed Monthly Installment
    // P = (r * L) / (1 - (1 + r)^-n)
    const r = sukuBunga / 100;
    if (r === 0) {
      angsuranPerBulan = jumlah / selectedTenor;
    } else {
      angsuranPerBulan = (r * jumlah) / (1 - Math.pow(1 + r, -selectedTenor));
    }
    totalNominalJasa = (angsuranPerBulan * selectedTenor) - jumlah;
    nominalJasa = totalNominalJasa / selectedTenor;
  }

  // 3. Rounding
  if (rounding === "ribu") {
    angsuranPerBulan = Math.round(angsuranPerBulan / 1000) * 1000;
  } else if (rounding === "ratus") {
    angsuranPerBulan = Math.round(angsuranPerBulan / 100) * 100;
  } else if (rounding === "ratus_atas") {
    angsuranPerBulan = Math.ceil(angsuranPerBulan / 100) * 100;
  }

  // Recalculate totals based on rounded installment for consistency
  totalNominalJasa = (angsuranPerBulan * selectedTenor) - jumlah;
  
  // 4. Admin Fee
  let biayaAdmin = 0;
  const adminSettings = pengaturan.sukuBunga.biayaAdministrasi;
  if (adminSettings?.enabled && adminSettings.applyTo?.includes("Pinjam")) {
    biayaAdmin = adminSettings.fixed + (jumlah * adminSettings.percentage / 100);
  }

  return {
    sukuBunga,
    nominalPokok: jumlah,
    nominalJasa,
    totalNominalJasa,
    totalPengembalian: jumlah + totalNominalJasa,
    tenor: selectedTenor,
    angsuranPerBulan,
    biayaAdmin,
    metodeBunga
  };
}

export function generateLoanDescription(calculation: LoanCalculation, userKeterangan?: string): string {
  const detailKeterangan = [
    `Metode: ${calculation.metodeBunga.toUpperCase()}`,
    `Rate: ${calculation.sukuBunga}%/bln`,
    `Tenor: ${calculation.tenor} bln`,
    `Angsuran: Rp ${Math.round(calculation.angsuranPerBulan).toLocaleString('id-ID')}`,
    calculation.biayaAdmin > 0 ? `Biaya Admin: Rp ${calculation.biayaAdmin.toLocaleString('id-ID')}` : null,
    `Total Pengembalian: Rp ${Math.round(calculation.totalPengembalian).toLocaleString('id-ID')}`
  ].filter(Boolean).join(', ');
  
  return userKeterangan 
    ? `${userKeterangan} (${detailKeterangan})`
    : detailKeterangan;
}
