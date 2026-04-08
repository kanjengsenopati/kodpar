import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Anggota } from "@/types";
import { FormActions } from "@/components/anggota/FormActions";
import { StatusField } from "./StatusField";
import { AnggotaField } from "./AnggotaField";
import { PengajuanFields } from "./PengajuanFields";
import { DateField } from "./DateField";
import { JenisSelector } from "./JenisSelector";
import { DokumenPersyaratanUpload, PersyaratanDokumen } from "./DokumenPersyaratanUpload";
import { PengajuanFormContainer } from "./PengajuanFormContainer";
import { usePengajuanFormState } from "./usePengajuanFormState";
import { usePengajuanValidation } from "./usePengajuanValidation";

interface PengajuanFormContentProps {
  isEditMode: boolean;
  id?: string;
  initialFormData: {
    tanggal: string;
    anggotaId: string;
    jenis: "Simpan" | "Pinjam" | "Penarikan";
    kategori: string;
    jumlah: number;
    keterangan: string;
    status: "Menunggu" | "Disetujui" | "Ditolak";
    dokumen?: PersyaratanDokumen[];
  };
  anggotaList: Anggota[];
  onSubmit: (formData: any) => void;
  isSubmitting: boolean;
}

export function PengajuanFormContent({
  isEditMode,
  initialFormData,
  anggotaList,
  onSubmit,
  isSubmitting
}: PengajuanFormContentProps) {
  const navigate = useNavigate();
  const { validateForm } = usePengajuanValidation();
  const { 
    formData, 
    handleInputChange, 
    handleSelectChange, 
    handleDokumenChange 
  } = usePengajuanFormState(initialFormData);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(formData)) return;
    
    onSubmit(formData);
  };

  const handleJumlahChange = (value: number) => {
    const syntheticEvent = {
      target: { id: "jumlah", value: String(value) }
    } as React.ChangeEvent<HTMLInputElement>;
    handleInputChange(syntheticEvent);
  };

  return (
    <PengajuanFormContainer onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DateField 
          value={formData.tanggal} 
          onChange={handleInputChange} 
        />
        
        <StatusField 
          value={formData.status}
          onChange={(value) => handleSelectChange("status", value)}
          disabled={!isEditMode}
        />
      </div>
      
      <AnggotaField 
        value={formData.anggotaId}
        onChange={(value) => handleSelectChange("anggotaId", value)}
        anggotaList={anggotaList}
      />
      
      <JenisSelector 
        value={formData.jenis}
        onChange={(value) => handleSelectChange("jenis", value)}
      />
      
      <PengajuanFields 
        jenis={formData.jenis} 
        anggotaId={formData.anggotaId}
        formData={{
          kategori: formData.kategori,
          jumlah: formData.jumlah,
          keterangan: formData.keterangan,
          tenor: formData.tenor
        }}
        handleInputChange={handleInputChange}
        handleSelectChange={handleSelectChange}
        handleJumlahChange={handleJumlahChange}
      />
      
      {formData.jenis === "Pinjam" && formData.kategori && (
        <DokumenPersyaratanUpload
          selectedKategori={formData.kategori}
          dokumenList={formData.dokumen || []}
          onChange={handleDokumenChange}
        />
      )}
      
      <FormActions 
        isSubmitting={isSubmitting} 
        isEditMode={isEditMode}
        cancelHref="/transaksi/pengajuan"
      />
    </PengajuanFormContainer>
  );
}
