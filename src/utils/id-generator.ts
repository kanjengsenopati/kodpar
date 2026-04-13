/**
 * Client-Side UUID v7 Generator
 * Optimized for Vite + IndexedDB and future Fastify sync.
 *
 * UUID v7 are time-ordered, allowing better database indexing performance
 * and natural chronological sorting.
 */

let lastTimestamp = 0;
let sequence = 0;

/**
 * Generates a UUID V7 string.
 * @returns {string} The generated UUID v7.
 */
export function generateUUIDv7() {
  const now = Date.now();

  // Handle sub-millisecond sequence to prevent collisions in high-concurrency
  if (now <= lastTimestamp) {
    sequence++;
  } else {
    lastTimestamp = now;
    sequence = 0;
  }

  // 1. Timestamp (48 bits)
  const ts = now.toString(16).padStart(12, '0');

  // 2. Version (4) and Sequence (12 bits)
  // Version 7 is '7xxx'
  const verAndSeq = (0x7000 | (sequence & 0x0FFF)).toString(16).padStart(4, '0');

  // 3. Variant and Random bits (64 bits total)
  // Variant 2 is '8xxx', '9xxx', 'axxx', or 'bxxx'
  const randomValues = new Uint32Array(2);

  // Use Web Crypto API for better randomness
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    // Fallback for older environments or non-browser contexts
    randomValues[0] = Math.floor(Math.random() * 0x100000000);
    randomValues[1] = Math.floor(Math.random() * 0x100000000);
  }

  const varAndRand = (0x8000 | (randomValues[0] & 0x3FFF)).toString(16).padStart(4, '0');
  const randRest = randomValues[1].toString(16).padStart(8, '0');
  const randExtra = Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0');

  return `${ts.slice(0, 8)}-${ts.slice(8, 12)}-${verAndSeq}-${varAndRand}-${randRest}${randExtra}`;
}

/**
 * Utility to validate if a string is a valid UUID
 */
export function isValidUUID(uuid) {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[7][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}
