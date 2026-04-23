import { pool } from '../db/connection.js';
import { randomBytes } from 'crypto';

/**
 * Generate next journal number (SAK EP compliant format: JUYYYYMM0001)
 */
export async function generateJurnalNumber(client: any): Promise<string> {
  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0');
  const prefix = `JU${currentYear}${currentMonth}`;

  const sql = `
    SELECT nomor_jurnal
    FROM jurnal
    WHERE nomor_jurnal LIKE $1
    ORDER BY nomor_jurnal DESC
    LIMIT 1;
  `;

  const result = await client.query(sql, [`${prefix}%`]);

  let nextNumber = 1;
  if (result.rows.length > 0) {
    const lastNomor = result.rows[0].nomor_jurnal;
    const lastSuffix = lastNomor.replace(prefix, '');
    nextNumber = (parseInt(lastSuffix) || 0) + 1;
  }

  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
}

/**
 * Generate UUID v7 for database primary keys
 * SAK EP Compliance requires time-ordered IDs
 */
export function generateUUIDv7(): string {
  const now = Date.now(); // 48-bit timestamp
  const tsHex = now.toString(16).padStart(12, '0');

  const randomValues = randomBytes(10); // 80 bits of randomness

  // Set version to 7 (bits 48-51)
  randomValues[0] = (randomValues[0] & 0x0f) | 0x70;
  // Set variant to 2 (bits 64-65)
  randomValues[2] = (randomValues[2] & 0x3f) | 0x80;

  const hex = (b: number) => b.toString(16).padStart(2, '0');

  return `${tsHex.substring(0, 8)}-${tsHex.substring(8, 12)}-${hex(randomValues[0])}${hex(randomValues[1])}-${hex(randomValues[2])}${hex(randomValues[3])}-${hex(randomValues[4])}${hex(randomValues[5])}${hex(randomValues[6])}${hex(randomValues[7])}${hex(randomValues[8])}${hex(randomValues[9])}`;
}
