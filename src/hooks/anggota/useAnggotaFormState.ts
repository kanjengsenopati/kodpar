
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getAnggotaById } from "@/services/anggotaService";
import { AnggotaKeluarga, AnggotaDokumen } from "@/types";
import { getAllUnitKerja } from "@/services/unitKerjaService";

export const useAnggotaFormState = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isFormDirty, setIsFormDirty] = useState(false);
  const [unitKerjaOptions, setUnitKerjaOptions] = useState<string[]>([]);
  
  // Helper function to convert old year format to new month-year format
  const convertToMonthYearFormat = (dateValue: string): string => {
    if (!dateValue) {
      const now = new Date();
      return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    }
    
    // If already in YYYY-MM format, return as is
    if (dateValue.includes('-')) {
      return dateValue;
    }
    
    // If only year (old format), convert to January of that year
    if (dateValue.length === 4 && !isNaN(parseInt(dateValue))) {
      return `${dateValue}-01`;
    }
    
    // Default to current date if invalid
    const now = new Date();
    return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
  };
  
  // Form state with properly typed jenisKelamin and added email field
  const [formData, setFormData] = useState({
    nama: "",
    nip: "", 
    alamat: "",
    noHp: "",
    jenisKelamin: "L" as "L" | "P", 
    agama: "",
    foto: "",
    email: "",
    unitKerja: "",
    tanggalRegistrasi: convertToMonthYearFormat("")
  });
  
  const [dokumen, setDokumen] = useState<AnggotaDokumen[]>([]);
  const [initialDokumenCount, setInitialDokumenCount] = useState(0);
  const [keluarga, setKeluarga] = useState<AnggotaKeluarga[]>([]);
  const [initialKeluargaCount, setInitialKeluargaCount] = useState(0);
  
  const isEditMode = !!id;

  // Load unit kerja options
  useEffect(() => {
    const loadUnitKerja = () => {
      const unitKerjaData = getAllUnitKerja();
      setUnitKerjaOptions(unitKerjaData.map(unit => unit.nama));
    };
    
    loadUnitKerja();
    
    // Set up an interval to refresh unit kerja data every 30 seconds
    // This ensures that if unit kerja data is updated in another part of the app,
    // the form will have the latest data
    const intervalId = setInterval(loadUnitKerja, 30000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Load data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      try {
        const anggota = getAnggotaById(id);
        if (anggota) {
          setFormData({
            nama: anggota.nama,
            nip: anggota.nip || "", 
            alamat: anggota.alamat,
            noHp: anggota.noHp,
            jenisKelamin: anggota.jenisKelamin,
            agama: anggota.agama,
            foto: anggota.foto || "",
            email: anggota.email || "",
            unitKerja: anggota.unitKerja || "",
            tanggalRegistrasi: convertToMonthYearFormat(anggota.tanggalRegistrasi || "")
          });
          
          if (anggota.foto) {
            setPreviewImage(anggota.foto);
          }
          
          if (anggota.dokumen) {
            setDokumen(anggota.dokumen);
            setInitialDokumenCount(anggota.dokumen.length);
          }
          
          if (anggota.keluarga) {
            setKeluarga(anggota.keluarga);
            setInitialKeluargaCount(anggota.keluarga.length);
          }
        }
      } catch (error) {
        console.error("Error loading anggota data:", error);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memuat data anggota",
          variant: "destructive",
        });
      }
    }
    
    // Reset form dirty state after initial load
    setIsFormDirty(false);
  }, [id, isEditMode, toast]);
  
  // Track changes to mark form as dirty
  useEffect(() => {
    if (isEditMode) {
      const isDokumenChanged = dokumen.length !== initialDokumenCount;
      const isKeluargaChanged = keluarga.length !== initialKeluargaCount;
      
      if (isDokumenChanged || isKeluargaChanged) {
        setIsFormDirty(true);
      }
    }
  }, [dokumen, keluarga, isEditMode, initialDokumenCount, initialKeluargaCount]);

  // Handle browser back/navigation warning if form is dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isFormDirty) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFormDirty]);

  return {
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
    setIsFormDirty,
    unitKerjaOptions
  };
};
