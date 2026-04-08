
import { Anggota, Transaksi } from "@/types";

export interface PinjamanFormProps {
  anggotaList: Anggota[];
  initialData?: Transaksi;
  onSuccess?: () => void;
}

export interface PinjamanFormData {
  tanggal: string;
  anggotaId: string;
  jumlah: number;
  jumlahPinjaman: string;
  formattedJumlah: string;
  tenor: number;
  kategori: string;
  bunga: number;
  angsuran: number;
  keterangan: string;
  angsuranPerBulan: number;
  totalBunga: number;
  totalPengembalian: number;
  jatuhTempo: string;
}

export interface AnggotaSelectorProps {
  anggotaList: Anggota[];
  selectedAnggotaId: string;
  onChange: (anggotaId: string) => void;
  disabled?: boolean;
}

export interface KategoriSelectorProps {
  selectedKategori: string;
  onChange: (kategori: string) => void;
}

export interface JumlahInputProps {
  value: string;
  onChange: (value: string, formatted: string) => void;
}

export interface PinjamanParametersProps {
  tanggal: string;
  tenor: number;
  bunga: number;
  onChange: (field: "tanggal" | "tenor" | "bunga", value: number | string) => void;
}

export interface KeteranganInputProps {
  value: string;
  onChange: (keterangan: string) => void;
}

export interface LoanSummaryProps {
  angsuranPerBulan: number;
  totalBunga: number;
  totalPengembalian: number;
  jatuhTempo: string;
}

export interface FormHeaderProps {
  isEditMode: boolean;
}

export interface FormActionsProps {
  isSubmitting: boolean;
  isEditMode: boolean;
}
