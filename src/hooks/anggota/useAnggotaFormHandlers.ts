
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { createAnggota, updateAnggota } from "@/services/anggotaService";
import { AnggotaKeluarga, AnggotaDokumen } from "@/types";

interface FormData {
  nama: string;
  nip?: string; // Changed to optional
  alamat: string;
  noHp: string;
  jenisKelamin: "L" | "P";
  agama: string;
  foto: string;
  email: string;
  unitKerja: string; // Changed from array to string
  tanggalRegistrasi: string; // Format: "YYYY-MM"
}

interface HandlerParams {
  isEditMode: boolean;
  id: string | undefined;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  dokumen: AnggotaDokumen[];
  setDokumen: React.Dispatch<React.SetStateAction<AnggotaDokumen[]>>;
  keluarga: AnggotaKeluarga[];
  setKeluarga: React.Dispatch<React.SetStateAction<AnggotaKeluarga[]>>;
  previewImage: string | null;
  setPreviewImage: React.Dispatch<React.SetStateAction<string | null>>;
  isFormDirty: boolean;
  setIsFormDirty: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useAnggotaFormHandlers = ({
  isEditMode,
  id,
  formData,
  setFormData,
  dokumen,
  setDokumen,
  keluarga,
  setKeluarga,
  previewImage,
  setPreviewImage,
  isFormDirty,
  setIsFormDirty,
  isSubmitting,
  setIsSubmitting
}: HandlerParams) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    setIsFormDirty(true);
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === "jenisKelamin") {
      // For jenisKelamin, ensure it's either "L" or "P"
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as "L" | "P" 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setIsFormDirty(true);
  };
  
  const handleImageChange = (imageDataUrl: string) => {
    setPreviewImage(imageDataUrl);
    setFormData(prev => ({ ...prev, foto: imageDataUrl }));
    setIsFormDirty(true);
  };
  
  const handleDokumenChange = (updatedDokumen: AnggotaDokumen[]) => {
    setDokumen(updatedDokumen);
    setIsFormDirty(true);
  };
  
  const handleKeluargaChange = (updatedKeluarga: AnggotaKeluarga[]) => {
    setKeluarga(updatedKeluarga);
    setIsFormDirty(true);
  };
  
  const handleCancel = () => {
    if (isFormDirty) {
      if (window.confirm("Perubahan yang belum disimpan akan hilang. Lanjutkan?")) {
        navigate("/anggota");
      }
    } else {
      navigate("/anggota");
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.nama || !formData.alamat || !formData.noHp || !formData.agama || !formData.unitKerja || !formData.tanggalRegistrasi) {
      toast({
        title: "Data tidak lengkap",
        description: "Harap lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    // Validate date format
    if (!formData.tanggalRegistrasi.includes('-') || formData.tanggalRegistrasi.split('-').length !== 2) {
      toast({
        title: "Format tanggal tidak valid",
        description: "Harap pilih bulan dan tahun registrasi",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const anggotaData = {
        ...formData,
        dokumen,
        keluarga,
        status: 'active',
        tanggalBergabung: new Date().toISOString(),
        tanggalRegistrasi: formData.tanggalRegistrasi, // Keep the YYYY-MM format
        email: formData.email || `${formData.nama.replace(/\s+/g, '').toLowerCase()}@example.com`,
      };
      
      if (isEditMode && id) {
        // Update existing anggota
        const updatedAnggota = updateAnggota(id, anggotaData);
        
        if (updatedAnggota) {
          toast({
            title: "Anggota berhasil diperbarui",
            description: "Data anggota telah berhasil diperbarui",
          });
          navigate(`/anggota/${id}`);
        } else {
          throw new Error("Gagal memperbarui anggota");
        }
      } else {
        // Create new anggota
        const newAnggota = createAnggota(anggotaData);
        
        toast({
          title: "Anggota berhasil ditambahkan",
          description: `Anggota baru dengan ID ${newAnggota.id} telah berhasil disimpan`,
        });
        navigate(`/anggota/${newAnggota.id}`);
      }
      
      // Reset form dirty state after successful submit
      setIsFormDirty(false);
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan data anggota. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleChange,
    handleSelectChange,
    handleImageChange,
    handleDokumenChange,
    handleKeluargaChange,
    handleCancel,
    handleSubmit
  };
};
