
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { PiggyBank, Zap } from "lucide-react";
import { getJenisByType } from "@/services/jenisService";
import { Transaksi } from "@/types";
import { JenisSimpanan } from "@/types/jenis";
import { useToast } from "@/hooks/use-toast";
import { useSimpananFormValidation } from "@/hooks/useSimpananFormValidation";
import { submitSimpananForm } from "@/services/simpananSubmissionService";

// Import form field components
import { DateField } from "./forms/DateField";
import { AnggotaSelectField } from "./forms/AnggotaSelectField";
import { KategoriSelectField } from "./forms/KategoriSelectField";
import { AmountField } from "./forms/AmountField";
import { KeteranganField } from "./forms/KeteranganField";

interface SimpananFormProps {
  anggotaList: any[];
  initialData?: Transaksi;
  onSuccess: () => void;
}

export function SimpananForm({ anggotaList, initialData, onSuccess }: SimpananFormProps) {
  const { toast } = useToast();
  const { validateForm } = useSimpananFormValidation();
  
  const [formData, setFormData] = useState({
    tanggal: initialData?.tanggal || new Date().toISOString().split('T')[0],
    anggotaId: initialData?.anggotaId || "",
    kategori: initialData?.kategori || "",
    jumlah: initialData?.jumlah?.toString() || "",
    keterangan: initialData?.keterangan || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Constants for Koperasi Style
  const cardStyle = "rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white overflow-hidden";

  // Get available simpanan categories from Jenis Simpanan
  const jenisSimpanan = getJenisByType("Simpanan") as JenisSimpanan[];
  const availableKategori = jenisSimpanan
    .filter(jenis => jenis.isActive)
    .map(jenis => ({
      id: jenis.id,
      nama: jenis.nama,
      keterangan: jenis.keterangan
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitSimpananForm(formData, initialData);

      if (result.success) {
        const isUpdate = !!initialData;
        const kategori = formData.kategori;
        
        toast({
          title: `✅ Simpanan berhasil ${isUpdate ? 'diperbarui' : 'disimpan'}`,
          description: `Data simpanan ${kategori} telah disinkronkan ke Jurnal Umum secara real-time.`,
        });
        
        onSuccess();
      } else {
        console.error("Submission failed:", result.error);
        toast({
          title: "Gagal Menyimpan Simpanan",
          description: result.error || "Terjadi kesalahan pada server/database.",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error("Error saving simpanan:", error);
      toast({
        title: "Kesalahan Sistem",
        description: error.message || "Gagal menghubungi database koperasi.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className={cardStyle}>
      <CardHeader className="pb-2 pt-6 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-emerald-600" />
            <Text.H2>
              {initialData ? "Edit Simpanan" : "Form Simpanan"}
            </Text.H2>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
            <Zap size={12} />
            Auto-Sync Akuntansi
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DateField
              value={formData.tanggal}
              onChange={(value) => handleInputChange("tanggal", value)}
            />

            <AnggotaSelectField
              anggotaList={anggotaList}
              value={formData.anggotaId}
              onChange={(value) => handleInputChange("anggotaId", value)}
            />

            <KategoriSelectField
              kategoriList={availableKategori}
              value={formData.kategori}
              onChange={(value) => handleInputChange("kategori", value)}
            />

            <AmountField
              value={formData.jumlah}
              onChange={(value) => handleInputChange("jumlah", value)}
            />

            <KeteranganField
              value={formData.keterangan}
              onChange={(value) => handleInputChange("keterangan", value)}
            />
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 rounded-full bg-slate-900 hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200 disabled:opacity-50" 
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memproses Transaksi..." : initialData ? "Kirim Perubahan" : "Konfirmasi & Simpan Simpanan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
