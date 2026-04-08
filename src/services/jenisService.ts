import { Jenis, JenisPengajuan, JenisSimpanan, JenisPinjaman } from "@/types/jenis";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";

const JENIS_KEY = "koperasi_jenis";

// Initial data for the jenis (types)
const initialJenis: Jenis[] = [
  {
    id: "PG001",
    nama: "Pengajuan Simpanan",
    jenisTransaksi: "Pengajuan",
    keterangan: "Pengajuan untuk simpanan baru",
    persyaratan: ["Kartu Identitas"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "PG002",
    nama: "Pengajuan Pinjaman",
    jenisTransaksi: "Pengajuan",
    keterangan: "Pengajuan untuk pinjaman baru",
    persyaratan: ["KTP", "Slip Gaji", "Formulir"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "SP001",
    nama: "Simpanan Pokok",
    jenisTransaksi: "Simpanan",
    keterangan: "Simpanan yang wajib dibayarkan saat menjadi anggota",
    bungaPersen: 0,
    wajib: true,
    untukPeminjam: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "SP002",
    nama: "Simpanan Wajib",
    jenisTransaksi: "Simpanan",
    keterangan: "Simpanan yang dibayarkan secara rutin setiap bulan",
    bungaPersen: 0.5,
    wajib: true,
    untukPeminjam: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "SP003",
    nama: "Simpanan Sukarela",
    jenisTransaksi: "Simpanan",
    keterangan: "Simpanan yang dibayarkan secara sukarela",
    bungaPersen: 1.0,
    wajib: false,
    untukPeminjam: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "PJ001",
    nama: "Pinjaman Reguler",
    jenisTransaksi: "Pinjaman",
    keterangan: "Pinjaman dengan bunga standar",
    bungaPersen: 1.5,
    tenorMin: 3,
    tenorMax: 24,
    maksimalPinjaman: 20000000,
    persyaratan: ["KTP", "Slip Gaji", "Formulir"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "PJ002",
    nama: "Pinjaman Sertifikasi",
    jenisTransaksi: "Pinjaman",
    keterangan: "Pinjaman khusus untuk biaya sertifikasi",
    bungaPersen: 1.0,
    tenorMin: 6,
    tenorMax: 36,
    maksimalPinjaman: 50000000,
    persyaratan: ["KTP", "Slip Gaji", "Formulir", "Bukti Pendaftaran Sertifikasi"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  },
  {
    id: "PJ003",
    nama: "Pinjaman Musiman",
    jenisTransaksi: "Pinjaman",
    keterangan: "Pinjaman jangka pendek untuk musim tertentu",
    bungaPersen: 2.0,
    tenorMin: 1,
    tenorMax: 6,
    maksimalPinjaman: 10000000,
    persyaratan: ["KTP", "Formulir"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true
  }
];

// Get all jenis
export function getAllJenis(): Jenis[] {
  return getFromLocalStorage<Jenis[]>(JENIS_KEY, initialJenis);
}

// Get jenis by ID
export function getJenisById(id: string): Jenis | undefined {
  const all = getAllJenis();
  return all.find(jenis => jenis.id === id);
}

// Get jenis by type
export function getJenisByType(jenisTransaksi: "Pengajuan" | "Simpanan" | "Pinjaman"): Jenis[] {
  const all = getAllJenis();
  return all.filter(jenis => jenis.jenisTransaksi === jenisTransaksi);
}

// Get active jenis by type
export function getActiveJenisByType(jenisTransaksi: "Pengajuan" | "Simpanan" | "Pinjaman"): Jenis[] {
  const all = getAllJenis();
  return all.filter(jenis => jenis.jenisTransaksi === jenisTransaksi && jenis.isActive);
}

// Generate ID for new jenis
function generateJenisId(jenisTransaksi: "Pengajuan" | "Simpanan" | "Pinjaman"): string {
  const all = getAllJenis();
  const prefix = jenisTransaksi === "Pengajuan" ? "PG" : jenisTransaksi === "Simpanan" ? "SP" : "PJ";
  const filtered = all.filter(jenis => jenis.jenisTransaksi === jenisTransaksi);
  const maxId = filtered.length > 0
    ? Math.max(...filtered.map(jenis => parseInt(jenis.id.substring(2))))
    : 0;
  return `${prefix}${String(maxId + 1).padStart(3, "0")}`;
}

// Create a new jenis
export function createJenis(jenis: Omit<Jenis, "id" | "createdAt" | "updatedAt">): Jenis {
  const all = getAllJenis();
  const now = new Date().toISOString();
  
  const newJenis = {
    ...jenis,
    id: generateJenisId(jenis.jenisTransaksi),
    createdAt: now,
    updatedAt: now
  } as Jenis;
  
  saveToLocalStorage(JENIS_KEY, [...all, newJenis]);
  return newJenis;
}

// Update an existing jenis
export function updateJenis(id: string, jenis: Partial<Omit<Jenis, "id" | "createdAt" | "updatedAt" | "jenisTransaksi">>): Jenis | null {
  const all = getAllJenis();
  const index = all.findIndex(j => j.id === id);
  
  if (index === -1) return null;
  
  const updated = {
    ...all[index],
    ...jenis,
    updatedAt: new Date().toISOString()
  } as Jenis;
  
  all[index] = updated;
  saveToLocalStorage(JENIS_KEY, all);
  
  return updated;
}

// Delete a jenis (or set as inactive)
export function deleteJenis(id: string): boolean {
  const all = getAllJenis();
  const index = all.findIndex(j => j.id === id);
  
  if (index === -1) return false;
  
  // Instead of actually deleting, just set isActive to false
  all[index] = { 
    ...all[index], 
    isActive: false,
    updatedAt: new Date().toISOString()
  };
  
  saveToLocalStorage(JENIS_KEY, all);
  return true;
}

// Reset jenis data to initial state
export function resetJenisData(): Jenis[] {
  saveToLocalStorage(JENIS_KEY, initialJenis);
  return initialJenis;
}

// Get simplified list of jenis names for dropdowns
export function getJenisOptions(jenisTransaksi: "Pengajuan" | "Simpanan" | "Pinjaman"): { id: string; nama: string }[] {
  return getActiveJenisByType(jenisTransaksi).map(jenis => ({
    id: jenis.id,
    nama: jenis.nama
  }));
}

// Get jenis with percentage for calculations
export function getJenisWithPercentage(id: string): { bungaPersen?: number } | null {
  const jenis = getJenisById(id);
  if (!jenis) return null;
  
  if (jenis.jenisTransaksi === "Simpanan" || jenis.jenisTransaksi === "Pinjaman") {
    return { bungaPersen: jenis.bungaPersen };
  }
  
  return null;
}
