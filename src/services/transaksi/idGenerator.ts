
import { db } from "@/db/db";

/**
 * Generate a new transaksi ID with proper formatting (Asynchronous)
 * Uses efficient Dexie range queries to find the max current ID.
 * Implement an atomic check within a transaction context if provided.
 * Format: TR000001, TR000002, etc.
 */
export async function generateTransaksiId(): Promise<string> {
  // Find the highest TR ID by reverse scanning the primary key index
  // This is way more efficient than loading all IDs into memory
  const lastId = await db.transaksi
    .where('id')
    .startsWith('TR')
    .reverse()
    .limit(1)
    .primaryKeys();

  let maxNumber = 0;
  
  if (lastId.length > 0) {
    const id = lastId[0] as string;
    const match = id.match(/^TR(\d+)$/);
    if (match) {
      maxNumber = parseInt(match[1]);
    }
  }
  
  const nextNumber = maxNumber + 1;
  const newId = `TR${String(nextNumber).padStart(6, "0")}`;
  
  // Double-verify for safety against race conditions outside of transactions
  const exists = await db.transaksi.get(newId);
  if (exists) {
    console.warn(`⚠️ ID Collision detected for ${newId}, retrying generation...`);
    // Recursive retry with a random delay (10-60ms)
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 50) + 10));
    return await generateTransaksiId();
  }
  
  return newId;
}
