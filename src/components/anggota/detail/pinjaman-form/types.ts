
export interface PinjamanFormData {
  jumlah: string;
  keterangan: string;
  kategori: string;
}

export interface PinjamanFormProps {
  anggotaId: string;
  anggotaNama: string;
  onClose: () => void;
  isOpen: boolean;
  onSubmit: (formData: PinjamanFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface PinjamanFormSummaryProps {
  kategori: string;
  jumlah: string;
  bunga: number;
}
