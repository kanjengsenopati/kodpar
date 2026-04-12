
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

let lastMs = 0;
let seq = 0;

/**
 * Generates a UUID v7 (Time-ordered UUID)
 * Structure: 48-bit timestamp | 4-bit version (7) | 12-bit seq | 2-bit variant (2) | 62-bit random
 */
export function generateUUIDv7(): string {
  const now = Date.now();
  
  if (now <= lastMs) {
    seq++;
  } else {
    lastMs = now;
    seq = 0;
  }

  // 48-bit timestamp
  const ts = now.toString(16).padStart(12, '0');
  
  // 4-bit version (7) + 12-bit sequence
  const verSeq = (0x7000 | (seq & 0x0FFF)).toString(16).padStart(4, '0');
  
  // 2-bit variant (8, 9, a, or b) + 62-bit random
  const varRand = (0x8000 | (Math.floor(Math.random() * 0x3FFF))).toString(16).padStart(4, '0');
  const rand = Array.from({ length: 3 }, () => 
    Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0')
  ).join('');

  return `${ts.slice(0, 8)}-${ts.slice(8, 12)}-${verSeq}-${varRand}-${rand}`;
}

export async function generateTransaksiId(): Promise<string> {
  return generateUUIDv7();
}
