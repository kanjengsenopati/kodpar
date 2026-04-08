
import { getFromLocalStorage, saveToLocalStorage } from "../../utils/localStorage";
import { Transaksi } from "@/types";
import { initialTransaksi } from "./initialData";

export const TRANSAKSI_KEY = "koperasi_transaksi";

/**
 * Get all items from local storage
 */
export function getAllItems<T>(key: string, initialData: T[]): T[] {
  return getFromLocalStorage<T[]>(key, initialData);
}

/**
 * Get all transaksi directly from local storage
 * This is used by the ID generator to avoid circular dependencies
 */
export function getAllTransaksiFromStorage(): Transaksi[] {
  return getFromLocalStorage<Transaksi[]>(TRANSAKSI_KEY, initialTransaksi);
}

/**
 * Save items to local storage
 */
export function saveItems<T>(key: string, items: T[]): void {
  saveToLocalStorage(key, items);
}
