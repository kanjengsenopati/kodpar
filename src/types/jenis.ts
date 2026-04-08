
// Type definitions for Jenis (Types) data

export interface JenisBase {
  id: string;
  nama: string;
  keterangan?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface JenisPengajuan extends JenisBase {
  jenisTransaksi: "Pengajuan";
  persyaratan?: string[];
}

export interface JenisSimpanan extends JenisBase {
  jenisTransaksi: "Simpanan";
  bungaPersen?: number;
  wajib: boolean;
  untukPeminjam?: boolean;
}

export interface JenisPinjaman extends JenisBase {
  jenisTransaksi: "Pinjaman";
  bungaPersen: number;
  tenorMin?: number;
  tenorMax?: number;
  maksimalPinjaman?: number;
  persyaratan?: string[];
}

export type Jenis = JenisPengajuan | JenisSimpanan | JenisPinjaman;
