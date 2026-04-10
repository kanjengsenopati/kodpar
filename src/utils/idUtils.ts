
/**
 * Utility for generating UUID v7 and formatted reference numbers.
 * UUID v7 is time-ordered, making it ideal for primary keys in databases like PostgreSQL (NeonDB).
 */

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

/**
 * Interface for Reference Number components
 */
export interface RefNumberParts {
  prefix: string;
  year?: number;
  month?: number;
  sequence: number;
  padding?: number;
}

/**
 * Generates a formatted human-readable reference number.
 * Example: PG/2026/04/0001
 */
export function formatReferenceNumber(parts: RefNumberParts): string {
  const { prefix, year, month, sequence, padding = 4 } = parts;
  
  const components: string[] = [prefix];
  
  if (year) components.push(year.toString());
  if (month) components.push(month.toString().padStart(2, '0'));
  
  components.push(sequence.toString().padStart(padding, '0'));
  
  return components.join('/');
}

/**
 * Safe numeric extraction for legacy ID strings
 * Useful for migration or finding the max sequence in existing data.
 */
export function extractNumericSuffix(id: string): number {
  if (!id) return 0;
  const match = id.match(/\d+$/);
  return match ? parseInt(match[0]) : 0;
}
