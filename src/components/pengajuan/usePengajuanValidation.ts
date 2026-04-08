
import { useToast } from "@/components/ui/use-toast";
import { PersyaratanDokumen } from "@/types";

interface PengajuanFormData {
  tanggal: string;
  anggotaId: string;
  jenis: "Simpan" | "Pinjam" | "Penarikan";
  kategori: string;
  jumlah: number;
  status: "Menunggu" | "Disetujui" | "Ditolak";
  dokumen?: PersyaratanDokumen[];
}

export function usePengajuanValidation() {
  const { toast } = useToast();
  
  const validateForm = (formData: PengajuanFormData): boolean => {
    if (!formData.tanggal) {
      toast({
        title: "Tanggal wajib diisi",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.anggotaId) {
      toast({
        title: "Anggota wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.jenis) {
      toast({
        title: "Jenis pengajuan wajib dipilih",
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.kategori) {
      const jenisName = formData.jenis === "Simpan" ? "simpanan" : 
                        formData.jenis === "Pinjam" ? "pinjaman" : "penarikan";
      toast({
        title: `Kategori ${jenisName} wajib dipilih`,
        variant: "destructive",
      });
      return false;
    }
    
    if (!formData.jumlah || formData.jumlah <= 0) {
      toast({
        title: "Jumlah harus lebih dari 0",
        variant: "destructive",
      });
      return false;
    }
    
    // Document upload is now optional - no validation required
    
    return true;
  };

  return { validateForm };
}
