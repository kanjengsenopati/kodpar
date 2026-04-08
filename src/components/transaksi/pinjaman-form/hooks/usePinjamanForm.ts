
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { createTransaksi, updateTransaksi } from '@/services/transaksiService';
import { Transaksi } from '@/types';
import type { PinjamanFormData } from '../types';

interface UsePinjamanFormProps {
  initialData?: Transaksi;
  onSuccess?: () => void;
}

export const usePinjamanForm = ({ initialData, onSuccess }: UsePinjamanFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditMode = !!initialData;
  
  const [formData, setFormData] = useState<PinjamanFormData>({
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: '',
    kategori: '',
    jumlah: 0,
    jumlahPinjaman: '',
    formattedJumlah: '',
    tenor: 12,
    bunga: 1,
    keterangan: '',
    angsuran: 0,
    angsuranPerBulan: 0,
    totalBunga: 0,
    totalPengembalian: 0,
    jatuhTempo: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with data if in edit mode
  useEffect(() => {
    if (initialData) {
      // Try to parse tenor, bunga, angsuran per bulan from keterangan
      let tenor = 12;
      let bunga = 1;
      let angsuranPerBulan = Math.ceil(initialData.jumlah / tenor);
      
      if (initialData.keterangan) {
        const tenorMatch = initialData.keterangan.match(/Tenor: (\d+) bulan/);
        const bungaMatch = initialData.keterangan.match(/Bunga: (\d+(?:\.\d+)?)%/);
        const angsuranMatch = initialData.keterangan.match(/Angsuran per bulan: Rp ([0-9,.]+)/);
        
        if (tenorMatch && tenorMatch[1]) {
          tenor = parseInt(tenorMatch[1]);
        }
        
        if (bungaMatch && bungaMatch[1]) {
          bunga = parseFloat(bungaMatch[1]);
        }
        
        if (angsuranMatch && angsuranMatch[1]) {
          angsuranPerBulan = parseInt(angsuranMatch[1].replace(/[,.]/g, ""));
        }
      }
      
      // Calculate jatuh tempo
      const tanggalPinjam = new Date(initialData.tanggal);
      const jatuhTempoDate = new Date(tanggalPinjam);
      jatuhTempoDate.setMonth(jatuhTempoDate.getMonth() + tenor);
      
      const totalBunga = initialData.jumlah * (bunga / 100) * tenor;
      const totalPengembalian = initialData.jumlah + totalBunga;
      
      // Set form data
      setFormData({
        tanggal: initialData.tanggal,
        anggotaId: initialData.anggotaId,
        kategori: initialData.kategori || '',
        jumlah: initialData.jumlah,
        jumlahPinjaman: initialData.jumlah.toString(),
        formattedJumlah: initialData.jumlah.toLocaleString('id-ID'),
        tenor,
        bunga,
        keterangan: initialData.keterangan || '',
        angsuran: angsuranPerBulan,
        angsuranPerBulan,
        totalBunga,
        totalPengembalian,
        jatuhTempo: jatuhTempoDate.toISOString().split('T')[0],
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.anggotaId) {
      toast({
        title: "Error",
        description: "Silakan pilih anggota",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.kategori) {
      toast({
        title: "Error",
        description: "Silakan pilih kategori pinjaman",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.jumlahPinjaman || parseFloat(formData.jumlahPinjaman) <= 0) {
      toast({
        title: "Error",
        description: "Jumlah pinjaman harus lebih dari 0",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Build keterangan string with loan details
      const detailKeterangan = [
        `Tenor: ${formData.tenor} bulan`,
        `Bunga: ${formData.bunga}%`,
        `Angsuran per bulan: Rp ${formData.angsuranPerBulan.toLocaleString('id-ID')}`,
        `Total pengembalian: Rp ${formData.totalPengembalian.toLocaleString('id-ID')}`,
        `Jatuh tempo: ${new Date(formData.jatuhTempo).toLocaleDateString('id-ID')}`
      ].join(', ');
      
      const fullKeterangan = formData.keterangan 
        ? `${formData.keterangan} (${detailKeterangan})`
        : detailKeterangan;
      
      // Prepare transaksi data
      const transaksiData = {
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jenis: "Pinjam" as const, 
        kategori: formData.kategori,
        jumlah: formData.jumlah,
        keterangan: fullKeterangan,
        status: "Sukses" as const,
      };
      
      let result;
      
      if (isEditMode && initialData?.id) {
        // Update existing transaction
        result = updateTransaksi(initialData.id, transaksiData);
        
        if (result) {
          toast({
            title: "Pinjaman berhasil diperbarui",
            description: `Pinjaman dengan ID ${result.id} telah diperbarui.`,
          });
        }
      } else {
        // Create new transaction
        result = createTransaksi(transaksiData);
        
        if (result) {
          toast({
            title: "Pinjaman berhasil disimpan",
            description: `Pinjaman baru dengan ID ${result.id} telah dibuat.`,
          });
        }
      }
      
      if (result) {
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        } else {
          navigate("/transaksi/pinjam");
        }
      } else {
        throw new Error("Gagal menyimpan pinjaman");
      }
      
    } catch (error) {
      console.error("Error saving pinjaman:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan pinjaman. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    isEditMode,
    handleSubmit
  };
};
