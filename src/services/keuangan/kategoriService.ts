
import { KategoriTransaksi } from "@/types";
import { 
  KATEGORI_TRANSAKSI_KEY, 
  getStorageData, 
  saveStorageData,
  initialKategoriTransaksi
} from "./baseService";

/**
 * Get all transaction categories
 */
export function getAllKategoriTransaksi(): KategoriTransaksi[] {
  return getStorageData<KategoriTransaksi[]>(KATEGORI_TRANSAKSI_KEY, initialKategoriTransaksi);
}

/**
 * Get category by ID
 */
export function getKategoriTransaksiById(id: string): KategoriTransaksi | undefined {
  const categories = getAllKategoriTransaksi();
  return categories.find(category => category.id === id);
}

/**
 * Generate new category ID
 */
export function generateKategoriTransaksiId(): string {
  const categories = getAllKategoriTransaksi();
  const lastId = categories.length > 0
    ? parseInt(categories[categories.length - 1].id.replace("KT", ""))
    : 0;
  
  return `KT${String(lastId + 1).padStart(4, "0")}`;
}

/**
 * Create new transaction category
 */
export function createKategoriTransaksi(category: Omit<KategoriTransaksi, "id">): KategoriTransaksi {
  const categories = getAllKategoriTransaksi();
  
  const newCategory: KategoriTransaksi = {
    ...category,
    id: generateKategoriTransaksiId()
  };
  
  categories.push(newCategory);
  saveStorageData(KATEGORI_TRANSAKSI_KEY, categories);
  
  return newCategory;
}

/**
 * Update transaction category
 */
export function updateKategoriTransaksi(id: string, category: Partial<KategoriTransaksi>): KategoriTransaksi | null {
  const categories = getAllKategoriTransaksi();
  const index = categories.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  categories[index] = {
    ...categories[index],
    ...category
  };
  
  saveStorageData(KATEGORI_TRANSAKSI_KEY, categories);
  return categories[index];
}

/**
 * Delete transaction category
 */
export function deleteKategoriTransaksi(id: string): boolean {
  const categories = getAllKategoriTransaksi();
  const filteredCategories = categories.filter(c => c.id !== id);
  
  if (filteredCategories.length === categories.length) return false;
  
  saveStorageData(KATEGORI_TRANSAKSI_KEY, filteredCategories);
  return true;
}

/**
 * Get categories by type
 */
export function getKategoriTransaksiByJenis(jenis: "Pemasukan" | "Pengeluaran"): KategoriTransaksi[] {
  const categories = getAllKategoriTransaksi();
  return categories.filter(c => c.jenis === jenis);
}
