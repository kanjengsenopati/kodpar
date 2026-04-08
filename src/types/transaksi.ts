
// Transaksi (Transaction) types
export interface Transaksi {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  jenis: "Simpan" | "Pinjam" | "Angsuran" | "Penarikan";
  jumlah: number | null;
  tanggal: string;
  kategori?: string;
  keterangan?: string;
  status: "Sukses" | "Pending" | "Gagal";
  createdAt: string;
  updatedAt: string;
}

export interface Pengajuan {
  id: string;
  anggotaId: string;
  anggotaNama: string;
  jenis: "Simpan" | "Pinjam" | "Penarikan";
  jumlah: number;
  tanggal: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  kategori: string;
  keterangan?: string;
  dokumen?: PersyaratanDokumen[];
  createdAt: string;
  updatedAt: string;
}

// Document requirements for loan applications
export interface PersyaratanDokumen {
  id: string;
  jenis: "KTP" | "KK" | "Sertifikat Tanah" | "Sertifikat Sertifikasi" | "Buku Rekening" | "ATM Sertifikasi";
  file: string | null; // base64 string
  namaFile: string;
  required: boolean;
  kategori: "Reguler" | "Sertifikasi" | "Musiman" | "All";
}
