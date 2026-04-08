import { Pengaturan } from "../types";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import { PinjamanCategory, defaultPinjamanInterestRates } from "./transaksi/categories";

const PENGATURAN_KEY = "koperasi_pengaturan";

// Default pengaturan initial data with Dana Resiko Kredit and Simpanan Wajib Kredit enabled by default
const initialPengaturan: Pengaturan = {
  sukuBunga: {
    pinjaman: 1.5, // 1.5% per bulan 
    simpanan: 0.5, // 0.5% per bulan
    metodeBunga: "flat", // Set flat as default method
    pinjamanByCategory: {
      [PinjamanCategory.REGULER]: 1.5,    // 1.5% per month
      [PinjamanCategory.SERTIFIKASI]: 1.0, // 1.0% per month
      [PinjamanCategory.MUSIMAN]: 2.0      // 2.0% per month
    },
    danaResikoKredit: {
      enabled: true,  // Set as active by default
      persentase: 2.0,
      autoDeduction: true
    },
    simpananWajibKredit: {
      enabled: true,  // Set as active by default
      persentase: 5.0,
      autoDeduction: true
    }
  },
  tenor: {
    minTenor: 3,     // minimum 3 bulan
    maxTenor: 36,    // maximum 36 bulan
    defaultTenor: 12, // default 12 bulan
    tenorOptions: [3, 6, 12, 18, 24, 36]
  },
  denda: {
    persentase: 0.1, // 0.1% per hari
    gracePeriod: 3,  // 3 hari masa tenggang
    metodeDenda: "harian"
  },
  shu: {
    formula: "simpanan_khusus * 0.03 + simpanan_wajib * 0.05 + pendapatan * 0.02", // Default SHU formula
    thrFormula: "lama_keanggotaan * 100000 + simpanan_pokok * 0.02", // Default THR formula
    minValue: "0",
    maxValue: "10000000",
    distribution: {
      rekening_penyimpan: 25,       // 25%
      rekening_berjasa: 25,         // 25%
      pengurus: 10,                 // 10%
      dana_karyawan: 5,             // 5%
      dana_pendidikan: 10,          // 10%
      dana_pembangunan_daerah: 2.5, // 2.5%
      dana_sosial: 2.5,             // 2.5%
      cadangan: 20                  // 20%
    },
    formulaComponents: [
      {
        id: "default-1",
        name: "Rumus Simpanan",
        formula: "simpanan_khusus * 0.03 + simpanan_wajib * 0.05",
        description: "Rumus berdasarkan simpanan anggota",
        formulaType: "shu"
      },
      {
        id: "default-2",
        name: "Rumus Pendapatan",
        formula: "pendapatan * 0.02",
        description: "Rumus berdasarkan pendapatan anggota",
        formulaType: "shu"
      },
      {
        id: "default-3",
        name: "Rumus THR Dasar",
        formula: "lama_keanggotaan * 100000",
        description: "Rumus dasar THR berdasarkan lama keanggotaan",
        formulaType: "thr"
      }
    ],
    customVariables: [] // Reset to empty array
  },
  profil: {
    namaKoperasi: "Koperasi-ERP",
    alamat: "",
    telepon: ""
  },
  notifications: {
    emailEnabled: true,
    pushEnabled: true,
    smsEnabled: false,
    transactionAlerts: true,
    dueDateReminders: true,
    systemUpdates: false,
    marketingEmails: false,
    reminderTiming: "3",
    emailFrequency: "immediate"
  }
};

/**
 * Get pengaturan from local storage
 */
export function getPengaturan(): Pengaturan {
  return getFromLocalStorage<Pengaturan>(PENGATURAN_KEY, initialPengaturan);
}

/**
 * Save pengaturan to local storage
 */
export function savePengaturan(pengaturan: Pengaturan): void {
  saveToLocalStorage(PENGATURAN_KEY, pengaturan);
}

/**
 * Update specific pengaturan fields
 */
export function updatePengaturan(updatedFields: Partial<Pengaturan>): Pengaturan {
  const currentPengaturan = getPengaturan();
  
  // Deep merge the current pengaturan with the updated fields
  const updatedPengaturan = {
    ...currentPengaturan,
    ...updatedFields,
    sukuBunga: {
      ...currentPengaturan.sukuBunga,
      ...(updatedFields.sukuBunga || {})
    },
    tenor: {
      ...currentPengaturan.tenor,
      ...(updatedFields.tenor || {})
    },
    denda: {
      ...currentPengaturan.denda,
      ...(updatedFields.denda || {})
    },
    shu: {
      ...currentPengaturan.shu,
      ...(updatedFields.shu || {})
    },
    profil: {
      ...currentPengaturan.profil,
      ...(updatedFields.profil || {})
    },
    notifications: {
      ...currentPengaturan.notifications,
      ...(updatedFields.notifications || {})
    }
  };
  
  saveToLocalStorage(PENGATURAN_KEY, updatedPengaturan);
  return updatedPengaturan;
}

/**
 * Reset pengaturan to default values
 */
export function resetPengaturan(): Pengaturan {
  saveToLocalStorage(PENGATURAN_KEY, initialPengaturan);
  return initialPengaturan;
}

/**
 * Reset specific section of settings to default
 */
export function resetPengaturanSection(section: keyof Pengaturan): Pengaturan {
  const currentPengaturan = getPengaturan();
  
  // Create updated pengaturan with specified section reset to defaults
  const updatedPengaturan = {
    ...currentPengaturan,
    [section]: initialPengaturan[section]
  };
  
  saveToLocalStorage(PENGATURAN_KEY, updatedPengaturan);
  return updatedPengaturan;
}

/**
 * Reset only custom variables in SHU settings
 */
export function resetSHUCustomVariables(): Pengaturan {
  const currentPengaturan = getPengaturan();
  
  const updatedPengaturan = {
    ...currentPengaturan,
    shu: {
      ...currentPengaturan.shu,
      customVariables: [] // Reset to empty array
    }
  };
  
  saveToLocalStorage(PENGATURAN_KEY, updatedPengaturan);
  return updatedPengaturan;
}

/**
 * Get default officer name for receipts and documents
 */
export function getDefaultOfficerName(): string {
  return "Retno";
}
