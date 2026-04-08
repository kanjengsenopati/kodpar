
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { CustomVariable, Pengaturan } from "@/types";

interface UseCustomVariablesProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
}

export function useCustomVariables({ settings, setSettings }: UseCustomVariablesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newVariable, setNewVariable] = useState<CustomVariable>({
    id: "",
    name: "",
    description: "",
    valueType: "jumlah",
    value: 0,
  });
  const [editingVariable, setEditingVariable] = useState<CustomVariable>({
    id: "",
    name: "",
    description: "",
    valueType: "jumlah",
    value: 0,
  });

  // Get custom variables from settings or default to empty array
  const customVariables = settings.shu?.customVariables || [];

  // Add a new custom variable
  const handleAddVariable = () => {
    if (!newVariable.name) {
      toast.error("Nama variabel harus diisi");
      return;
    }

    // Generate variable ID based on name (alphanumeric only)
    const varId = newVariable.name.toLowerCase()
      .replace(/[^a-z0-9_]/g, '_') // Replace invalid chars with underscore
      .replace(/^[0-9]/, '_$&'); // Ensure ID doesn't start with a number

    // Check if ID already exists
    const exists = customVariables.some(v => 
      v.id === varId || v.name.toLowerCase() === newVariable.name.toLowerCase()
    );

    if (exists) {
      toast.error("Variabel dengan nama tersebut sudah ada");
      return;
    }

    const variable: CustomVariable = {
      id: varId,
      name: newVariable.name,
      description: newVariable.description || '',
      valueType: newVariable.valueType,
      value: newVariable.value
    };

    const updatedVariables = [
      ...customVariables,
      variable
    ];

    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        customVariables: updatedVariables
      }
    });

    // Reset form and close it
    setNewVariable({
      id: '',
      name: '',
      description: '',
      valueType: 'jumlah',
      value: 0
    });
    setIsAdding(false);
    toast.success("Variabel kustom berhasil ditambahkan");
  };

  // Start editing a variable
  const handleStartEdit = (variable: CustomVariable) => {
    setEditingVariable({...variable});
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingVariable({
      id: '',
      name: '',
      description: '',
      valueType: 'jumlah',
      value: 0
    });
  };

  // Save edited variable
  const handleSaveEdit = () => {
    if (!editingVariable.name) {
      toast.error("Nama variabel harus diisi");
      return;
    }

    // Check if name already exists (excluding the current variable)
    const nameExists = customVariables.some(v => 
      v.id !== editingVariable.id && 
      v.name.toLowerCase() === editingVariable.name.toLowerCase()
    );

    if (nameExists) {
      toast.error("Variabel dengan nama tersebut sudah ada");
      return;
    }

    const updatedVariables = customVariables.map(v => 
      v.id === editingVariable.id ? {...editingVariable} : v
    );

    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        customVariables: updatedVariables
      }
    });

    setIsEditing(false);
    setEditingVariable({
      id: '',
      name: '',
      description: '',
      valueType: 'jumlah',
      value: 0
    });
    
    toast.success("Variabel kustom berhasil diperbarui");
  };

  // Update variable value
  const handleUpdateValue = (id: string, value: number) => {
    const updatedVariables = customVariables.map(v => 
      v.id === id ? { ...v, value } : v
    );

    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        customVariables: updatedVariables
      }
    });
  };

  // Delete a custom variable
  const handleDeleteVariable = (id: string) => {
    const updatedVariables = customVariables.filter(v => v.id !== id);
    
    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        customVariables: updatedVariables
      }
    });
    
    toast.success("Variabel kustom berhasil dihapus");
  };

  return {
    customVariables,
    isAdding,
    setIsAdding,
    isEditing,
    setIsEditing,
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
  };
}
