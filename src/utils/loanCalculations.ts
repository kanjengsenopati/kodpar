
import { getPengaturan } from "@/services/pengaturanService";

export interface LoanCalculation {
  sukuBunga: number;
  nominalPokok: number;
  nominalJasa: number;
  totalNominalJasa: number;
  totalPengembalian: number;
  tenor: number;
  angsuranPerBulan: number;
}

export function calculateLoanDetails(kategori: string, jumlah: number, tenor?: number): LoanCalculation {
  const pengaturan = getPengaturan();
  
  // Get interest rate for category
  let sukuBunga = pengaturan?.sukuBunga?.pinjaman || 1;
  if (pengaturan?.sukuBunga?.pinjamanByCategory && kategori in pengaturan.sukuBunga.pinjamanByCategory) {
    sukuBunga = pengaturan.sukuBunga.pinjamanByCategory[kategori];
  }

  // Use provided tenor or default
  const selectedTenor = tenor || pengaturan?.tenor?.defaultTenor || pengaturan?.tenor?.tenorOptions?.[1] || 12;

  // Calculate loan values (flat rate)
  const nominalPokok = jumlah;
  const nominalJasa = (nominalPokok * sukuBunga / 100); // Per month
  const totalNominalJasa = nominalJasa * selectedTenor;
  const totalPengembalian = nominalPokok + totalNominalJasa;
  const angsuranPerBulan = Math.ceil(totalPengembalian / selectedTenor);

  return {
    sukuBunga,
    nominalPokok,
    nominalJasa,
    totalNominalJasa,
    totalPengembalian,
    tenor: selectedTenor,
    angsuranPerBulan
  };
}

export function generateLoanDescription(calculation: LoanCalculation, userKeterangan?: string): string {
  const detailKeterangan = [
    `Rate Suku Bunga: ${calculation.sukuBunga}% per bulan`,
    `Nominal Pokok: Rp ${calculation.nominalPokok.toLocaleString('id-ID')}`,
    `Nominal Jasa per Bulan: Rp ${calculation.nominalJasa.toLocaleString('id-ID')}`,
    `Total Nominal Jasa: Rp ${calculation.totalNominalJasa.toLocaleString('id-ID')}`,
    `Total Pengembalian: Rp ${calculation.totalPengembalian.toLocaleString('id-ID')}`,
    `Jumlah Tenor: ${calculation.tenor} bulan`,
    `Angsuran per Bulan: Rp ${calculation.angsuranPerBulan.toLocaleString('id-ID')}`
  ].join(', ');
  
  return userKeterangan 
    ? `${userKeterangan} (${detailKeterangan})`
    : detailKeterangan;
}
