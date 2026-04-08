
import { Transaksi } from "@/types";

export interface AngsuranListProps {
  pinjamanTransaksi: Transaksi[];
  disableSelfPayment?: boolean;
}

export interface AngsuranDetailItem {
  angsuranKe: number;
  jatuhTempo: string;
  jumlah: number;
  status: "lunas" | "belum-bayar" | "terlambat" | "bayar-sebagian" | "bayar-lengkap" | "belum-terbayar";
  tanggalBayar?: string;
  petugas?: string;
  metodePembayaran?: string;
  jumlahDibayar?: number;
}

export interface LoanSelectorProps {
  pinjamanTransaksi: Transaksi[];
  selectedPinjaman: string;
  onLoanSelect: (pinjamanId: string) => void;
}

// This is kept for backwards compatibility
export interface AngsuranDetail {
  nomorAngsuran: number;
  tanggalJatuhTempo: string;
  nominal: number;
  status: "Terbayar" | "Belum Terbayar";
  transaksiId?: string;
}
