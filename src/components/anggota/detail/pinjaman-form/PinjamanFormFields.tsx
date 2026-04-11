
import { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getAllJenis } from "@/services/jenisService";
import { getPengaturan } from "@/services/pengaturanService";
import { NominalInputField } from "@/components/ui/NominalInputField";
import { PinjamanFormSummary } from "./PinjamanFormSummary";
import { PinjamanFormData } from "./types";
import { isValidAmountRange } from "@/utils/formatters";

interface PinjamanFormFieldsProps {
  formData: PinjamanFormData;
  setFormData: React.Dispatch<React.SetStateAction<PinjamanFormData>>;
  formattedJumlah: string;
  setFormattedJumlah: React.Dispatch<React.SetStateAction<string>>;
}

export function PinjamanFormFields({ 
  formData, 
  setFormData,
  formattedJumlah,
  setFormattedJumlah
}: PinjamanFormFieldsProps) {
  const pinjamanJenis = getAllJenis().filter(j => j.jenisTransaksi === "Pinjaman" && j.isActive);
  const pengaturan = getPengaturan();
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleJumlahChange = (numericValue: number) => {
    // Validate range before updating
    if (isValidAmountRange(numericValue)) {
      setFormData(prev => ({ 
        ...prev, 
        jumlah: String(numericValue)
      }));
    }
  };

  const handleCategoryChange = (jenisId: string) => {
    setFormData(prev => ({ ...prev, jenisId }));
  };

  // Helper function to display interest rate for pinjaman categories
  const getInterestRateForCategory = (jenisId: string): number => {
    const jenis = pinjamanJenis.find(j => j.id === jenisId);
    return (jenis as any)?.bungaPersen || pengaturan.sukuBunga.pinjaman;
  };

  const currentInterestRate = getInterestRateForCategory(formData.jenisId);

  return (
    <>
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="kategori" className="required">Kategori Pinjaman</Label>
        <Select
          value={formData.jenisId}
          onValueChange={handleCategoryChange}
          required
        >
          <SelectTrigger id="kategori">
            <SelectValue placeholder="Pilih kategori pinjaman" />
          </SelectTrigger>
          <SelectContent>
            {pinjamanJenis.map((jenis) => (
              <SelectItem key={jenis.id} value={jenis.id}>
                {jenis.nama} - Bunga {getInterestRateForCategory(jenis.id)}% per bulan
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground mt-1">
          Suku bunga untuk kategori ini: {currentInterestRate}% per bulan
        </p>
      </div>
      
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="jumlah" className="required">Jumlah Pinjaman (Rp)</Label>
        <NominalInputField
          id="jumlah"
          value={formData.jumlah}
          onValueChange={handleJumlahChange}
          required
          placeholder="Contoh: 5.000.000.000"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Masukkan jumlah (tidak ada batas maksimal)
        </p>
      </div>
      
      <div className="grid w-full items-center gap-2">
        <Label htmlFor="keterangan">Keterangan</Label>
        <Textarea
          id="keterangan"
          name="keterangan"
          placeholder="Tujuan pinjaman (opsional)"
          value={formData.keterangan}
          onChange={handleTextareaChange}
          rows={3}
        />
      </div>
      
      {formData.jumlah && formData.jenisId && (
        <PinjamanFormSummary 
          jenisId={formData.jenisId} 
          jumlah={formData.jumlah} 
        />
      )}
    </>
  );
}
