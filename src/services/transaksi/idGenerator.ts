
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
  // Get all transaksi IDs to find the true numeric maximum
  // We use a prefix filter approach for performance and robustness
  const allIds = await db.transaksi.toCollection().primaryKeys();
  
  let maxNumber = 0;
  
  for (const id of allIds) {
    if (typeof id === 'string' && id.startsWith('TR')) {
      // Specifically target TR followed by exactly 6 digits (TR000001 format)
      // and ignore things like TR_SEED_001
      const match = id.match(/^TR(\d+)$/);
      if (match) {
        const num = parseInt(match[1]);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    }
  }
  
  const nextNumber = maxNumber + 1;
  const newId = `TR${String(nextNumber).padStart(6, "0")}`;
  return newId;
}
