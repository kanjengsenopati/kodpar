
import { useState } from "react";
import { AnggotaKeluarga } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { updateAnggota } from "@/services/anggotaService";

interface UseKeluargaFormProps {
  anggota: {
    id: string;
    keluarga?: AnggotaKeluarga[];
  };
  onAnggotaUpdate: (updatedAnggota: any) => void;
}

export function useKeluargaForm({ anggota, onAnggotaUpdate }: UseKeluargaFormProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentKeluarga, setCurrentKeluarga] = useState<AnggotaKeluarga>({
    id: "",
    nama: "",
    hubungan: "Anak",
    alamat: "",
    noHp: "",
  });
  const [keluargaToDelete, setKeluargaToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<{
    nama?: string;
    hubungan?: string;
    alamat?: string;
    noHp?: string;
  }>({});
  
  const resetKeluargaForm = () => {
    setCurrentKeluarga({
      id: "",
      nama: "",
      hubungan: "Anak",
      alamat: "",
      noHp: "",
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleDialogOpen = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetKeluargaForm();
    }
  };

  const handleAddKeluarga = () => {
    setIsDialogOpen(true);
    resetKeluargaForm();
  };

  const handleEditKeluarga = (keluargaId: string) => {
    if (!anggota || !anggota.keluarga) return;
    
    const keluargaToEdit = anggota.keluarga.find(k => k.id === keluargaId);
    if (keluargaToEdit) {
      setCurrentKeluarga(keluargaToEdit);
      setIsEditing(true);
      setIsDialogOpen(true);
    }
  };

  const handleDeleteKeluarga = (keluargaId: string) => {
    setKeluargaToDelete(keluargaId);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentKeluarga(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if user is typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value: string) => {
    setCurrentKeluarga(prev => ({
      ...prev,
      hubungan: value as "Anak" | "Suami" | "Istri" | "Orang Tua" | "Saudara Kandung" | "Kerabat"
    }));
    
    // Clear error for hubungan if user selects a value
    if (errors.hubungan) {
      setErrors(prev => ({ ...prev, hubungan: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: {
      nama?: string;
      hubungan?: string;
      alamat?: string;
      noHp?: string;
    } = {};
    
    if (!currentKeluarga.nama.trim()) {
      newErrors.nama = "Nama tidak boleh kosong";
    }
    
    if (!currentKeluarga.hubungan) {
      newErrors.hubungan = "Hubungan harus dipilih";
    }
    
    if (!currentKeluarga.alamat.trim()) {
      newErrors.alamat = "Alamat tidak boleh kosong";
    }
    
    if (!currentKeluarga.noHp.trim()) {
      newErrors.noHp = "Nomor HP tidak boleh kosong";
    } else if (!/^[0-9]{10,13}$/.test(currentKeluarga.noHp.replace(/\s/g, ''))) {
      newErrors.noHp = "Nomor HP harus berisi 10-13 digit angka";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleKeluargaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !anggota) {
      return;
    }

    // Create a new array of keluarga with modifications
    const updatedKeluarga = anggota.keluarga ? [...anggota.keluarga] : [];
    
    if (isEditing) {
      // Update existing family member
      const index = updatedKeluarga.findIndex(k => k.id === currentKeluarga.id);
      if (index !== -1) {
        updatedKeluarga[index] = currentKeluarga;
      }
      toast({
        title: "Data keluarga berhasil diperbarui",
      });
    } else {
      // Add new family member
      const newKeluarga = {
        ...currentKeluarga,
        id: `keluarga-${Date.now()}`
      };
      updatedKeluarga.push(newKeluarga);
      toast({
        title: "Anggota keluarga berhasil ditambahkan",
      });
    }

    // Update anggota object with new keluarga data
    const updatedAnggota = {
      ...anggota,
      keluarga: updatedKeluarga
    };

    // Persist changes to local storage
    updateAnggota(anggota.id, { keluarga: updatedKeluarga });
    
    // Update local state
    onAnggotaUpdate(updatedAnggota);
    
    // Close dialog and reset form
    setIsDialogOpen(false);
    resetKeluargaForm();
  };

  const handleDeleteConfirmed = () => {
    if (!keluargaToDelete || !anggota || !anggota.keluarga) return;

    // Filter out the deleted keluarga
    const updatedKeluarga = anggota.keluarga.filter(k => k.id !== keluargaToDelete);
    
    // Update anggota object with new keluarga data
    const updatedAnggota = {
      ...anggota,
      keluarga: updatedKeluarga
    };

    // Persist changes to local storage
    updateAnggota(anggota.id, { keluarga: updatedKeluarga });
    
    // Update local state
    onAnggotaUpdate(updatedAnggota);
    
    toast({
      title: "Anggota keluarga berhasil dihapus",
    });
    
    setKeluargaToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  return {
    isDialogOpen,
    isDeleteDialogOpen,
    currentKeluarga,
    errors,
    isEditing,
    handleDialogOpen,
    handleAddKeluarga,
    handleEditKeluarga,
    handleDeleteKeluarga,
    handleInputChange,
    handleSelectChange,
    handleKeluargaSubmit,
    handleDeleteConfirmed,
    setIsDeleteDialogOpen
  };
}
