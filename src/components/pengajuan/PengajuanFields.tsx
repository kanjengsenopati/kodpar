import { KategoriField } from "./KategoriField";
import { TenorField } from "./TenorField";
import { JumlahField } from "./JumlahField";
import { KeteranganField } from "./KeteranganField";
import { LoanCategoryInfo } from "./LoanCategoryInfo";
import { PinjamanPreview } from "./PinjamanPreview";

interface PengajuanFieldsProps {
  jenis: "Simpan" | "Pinjam" | "Penarikan";
  anggotaId?: string;
  formData: {
    jumlah: number;
    kategori: string;
    keterangan: string;
    tenor?: number;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleJumlahChange?: (value: number) => void;
}

export function PengajuanFields({ 
  jenis, 
  anggotaId,
  formData, 
  handleInputChange, 
  handleSelectChange,
  handleJumlahChange
}: PengajuanFieldsProps) {

  // Handler for jumlah changes
  const onJumlahChange = (value: number) => {
    if (handleJumlahChange) {
      handleJumlahChange(value);
    } else {
      // Fallback to the old method if handler not provided
      const syntheticEvent = {
        target: { id: "jumlah", value: String(value) }
      } as React.ChangeEvent<HTMLInputElement>;
      handleInputChange(syntheticEvent);
    }
  };
  
  return (
    <div className="space-y-4">
      <KategoriField
        jenis={jenis}
        value={formData.kategori}
        onChange={(value) => handleSelectChange("kategori", value)}
      />
      
      {/* Show comprehensive loan information for loan applications */}
      {jenis === "Pinjam" && formData.kategori && (
        <LoanCategoryInfo 
          kategori={formData.kategori}
          jumlah={formData.jumlah}
          tenor={formData.tenor}
        />
      )}
      
      {jenis === "Pinjam" && (
        <TenorField
          value={formData.tenor}
          onChange={(value) => handleSelectChange("tenor", value)}
        />
      )}
      
      <JumlahField
        jenis={jenis}
        anggotaId={anggotaId}
        value={formData.jumlah}
        onChange={onJumlahChange}
      />
      
      <KeteranganField
        value={formData.keterangan}
        onChange={handleInputChange}
      />
      
      {/* Keep the existing PinjamanPreview for backward compatibility */}
      {jenis === "Pinjam" && formData.kategori && formData.jumlah > 0 && (
        <PinjamanPreview 
          kategori={formData.kategori}
          jumlah={formData.jumlah}
          tenor={formData.tenor}
        />
      )}
    </div>
  );
}
