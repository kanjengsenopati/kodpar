
import { getAllTransaksiFromStorage } from "./baseService";

/**
 * Generate a new transaksi ID with proper formatting
 * Format: TR000001, TR000002, etc.
 */
import { db } from "@/db/db";

/**
 * Generate a new transaksi ID with proper formatting (Asynchronous)
 * Reads directly from IndexedDB to prevent duplicate key collisions
 * Format: TR000001, TR000002, etc.
 */
export async function generateTransaksiId(): Promise<string> {
  // Get the last transaction based on primary key (id)
  const lastTransaksi = await db.transaksi.toCollection().last();
  
  let nextNumber = 1;
  if (lastTransaksi && lastTransaksi.id) {
    // Extract number from TRxxxxxx format
    const lastIdNumber = parseInt(lastTransaksi.id.replace("TR", ""));
    if (!isNaN(lastIdNumber)) {
      nextNumber = lastIdNumber + 1;
    }
  }
  
  const newId = `TR${String(nextNumber).padStart(6, "0")}`;
  return newId;
}
