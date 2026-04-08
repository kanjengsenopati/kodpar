
import { getAllTransaksiFromStorage } from "./baseService";

/**
 * Generate a new transaksi ID with proper formatting
 * Format: TR000001, TR000002, etc.
 */
export function generateTransaksiId(): string {
  const transaksiList = getAllTransaksiFromStorage();
  const lastId = transaksiList.length > 0
    ? parseInt(transaksiList[transaksiList.length - 1].id.replace("TR", ""))
    : 0;
  const newId = `TR${String(lastId + 1).padStart(6, "0")}`;
  return newId;
}
