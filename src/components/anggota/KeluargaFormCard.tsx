
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AnggotaKeluarga } from "@/types";
import { EmptyKeluargaState } from "./keluarga/EmptyKeluargaState";
import { KeluargaFormDialog } from "./keluarga/KeluargaFormDialog";
import { KeluargaDataTable } from "./keluarga/KeluargaDataTable";
import { DeleteKeluargaDialog } from "./keluarga/DeleteKeluargaDialog";

interface KeluargaFormCardProps {
  keluarga: AnggotaKeluarga[];
  onKeluargaChange: (keluarga: AnggotaKeluarga[]) => void;
}

export function KeluargaFormCard({ keluarga, onKeluargaChange }: KeluargaFormCardProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [keluargaToDelete, setKeluargaToDelete] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    nama?: string;
    hubungan?: string;
    alamat?: string;
    noHp?: string;
  }>({});
  
  const [currentKeluarga, setCurrentKeluarga] = useState<AnggotaKeluarga>({
    id: "",
    nama: "",
    hubungan: "Anak",
    alamat: "",
    noHp: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const resetForm = () => {
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
      resetForm();
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isEditing) {
      // Update existing
      const updatedKeluarga = keluarga.map(k => 
        k.id === currentKeluarga.id ? currentKeluarga : k
      );
      onKeluargaChange(updatedKeluarga);
      
      toast({
        title: "Data keluarga berhasil diperbarui",
      });
    } else {
      // Add new
      const newKeluarga = {
        ...currentKeluarga,
        id: `keluarga-${Date.now()}`
      };
      
      onKeluargaChange([...keluarga, newKeluarga]);
      
      toast({
        title: "Anggota keluarga berhasil ditambahkan",
      });
    }
    
    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (id: string) => {
    const keluargaToEdit = keluarga.find(k => k.id === id);
    if (keluargaToEdit) {
      setCurrentKeluarga(keluargaToEdit);
      setIsEditing(true);
      setIsDialogOpen(true);
    }
  };

  const confirmDelete = (id: string) => {
    setKeluargaToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (keluargaToDelete) {
      const updatedKeluarga = keluarga.filter(k => k.id !== keluargaToDelete);
      onKeluargaChange(updatedKeluarga);
      
      toast({
        title: "Anggota keluarga berhasil dihapus",
      });
      
      setKeluargaToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setKeluargaToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  return (
    <Card className="col-span-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Data Anggota Keluarga</CardTitle>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus size={16} className="mr-1" /> Tambah Anggota Keluarga
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        {keluarga.length > 0 ? (
          <KeluargaDataTable 
            keluarga={keluarga} 
            onEdit={handleEdit} 
            onDelete={confirmDelete}
          />
        ) : (
          <EmptyKeluargaState onAddClick={() => setIsDialogOpen(true)} />
        )}

        <KeluargaFormDialog
          isOpen={isDialogOpen}
          onOpenChange={handleDialogOpen}
          onSubmit={handleSubmit}
          currentKeluarga={currentKeluarga}
          isEditing={isEditing}
          errors={errors}
          onInputChange={handleInputChange}
          onSelectChange={handleSelectChange}
        />

        <DeleteKeluargaDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteConfirmed}
          onCancel={handleCancelDelete}
        />
      </CardContent>
    </Card>
  );
}
