
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { createPengajuan } from "@/services/pengajuanService";
import { getPinjamanCategories } from "@/services/transaksi/categories";
import { formatNumberInput, cleanNumberInput } from "@/utils/formatters";
import { PinjamanFormDialog } from "./PinjamanFormDialog";
import { PinjamanFormData } from "./types";

interface PengajuanPinjamanButtonProps {
  anggotaId: string;
  anggotaNama: string;
}

export function PengajuanPinjamanButton({ anggotaId, anggotaNama }: PengajuanPinjamanButtonProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pinjamanCategories = getPinjamanCategories();
  
  const [formData, setFormData] = useState<PinjamanFormData>({
    jumlah: '',
    keterangan: '',
    kategori: pinjamanCategories[0]
  });

  const handleSubmit = async (submittedData: PinjamanFormData) => {
    setIsSubmitting(true);
    
    try {
      // Validate input
      if (!submittedData.jumlah || isNaN(Number(submittedData.jumlah)) || Number(submittedData.jumlah) <= 0) {
        throw new Error("Jumlah pinjaman harus diisi dengan angka yang valid");
      }
      
      if (!submittedData.kategori) {
        throw new Error("Kategori pinjaman harus dipilih");
      }
      
      // Create pengajuan
      const result = await createPengajuan({
        anggotaId: anggotaId,
        jenis: "Pinjam",
        kategori: submittedData.kategori,
        jumlah: Number(submittedData.jumlah),
        tanggal: new Date().toISOString().split('T')[0],
        status: "Menunggu",
        keterangan: submittedData.keterangan || "Pengajuan pinjaman baru",
      });
      
      if (result) {
        toast({
          title: "Pengajuan berhasil",
          description: "Pengajuan pinjaman Anda telah berhasil dikirim dan sedang menunggu persetujuan",
        });
        setIsDialogOpen(false);
        setFormData({ 
          jumlah: '', 
          keterangan: '', 
          kategori: pinjamanCategories[0] 
        });
      } else {
        throw new Error("Gagal membuat pengajuan");
      }
    } catch (error: any) {
      toast({
        title: "Pengajuan gagal",
        description: error.message || "Terjadi kesalahan saat membuat pengajuan",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)} 
        variant="outline" 
        className="flex items-center gap-2"
      >
        Ajukan Pinjaman Baru
      </Button>
      
      <PinjamanFormDialog 
        anggotaId={anggotaId}
        anggotaNama={anggotaNama}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
