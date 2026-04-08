
import { FormHeader } from './FormHeader';
import { AnggotaSelector } from './AnggotaSelector';
import { KategoriSelector } from './KategoriSelector';
import { JumlahInput } from './JumlahInput';
import { KeteranganInput } from './KeteranganInput';
import { PinjamanParameters } from './PinjamanParameters';
import { LoanSummary } from './LoanSummary';
import { FormActions } from './FormActions';
import { usePinjamanForm } from './hooks/usePinjamanForm';
import { usePinjamanCalculations } from './hooks/usePinjamanCalculations';
import type { PinjamanFormProps } from './types';

export const PinjamanForm = ({ anggotaList, initialData, onSuccess }: PinjamanFormProps) => {
  const {
    formData,
    setFormData,
    isSubmitting,
    isEditMode,
    handleSubmit
  } = usePinjamanForm({ initialData, onSuccess });

  const { handleJumlahChange, handleParameterChange } = usePinjamanCalculations();
  
  const handleAnggotaChange = (anggotaId: string) => {
    setFormData({ ...formData, anggotaId });
  };
  
  const handleKategoriChange = (kategori: string) => {
    setFormData({ ...formData, kategori });
  };
  
  const handleKeteranganChange = (keterangan: string) => {
    setFormData({ ...formData, keterangan });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <FormHeader isEditMode={isEditMode} />
        
        <AnggotaSelector
          anggotaList={anggotaList}
          selectedAnggotaId={formData.anggotaId}
          onChange={handleAnggotaChange}
          disabled={isEditMode}
        />
        
        <KategoriSelector
          selectedKategori={formData.kategori}
          onChange={handleKategoriChange}
        />
        
        <JumlahInput
          value={formData.formattedJumlah}
          onChange={(value, formatted) => 
            handleJumlahChange(value, formatted, formData, setFormData)
          }
        />
        
        <PinjamanParameters
          tanggal={formData.tanggal}
          tenor={formData.tenor}
          bunga={formData.bunga}
          onChange={(field, value) => 
            handleParameterChange(field, value, formData, setFormData)
          }
        />
        
        <LoanSummary
          angsuranPerBulan={formData.angsuranPerBulan}
          totalBunga={formData.totalBunga}
          totalPengembalian={formData.totalPengembalian}
          jatuhTempo={formData.jatuhTempo}
        />
        
        <KeteranganInput
          value={formData.keterangan}
          onChange={handleKeteranganChange}
        />
        
        <FormActions
          isSubmitting={isSubmitting}
          isEditMode={isEditMode}
        />
      </div>
    </form>
  );
};
