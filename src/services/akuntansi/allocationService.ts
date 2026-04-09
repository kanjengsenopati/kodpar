import { getPengaturan } from "../pengaturanService";

/**
 * Allocation service for angsuran calculations - Pure DB Driven
 */

export interface AngsuranAllocation {
  pokok: number;
  jasa: number; // Changed 'bunga' to 'jasa' for SAK EP consistency
  total: number;
  nominalJasa: number;
  nominalPokok: number;
  sukuBungaPersen: number;
}

export function calculateAngsuranAllocation(
  pinjaman: any, 
  totalAngsuran: number
): AngsuranAllocation {
  const settings = getPengaturan();
  
  // 1. Get structured rate from loan or fall back to authorized settings
  const sukuBungaPersen = pinjaman.sukuBunga || settings.sukuBunga.pinjaman || 0;
  
  // 2. Calculate monthly interest (jasa) using the amortized principal or total amount
  // SAK EP Rule: Nominal Jasa = Principal * Rate
  const remainingPrincipal = pinjaman.jumlah || totalAngsuran;
  const nominalJasa = Math.round(remainingPrincipal * (sukuBungaPersen / 100));
  
  // 3. Principal payment is the remainder of the installment
  const nominalPokok = Math.max(0, totalAngsuran - nominalJasa);
  
  return {
    pokok: nominalPokok,
    jasa: nominalJasa,
    total: totalAngsuran,
    nominalJasa: nominalJasa,
    nominalPokok: nominalPokok,
    sukuBungaPersen: sukuBungaPersen
  };
}
