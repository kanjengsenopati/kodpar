
/**
 * Calculate angsuran bulanan (monthly payment)
 */
export const calculateAngsuran = (pokok: number, tenor: number, bunga: number): number => {
  if (!pokok || !tenor || tenor <= 0) return 0;
  
  // Simple flat rate calculation
  const bungaPerBulan = (pokok * bunga / 100);
  const totalBunga = bungaPerBulan * tenor;
  const totalBayar = pokok + totalBunga;
  return Math.ceil(totalBayar / tenor);
};
