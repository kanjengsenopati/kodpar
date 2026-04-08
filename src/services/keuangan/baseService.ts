
import { KategoriTransaksi, PemasukanPengeluaran } from "@/types";
import { getFromLocalStorage, saveToLocalStorage } from "@/utils/localStorage";

export const KATEGORI_TRANSAKSI_KEY = "koperasi_kategori_transaksi";
export const PEMASUKAN_PENGELUARAN_KEY = "koperasi_pemasukan_pengeluaran";

// Enhanced initial categories with auto-deduction categories
export const initialKategoriTransaksi: KategoriTransaksi[] = [
  {
    id: "KT0001",
    nama: "Penjualan Produk",
    jenis: "Pemasukan",
    deskripsi: "Pendapatan dari penjualan produk koperasi"
  },
  {
    id: "KT0002", 
    nama: "Biaya Operasional",
    jenis: "Pengeluaran",
    deskripsi: "Biaya untuk operasional harian koperasi"
  },
  {
    id: "KT0003",
    nama: "Dana Resiko Kredit",
    jenis: "Pemasukan",
    deskripsi: "Dana cadangan untuk resiko kredit dari pinjaman anggota (auto-generated)"
  },
  {
    id: "KT0004",
    nama: "Simpanan Wajib Kredit", 
    jenis: "Pemasukan",
    deskripsi: "Simpanan wajib yang dipotong dari pinjaman anggota (auto-generated)"
  },
  {
    id: "KT0005",
    nama: "Pendapatan Jasa",
    jenis: "Pemasukan", 
    deskripsi: "Pendapatan dari jasa layanan koperasi"
  },
  {
    id: "KT0006",
    nama: "Biaya Administrasi",
    jenis: "Pengeluaran",
    deskripsi: "Biaya administrasi dan pengelolaan"
  }
];

export const initialPemasukanPengeluaran: PemasukanPengeluaran[] = [];

/**
 * Get data from localStorage with fallback to initial data
 */
export function getStorageData<T>(key: string, initialData: T): T {
  return getFromLocalStorage<T>(key, initialData);
}

/**
 * Save data to localStorage
 */
export function saveStorageData<T>(key: string, data: T): void {
  saveToLocalStorage(key, data);
}

/**
 * Ensure required categories exist for auto-deduction
 */
export function ensureAutoDeductionCategories(): void {
  const categories = getStorageData<KategoriTransaksi[]>(KATEGORI_TRANSAKSI_KEY, initialKategoriTransaksi);
  let hasChanges = false;

  // Check if Dana Resiko Kredit category exists
  const danaResikoExists = categories.some(cat => cat.nama === "Dana Resiko Kredit");
  if (!danaResikoExists) {
    categories.push({
      id: `KT${String(categories.length + 1).padStart(4, "0")}`,
      nama: "Dana Resiko Kredit",
      jenis: "Pemasukan",
      deskripsi: "Dana cadangan untuk resiko kredit dari pinjaman anggota (auto-generated)"
    });
    hasChanges = true;
  }

  // Check if Simpanan Wajib Kredit category exists
  const simpananWajibExists = categories.some(cat => cat.nama === "Simpanan Wajib Kredit");
  if (!simpananWajibExists) {
    categories.push({
      id: `KT${String(categories.length + 1).padStart(4, "0")}`,
      nama: "Simpanan Wajib Kredit", 
      jenis: "Pemasukan",
      deskripsi: "Simpanan wajib yang dipotong dari pinjaman anggota (auto-generated)"
    });
    hasChanges = true;
  }

  if (hasChanges) {
    saveStorageData(KATEGORI_TRANSAKSI_KEY, categories);
    console.log('Auto-deduction categories ensured in system');
  }
}
