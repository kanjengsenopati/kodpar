
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PiggyBank, Zap } from "lucide-react";
import { getJenisByType } from "@/services/jenisService";
import { Transaksi } from "@/types";
import { JenisSimpanan } from "@/types/jenis";
import { useToast } from "@/components/ui/use-toast";
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
      const result = submitSimpananForm(formData, initialData);

      if (result.success) {
        const isUpdate = !!initialData;
        const kategori = formData.kategori;
        
        toast({
          title: `✅ Simpanan berhasil ${isUpdate ? 'diperbarui' : 'disimpan'} & Auto-Sync ke Akuntansi`,
          description: `${isUpdate ? 'Data' : ''} Simpanan ${kategori} berhasil ${isUpdate ? 'diperbarui' : 'disimpan'} dan otomatis tersinkronisasi ke Jurnal Umum`,
        });
        
        onSuccess();
      } else {
        toast({
          title: "Terjadi kesalahan",
          description: result.error || "Gagal menyimpan data simpanan",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving simpanan:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan data simpanan",
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="h-5 w-5" />
          {initialData ? "Edit Simpanan" : "Form Simpanan"}
          <div className="flex items-center gap-1 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
            <Zap className="h-3 w-3" />
            Auto-Sync Akuntansi
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
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

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : initialData ? "Update Simpanan" : "Simpan Simpanan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
