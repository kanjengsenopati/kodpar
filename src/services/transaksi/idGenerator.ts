
import { db } from "@/db/db";

/**
 * Generate a new transaksi ID with proper formatting (Asynchronous)
 * Reads directly from IndexedDB and implements a collision-check loop to prevent duplicate key collisions
 * Format: TR000001, TR000002, etc.
 */
export async function generateTransaksiId(): Promise<string> {
  // Get all transaksi IDs to find the true numeric maximum
  const allIds = await db.transaksi.toCollection().primaryKeys();
  
  let maxNumber = 0;
  
  for (const id of allIds) {
    if (typeof id === 'string' && id.startsWith('TR')) {
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
  
  // High-stakes verification: check if this ID already exists (race condition check)
  const exists = await db.transaksi.get(newId);
  if (exists) {
    console.warn(`⚠️ ID Collision detected for ${newId}, retrying generation...`);
    // Recursive retry with a random delay to allow other concurrent transactions to commit
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 50) + 10));
    return await generateTransaksiId();
  }
  
  return newId;
}
