
// Keuangan (Finance) types
export interface PemasukanPengeluaran {
  id: string;
  tanggal: string;
  kategori: string;
  jumlah: number;
  keterangan: string;
  jenis: "Pemasukan" | "Pengeluaran";
  bukti?: string; // Optional receipt/proof file (base64)
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface KategoriTransaksi {
  id: string;
  nama: string;
  deskripsi?: string;
  jenis: "Pemasukan" | "Pengeluaran";
}

export interface NeracaKeuangan {
  bulan: string;
  tahun: number;
  totalPemasukan: number;
  totalPengeluaran: number;
  saldoAwal: number;
  saldoAkhir: number;
}
