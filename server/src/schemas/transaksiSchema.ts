import { z } from 'zod';

/**
 * Strict UUID v7 Regex
 * Format: 8-4-7-4-12
 * Where the 13th character (version) is ALWAYS '7'
 * And the 17th character (variant) is 8, 9, a, or b (variant 2)
 */
const uuidV7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const transaksiSyncSchema = z.object({
  id: z.string().regex(uuidV7Regex, { message: "Harus berupa UUID v7 yang valid" }),
  nomorTransaksi: z.string(),
  tanggal: z.string(),
  jenis: z.enum(['Simpan', 'Pinjam', 'Angsuran', 'Penarikan']),
  kategori: z.string().optional(),
  jumlah: z.number().positive(),
  anggotaId: z.string(),
  keterangan: z.string().optional(),
  nominalPokok: z.number().optional(),
  nominalJasa: z.number().optional()
});

export type TransaksiSyncInput = z.infer<typeof transaksiSyncSchema>;
