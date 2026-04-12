
import { db } from "@/db/db";
import { formatReferenceNumber, extractNumericSuffix } from "@/utils/idUtils";

/**
 * Generate a new human-readable transaksi reference number
 * Format: TR/YYYY/MM/NNNN
 */
export async function generateTransaksiNumber(): Promise<string> {
  // We need to find the latest sequence number
  // Since we are using UUIDs as PK now, we scan all transactions to find the max nomorTransaksi suffix
  const allTransaksi = await db.transaksi.toArray();
  const today = new Date();
  
  const existingNumbers = allTransaksi
    .map(t => extractNumericSuffix(t.nomorTransaksi || t.id))
    .filter(n => !isNaN(n));
    
  const lastSeq = existingNumbers.length > 0 ? Math.max(...existingNumbers) : 0;
  
  return formatReferenceNumber({
    prefix: "TR",
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    sequence: lastSeq + 1,
    padding: 6
  });
}

/**
 * Legacy compatibility: generateTransaksiId now returns a UUID v7
 * But for internal consistency, it's better to use generateUUIDv7 directly.
 */
export { generateUUIDv7 } from "@/utils/idUtils";

export async function generateTransaksiId(): Promise<string> {
  return generateUUIDv7();
}
