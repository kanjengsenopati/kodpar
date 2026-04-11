
import { useState } from "react";
import { PersyaratanDokumen } from "@/types";
import { getAllJenis } from "@/services/jenisService";
import { getPengaturan } from "@/services/pengaturanService";

interface PengajuanFormData {
  tanggal: string;
  anggotaId: string;
  jenis: "Simpan" | "Pinjam" | "Penarikan";
  kategori: string;
  jumlah: number;
  keterangan: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  tenor?: number;
  dokumen?: PersyaratanDokumen[];
}

export function usePengajuanFormState(initialFormData: PengajuanFormData) {
  const pengaturan = getPengaturan();
  
  // Set default category based on jenis
  const getDefaultCategory = (jenis: "Simpan" | "Pinjam" | "Penarikan") => {
    const all = getAllJenis();
    if (jenis === "Pinjam") {
      return all.find(j => j.jenisTransaksi === "Pinjaman" && j.isActive)?.id || "";
    } else if (jenis === "Penarikan") {
      return ""; // No standard ID for generic withdrawal yet
    }
    return all.find(j => j.jenisTransaksi === "Simpanan" && j.isActive)?.id || "";
  };

  const [formData, setFormData] = useState<PengajuanFormData>({
    ...initialFormData,
    kategori: initialFormData.kategori || getDefaultCategory(initialFormData.jenis),
    tenor: initialFormData.tenor || (initialFormData.jenis === "Pinjam" ? pengaturan?.tenor?.defaultTenor || 12 : undefined),
    dokumen: initialFormData.dokumen || []
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === "jumlah" ? Number(value) : value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === "jenis") {
      // When jenis changes, we need to reset kategori and set it to a valid default based on the new type
      let defaultCategory = "";
      const all = getAllJenis();
      if (value === "Simpan") {
        defaultCategory = all.find(j => j.jenisTransaksi === "Simpanan" && j.isActive)?.id || "";
      } else if (value === "Pinjam") {
        defaultCategory = all.find(j => j.jenisTransaksi === "Pinjaman" && j.isActive)?.id || "";
      }
      
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as "Simpan" | "Pinjam" | "Penarikan",
        kategori: defaultCategory,
        tenor: value === "Pinjam" ? pengaturan?.tenor?.defaultTenor || 12 : undefined,
        dokumen: [] // Reset documents when changing application type
      }));
    } else if (name === "status") {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as "Menunggu" | "Disetujui" | "Ditolak" 
      }));
    } else if (name === "kategori") {
      // Reset documents when changing category
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        dokumen: []
      }));
    } else if (name === "tenor") {
      setFormData(prev => ({ 
        ...prev, 
        [name]: parseInt(value)
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleDokumenChange = (dokumen: PersyaratanDokumen[]) => {
    setFormData(prev => ({
      ...prev,
      dokumen
    }));
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSelectChange,
    handleDokumenChange
  };
}
