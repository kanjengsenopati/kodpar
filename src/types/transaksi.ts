
// Transaksi (Transaction) types
export interface Transaksi {
  id: string;
  nomorTransaksi?: string; // Human-readable ID (e.g. TR/2026/0001)
  anggotaId: string;
  jenis: "Simpan" | "Pinjam" | "Angsuran" | "Penarikan";
  jumlah: number;
  tanggal: string;
  kategori?: string;
  keterangan: string;
  status: "Sukses" | "Pending" | "Gagal";
  createdAt: string;
  updatedAt: string;
  
  // Structured Financial Fields (SAK EP & Pure DB Driven)
  tenor?: number;             // Masa pinjaman (bulan)
  sukuBunga?: number;        // Rate bunga (%)
  nominalPokok?: number;     // Porsi pokok
  nominalJasa?: number;      // Porsi jasa/bunga
  referensiPinjamanId?: string; // ID Pinjaman asal (untuk Angsuran)
  sisaSaldoAwal?: number;    // Saldo piutang sebelum transaksi
  petugas?: string;

  // Sync Metadata
  accountingSyncStatus?: 'PENDING' | 'SUCCESS' | 'FAILED';
  lastSyncError?: string;
}

export interface SubmissionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PengajuanHistory {
  id: string;
  tanggal: string;
  aksi: string;
  oleh: string;
  keterangan: string;
}

export interface Pengajuan {
  id: string;
  nomorPengajuan?: string; // Human-readable ID (e.g. PG/2026/0001)
  anggotaId: string;
  jenis: "Simpan" | "Pinjam" | "Penarikan" | "Angsuran";
  jumlah: number;
  tanggal: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  kategori: string;
  keterangan?: string;
  alasanPenolakan?: string; // Reason why application was rejected
  history?: PengajuanHistory[]; // Audit trail of status changes
  dokumen?: PersyaratanDokumen[];
  buktiTransfer?: string; // Base64 image
  referensiPinjamanId?: string; // ID of the loan being paid
  nominalPokok?: number;
  nominalJasa?: number;
  tenor?: number;       // Masa pinjaman (bulan)
  sukuBunga?: number;   // Rate bunga (%)
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

// Persisted Installment Schedule (Database Driven)
export interface JadwalAngsuran {
  id?: string;  // UUID v7 (optional agar kompatibel dengan Omit pattern lama)
  loanId: string;
  anggotaId: string;
  angsuranKe: number;
  periode: string;        // e.g. "Mei 2026"
  tanggalJatuhTempo: string; // ISO String
  nominalPokok: number;
  nominalJasa: number;
  totalTagihan: number;
  status: "BELUM_BAYAR" | "DIBAYAR" | "TERLAMBAT";
  tanggalBayar?: string;  // ISO String when paid
  transaksiId?: string;   // Link to the payment transaction
  createdAt: string;
  updatedAt: string;
}
