
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Anggota, AnggotaKeluarga } from "@/types";
import { KeluargaTable } from "./KeluargaTable";
import { KeluargaFormDialog } from "../keluarga/KeluargaFormDialog";
import { DeleteKeluargaDialog } from "../keluarga/DeleteKeluargaDialog";
import { useKeluargaForm } from "@/hooks/useKeluargaForm";

interface KeluargaSectionProps {
  anggota: Anggota;
  onAnggotaUpdate: (updatedAnggota: Anggota) => void;
}

export function KeluargaSection({ anggota, onAnggotaUpdate }: KeluargaSectionProps) {
  const {
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
  } = useKeluargaForm({ 
    anggota,
    onAnggotaUpdate
  });

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Data Keluarga</CardTitle>
        <Button onClick={handleAddKeluarga} size="sm">
          <Plus size={16} className="mr-1" /> Tambah Keluarga
        </Button>
      </CardHeader>
      <CardContent>
        <KeluargaTable 
          keluarga={anggota.keluarga || []} 
          anggotaId={anggota.id} 
          onEdit={handleEditKeluarga}
          onDelete={handleDeleteKeluarga}
          readOnly={false}
        />
      </CardContent>

      {/* Keluarga Form Dialog */}
      <KeluargaFormDialog
        isOpen={isDialogOpen}
        onOpenChange={handleDialogOpen}
        onSubmit={handleKeluargaSubmit}
        currentKeluarga={currentKeluarga}
        isEditing={isEditing}
        errors={errors}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteKeluargaDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </Card>
  );
}
