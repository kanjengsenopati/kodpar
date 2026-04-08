
// POS Types
export interface ProdukItem {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  hargaBeli: number;
  hargaJual: number;
  stok: number;
  satuan: string;
  deskripsi?: string;
  gambar?: string;
  createdAt: string;
}

export interface Kasir {
  id: string;
  nama: string;
  noHp: string;
  username: string;
  role: "admin" | "kasir";
  aktif: boolean;
  createdAt: string;
}

export interface PenjualanItem {
  produkId: string;
  jumlah: number;
  hargaSatuan: number;
  total: number;
  diskon?: number;
}

export interface Penjualan {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  kasirId: string;
  items: PenjualanItem[];
  subtotal: number;
  diskon?: number;
  pajak?: number;
  total: number;
  dibayar: number;
  kembalian: number;
  metodePembayaran: "cash" | "debit" | "kredit" | "qris";
  status: "sukses" | "dibatalkan";
  catatan?: string;
  createdAt: string;
}

// Pembelian (Purchase) Types
export interface PembelianItem {
  produkId: string;
  produkNama: string;
  jumlah: number;
  hargaSatuan: number;
  total: number;
}

export interface Pembelian {
  id: string;
  nomorTransaksi: string;
  tanggal: string;
  pemasokId?: string;
  pemasok: string;
  items: PembelianItem[];
  subtotal: number;
  diskon?: number;
  ppn?: number;
  total: number;
  status: "selesai" | "proses" | "dibatalkan";
  catatan?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Pemasok {
  id: string;
  nama: string;
  alamat?: string;
  telepon?: string;
  email?: string;
  kontak?: string;
  createdAt: string;
}
