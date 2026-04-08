
/**
 * Allocation service for angsuran calculations
 */

export interface AngsuranAllocation {
  pokok: number;
  bunga: number;
  total: number;
  nominalJasa: number;
  nominalPokok: number;
  sukuBungaPersen: number;
}

export function calculateAngsuranAllocation(
  pinjaman: any, 
  totalAngsuran: number, 
  anggotaId?: string
): AngsuranAllocation {
  // Get remaining loan amount and interest rate from the loan
  const remainingAmount = pinjaman.jumlah || totalAngsuran;
  const sukuBungaPersen = 10; // Default 10% monthly interest
  
  // Calculate monthly interest (jasa) based on remaining principal
  const nominalJasa = Math.round(remainingAmount * (sukuBungaPersen / 100));
  
  // Principal payment is the remainder after interest
  const nominalPokok = Math.max(0, totalAngsuran - nominalJasa);
  
  return {
    pokok: nominalPokok,
    bunga: nominalJasa,
    total: totalAngsuran,
    nominalJasa: nominalJasa,
    nominalPokok: nominalPokok,
    sukuBungaPersen: sukuBungaPersen
  };
}
