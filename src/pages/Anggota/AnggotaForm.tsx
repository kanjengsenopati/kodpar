
import Layout from "@/components/layout/Layout";
import { PhotoUploadCard } from "@/components/anggota/PhotoUploadCard";
import { AnggotaDetailsForm } from "@/components/anggota/AnggotaDetailsForm";
import { DokumenUploadCard } from "@/components/anggota/dokumen/DokumenUploadCard";
import { KeluargaFormCard } from "@/components/anggota/KeluargaFormCard";
import { FormHeader } from "@/components/anggota/form/FormHeader";
import { FormActions } from "@/components/anggota/form/FormActions";
import { useAnggotaForm } from "@/hooks/useAnggotaForm";

export default function AnggotaForm() {
  const {
    isEditMode,
    formData,
    previewImage,
    dokumen,
    keluarga,
    isSubmitting,
    isFormDirty,
    handleChange,
    handleSelectChange,
    handleImageChange,
    handleDokumenChange,
    handleKeluargaChange,
    handleCancel,
    handleSubmit,
    id
  } = useAnggotaForm();

  const dokumenCount = dokumen.length;
  const keluargaCount = keluarga.length;
  const pageTitle = isEditMode ? "Edit Anggota" : "Tambah Anggota Baru";

  return (
    <Layout pageTitle={pageTitle}>
      <FormHeader 
        title={pageTitle} 
        dokumenCount={dokumenCount}
        keluargaCount={keluargaCount}
        isFormDirty={isFormDirty}
      />
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <PhotoUploadCard 
            previewImage={previewImage} 
            onImageChange={handleImageChange}
          />
          
          <AnggotaDetailsForm
            formData={formData}
            anggotaId={id}
            isEditMode={isEditMode}
            onInputChange={handleChange}
            onSelectChange={handleSelectChange}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          <DokumenUploadCard 
            dokumen={dokumen}
            onDokumenChange={handleDokumenChange}
          />
          
          <KeluargaFormCard
            keluarga={keluarga}
            onKeluargaChange={handleKeluargaChange}
          />
        </div>
        
        <FormActions 
          isSubmitting={isSubmitting}
          isFormDirty={isFormDirty}
          isEditMode={isEditMode}
          onCancel={handleCancel}
        />
      </form>
    </Layout>
  );
}
