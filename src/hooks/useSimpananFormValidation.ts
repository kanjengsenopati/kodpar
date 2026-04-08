
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface FormData {
  tanggal: string;
  anggotaId: string;
  kategori: string;
  jumlah: string;
  keterangan: string;
}

export function useSimpananFormValidation() {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: FormData): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.anggotaId) {
      newErrors.anggotaId = "Anggota harus dipilih";
    }

    if (!formData.jumlah) {
      newErrors.jumlah = "Jumlah simpanan harus diisi";
    } else if (parseInt(formData.jumlah) <= 0) {
      newErrors.jumlah = "Jumlah simpanan harus lebih dari 0";
    }

    if (!formData.kategori) {
      newErrors.kategori = "Kategori simpanan harus dipilih";
    }

    if (!formData.tanggal) {
      newErrors.tanggal = "Tanggal harus diisi";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast({
        title: "Data tidak lengkap",
        description: "Harap lengkapi semua field yang wajib diisi",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateForm,
    clearErrors
  };
}
