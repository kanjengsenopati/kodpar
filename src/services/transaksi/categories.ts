
// Simpanan Categories
export enum SimpananCategory {
  WAJIB = "Wajib",
  POKOK = "Pokok",
  SUKARELA = "Sukarela",
  KHUSUS = "Khusus",
  WISATA = "Wisata"
}

// Pinjaman Categories
export enum PinjamanCategory {
  REGULER = "Reguler",
  SERTIFIKASI = "Sertifikasi",
  MUSIMAN = "Musiman"
}

// Get all simpanan categories as array
export const getSimpananCategories = (): string[] => {
  return Object.values(SimpananCategory);
};

// Get all pinjaman categories as array
export const getPinjamanCategories = (): string[] => {
  return Object.values(PinjamanCategory);
};

// Default interest rates by pinjaman category
export const defaultPinjamanInterestRates = {
  [PinjamanCategory.REGULER]: 1.5,    // 1.5% per month
  [PinjamanCategory.SERTIFIKASI]: 1.0, // 1.0% per month
  [PinjamanCategory.MUSIMAN]: 2.0      // 2.0% per month
};
