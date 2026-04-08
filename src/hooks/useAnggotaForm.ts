
import { useAnggotaFormState } from "./anggota/useAnggotaFormState";
import { useAnggotaFormHandlers } from "./anggota/useAnggotaFormHandlers";

export const useAnggotaForm = () => {
  // Get form state from the state hook
  const {
    id,
    isEditMode,
    isSubmitting,
    setIsSubmitting,
    formData,
    setFormData,
    previewImage,
    setPreviewImage,
    dokumen,
    setDokumen,
    keluarga,
    setKeluarga,
    isFormDirty,
    setIsFormDirty
  } = useAnggotaFormState();
  
  // Get form handlers from the handlers hook
  const {
    handleChange,
    handleSelectChange,
    handleImageChange,
    handleDokumenChange,
    handleKeluargaChange,
    handleCancel,
    handleSubmit
  } = useAnggotaFormHandlers({
    isEditMode,
    id,
    formData,
    setFormData,
    dokumen,
    setDokumen,
    keluarga,
    setKeluarga,
    previewImage,
    setPreviewImage,
    isFormDirty,
    setIsFormDirty,
    isSubmitting,
    setIsSubmitting
  });

  return {
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
  };
};
