export interface PinjamanFormData {
  jumlah: string;
  keterangan: string;
  jenisId: string; // The UUID of the loan type
}

export interface PinjamanFormProps {
  anggotaId: string;
  onClose: () => void;
  isOpen: boolean;
  onSubmit: (formData: PinjamanFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface PinjamanFormSummaryProps {
  jenisId: string;
  jumlah: string;
}
