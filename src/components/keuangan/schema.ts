
import * as z from 'zod';

export const transactionFormSchema = z.object({
  tanggal: z.date({
    required_error: 'Tanggal harus diisi',
  }),
  kategori: z.string().min(1, { message: 'Kategori harus dipilih' }),
  jumlah: z.number().min(1, { message: 'Jumlah harus lebih dari 0' }),
  keterangan: z.string().optional(),
  jenis: z.enum(['Pemasukan', 'Pengeluaran'], {
    required_error: 'Jenis transaksi harus dipilih',
  }),
  bukti: z.string().optional(),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
