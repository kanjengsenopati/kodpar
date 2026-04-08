
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormulaComponent, Pengaturan } from "@/types";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { FormulaComponentForm } from "./formula-components/FormulaComponentForm";
import { FormulaComponentList } from "./formula-components/FormulaComponentList";

interface FormulaComponentsProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
  variables: { id: string; label: string; description: string; value: number }[];
  onUseComponent: (formula: string) => void;
}

export function FormulaComponents({ 
  settings, 
  setSettings,
  variables,
  onUseComponent 
}: FormulaComponentsProps) {
  const [isAdding, setIsAdding] = useState(false);

  // Get formula components from settings or default to empty array
  const formulaComponents = settings.shu?.formulaComponents || [];

  // Add a new formula component
  const handleAddComponent = (component: FormulaComponent) => {
    const updatedComponents = [...formulaComponents, component];
    
    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        formulaComponents: updatedComponents
      }
    });
    
    setIsAdding(false);
    toast.success("Komponen formula berhasil ditambahkan");
  };

  // Delete a formula component
  const handleDeleteComponent = (id: string) => {
    const updatedComponents = formulaComponents.filter(c => c.id !== id);
    
    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        formulaComponents: updatedComponents
      }
    });
    
    toast.success("Komponen formula berhasil dihapus");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-md font-medium">Komponen Formula</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsAdding(!isAdding)}
        >
          <PlusCircle className="h-4 w-4 mr-2" /> 
          Tambah Komponen
        </Button>
      </div>

      {isAdding && (
        <FormulaComponentForm
          onAddComponent={handleAddComponent}
          onCancel={() => setIsAdding(false)}
        />
      )}

      <FormulaComponentList
        components={formulaComponents}
        onUseComponent={onUseComponent}
        onDeleteComponent={handleDeleteComponent}
      />
    </div>
  );
}
