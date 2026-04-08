
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Pengaturan } from "@/types";
import { refreshAllSHUCalculations } from "@/services/transaksi/financialOperations/shuOperations";

interface UseFormulaEditorProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
  initialFormula: string;
}

export function useFormulaEditor({ 
  settings, 
  setSettings,
  initialFormula
}: UseFormulaEditorProps) {
  const [formulaInput, setFormulaInput] = useState(initialFormula);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Update formula input when settings change
  useEffect(() => {
    if (settings.shu?.formula && settings.shu.formula !== formulaInput && !isEditing) {
      setFormulaInput(settings.shu.formula);
    }
  }, [settings.shu?.formula, isEditing]);
  
  // Handle formula input change
  const handleFormulaChange = (value: string) => {
    setFormulaInput(value);
    setIsEditing(true);
  };

  // Save the formula
  const saveFormula = (isValid: boolean, errorMessage: string | null): boolean => {
    if (!isValid) {
      toast.error(`Error: ${errorMessage}`);
      return false;
    }
    
    try {
      setIsSaving(true);
      
      // Save the formula to settings
      const updatedSettings = {
        ...settings,
        shu: {
          ...(settings.shu || {}),
          formula: formulaInput
        }
      };
      
      // Update the settings
      setSettings(updatedSettings);
      
      // Force save to localStorage to ensure persistence
      import('@/services/pengaturanService').then(({ savePengaturan }) => {
        savePengaturan(updatedSettings);
        
        // Reset state
        setIsEditing(false);
        setIsSaving(false);
        
        console.log("Formula saved successfully:", formulaInput);
        
        // Set trigger in localStorage to notify other components of the change
        const timestamp = Date.now().toString();
        localStorage.setItem('shu_formula_updated', timestamp);
        
        // Force refresh all SHU calculations
        refreshAllSHUCalculations();
        
        // Dispatch custom events for immediate notification
        window.dispatchEvent(new Event('storage'));
        const formulaChangeEvent = new CustomEvent('shu-formula-changed', {
          detail: { formula: formulaInput, timestamp }
        });
        window.dispatchEvent(formulaChangeEvent);
      });
      
      return true;
    } catch (error) {
      console.error("Error saving formula:", error);
      toast.error("Terjadi kesalahan saat menyimpan formula");
      setIsSaving(false);
      return false;
    }
  };

  // Reset the formula to the saved one
  const resetFormula = () => {
    setFormulaInput(initialFormula);
    setIsEditing(false);
  };

  // Handle cursor position change
  const handleCursorChange = (e: React.MouseEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    setCursorPosition(input.selectionStart || 0);
  };

  // Insert variable into the formula at cursor position
  const handleInsertVariable = useCallback((variableId: string) => {
    const start = formulaInput.substring(0, cursorPosition);
    const end = formulaInput.substring(cursorPosition);
    const newFormula = start + variableId + end;
    
    setFormulaInput(newFormula);
    setIsEditing(true);
    
    // Update cursor position
    setCursorPosition(cursorPosition + variableId.length);
  }, [cursorPosition, formulaInput]);

  // Insert operator into the formula at cursor position
  const handleInsertOperator = useCallback((operator: string) => {
    const start = formulaInput.substring(0, cursorPosition);
    const end = formulaInput.substring(cursorPosition);
    const newFormula = start + ` ${operator} ` + end;
    
    setFormulaInput(newFormula);
    setIsEditing(true);
    
    // Update cursor position
    setCursorPosition(cursorPosition + operator.length + 2); // +2 for spaces
  }, [cursorPosition, formulaInput]);

  // Insert constant into the formula at cursor position
  const handleInsertConstant = useCallback((constant: string) => {
    const start = formulaInput.substring(0, cursorPosition);
    const end = formulaInput.substring(cursorPosition);
    const newFormula = start + constant + end;
    
    setFormulaInput(newFormula);
    setIsEditing(true);
    
    // Update cursor position
    setCursorPosition(cursorPosition + constant.length);
  }, [cursorPosition, formulaInput]);

  // Use formula from library
  const handleUseFormula = useCallback((formula: string) => {
    // Decide whether to append or replace based on the current state
    if (formulaInput && !isEditing) {
      // Ask if user wants to replace or append
      if (window.confirm("Apakah Anda ingin mengganti formula yang sudah ada dengan yang baru?")) {
        setFormulaInput(formula);
      } else {
        // Append with operator
        const combinedFormula = `(${formulaInput}) + (${formula})`;
        setFormulaInput(combinedFormula);
      }
    } else {
      // If nothing yet or already editing, just insert at cursor
      const start = formulaInput.substring(0, cursorPosition);
      const end = formulaInput.substring(cursorPosition);
      const newFormula = start + formula + end;
      
      setFormulaInput(newFormula);
    }
    
    setIsEditing(true);
  }, [formulaInput, cursorPosition, isEditing]);

  return {
    formulaInput,
    isEditing,
    isSaving,
    handleFormulaChange,
    saveFormula,
    resetFormula,
    handleCursorChange,
    handleInsertVariable,
    handleInsertOperator,
    handleInsertConstant,
    handleUseFormula
  };
}
