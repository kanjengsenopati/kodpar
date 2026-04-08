
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Pengaturan } from "@/types";
import { CustomVariableCard } from "./custom-variables/CustomVariableCard";
import { CustomVariableForm } from "./custom-variables/CustomVariableForm";
import { EmptyVariableState } from "./custom-variables/EmptyVariableState";
import { useCustomVariables } from "./custom-variables/useCustomVariables";

interface CustomVariablesProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
}

export function CustomVariables({ settings, setSettings }: CustomVariablesProps) {
  const {
    customVariables,
    isAdding,
    setIsAdding,
    isEditing,
    newVariable,
    setNewVariable,
    editingVariable,
    setEditingVariable,
    handleAddVariable,
    handleStartEdit,
    handleCancelEdit,
    handleSaveEdit,
    handleUpdateValue,
    handleDeleteVariable,
  } = useCustomVariables({ settings, setSettings });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium">Variabel Kustom</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Tambah Variabel
        </Button>
      </div>

      {isAdding && (
        <CustomVariableForm
          variable={newVariable}
          setVariable={setNewVariable}
          onSave={handleAddVariable}
          onCancel={() => setIsAdding(false)}
          buttonText="Tambahkan Variabel"
        />
      )}

      {isEditing && (
        <CustomVariableForm
          variable={editingVariable}
          setVariable={setEditingVariable}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
          buttonText="Simpan Perubahan"
        />
      )}

      {customVariables.length > 0 ? (
        <div className="space-y-2">
          {customVariables.map((variable) => (
            <CustomVariableCard
              key={variable.id}
              variable={variable}
              onUpdate={handleUpdateValue}
              onEdit={handleStartEdit}
              onDelete={handleDeleteVariable}
            />
          ))}
        </div>
      ) : (
        <EmptyVariableState />
      )}
    </div>
  );
}
