
// Pengaturan (Settings) types
export interface Pengaturan {
  sukuBunga: {
    pinjaman: number;
    simpanan: number;
    metodeBunga: "flat" | "menurun";
    pinjamanByCategory: Record<string, number>;
    danaResikoKredit?: {
      enabled: boolean;
      persentase: number;
      autoDeduction: boolean;
    };
    simpananWajibKredit?: {
      enabled: boolean;
      persentase: number;
      autoDeduction: boolean;
    };
  };
  tenor: {
    minTenor: number;
    maxTenor: number;
    defaultTenor: number;
    tenorOptions: number[];
  };
  denda: {
    persentase: number;
    gracePeriod: number;
    metodeDenda: "harian" | "bulanan";
  };
  shu?: {
    formula?: string;
    thrFormula?: string;
    minValue?: string;
    maxValue?: string;
    formulaComponents?: FormulaComponent[];
    customVariables?: CustomVariable[];
    distribution?: SHUDistribution;
  };
  profil?: {
    namaKoperasi: string;
    alamat: string;
    telepon: string;
  };
  notifications?: {
    emailEnabled: boolean;
    pushEnabled: boolean;
    smsEnabled: boolean;
    transactionAlerts: boolean;
    dueDateReminders: boolean;
    systemUpdates: boolean;
    marketingEmails: boolean;
    reminderTiming: string;
    emailFrequency: string;
  };
}

export interface FormulaComponent {
  id: string;
  name: string;
  formula: string;
  description?: string;
  formulaType?: 'shu' | 'thr' | 'general';
}

export interface CustomVariable {
  id: string;
  name: string;
  description: string;
  valueType: "jumlah" | "persentase";
  value: number;
  formula?: string; // Added formula field for custom calculations
}

export interface SHUDistribution {
  rekening_penyimpan: number; // 25%
  rekening_berjasa: number;   // 25%
  pengurus: number;           // 10%
  dana_karyawan: number;      // 5%
  dana_pendidikan: number;    // 10%
  dana_pembangunan_daerah: number; // 2.5%
  dana_sosial: number;        // 2.5%
  cadangan: number;           // 20%
}
