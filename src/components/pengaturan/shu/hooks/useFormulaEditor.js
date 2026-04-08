
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

export function useFormulaEditor({ initialFormula, onSave }) {
  const [formula, setFormula] = useState(initialFormula || "");
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const formulaInputRef = useRef(null);
  
  // Validate formula
  const validateFormula = useCallback((formulaToValidate, variablesRecord) => {
    try {
      // Basic validation
      if (!formulaToValidate?.trim()) {
        setErrorMessage("Formula tidak boleh kosong");
        setIsValid(false);
        return false;
      }
      
      // Use Function constructor to test formula
      // eslint-disable-next-line no-new-func
      const testFunction = new Function(
        ...Object.keys(variablesRecord),
        `return ${formulaToValidate}`
      );
      
      // Execute with test values
      const result = testFunction(...Object.values(variablesRecord));
      
      if (typeof result !== 'number' || isNaN(result)) {
        setErrorMessage("Formula harus menghasilkan nilai numerik");
        setIsValid(false);
        return false;
      }
      
      // All good
      setErrorMessage(null);
      setIsValid(true);
      return true;
    } catch (error) {
      console.error("Formula validation error:", error);
      setErrorMessage(`Error: ${error instanceof Error ? error.message : 'Formula tidak valid'}`);
      setIsValid(false);
      return false;
    }
  }, []);

  // Handle formula change
  const handleFormulaChange = useCallback((newFormula) => {
    setFormula(newFormula);
  }, []);

  // Save formula
  const handleSaveFormula = useCallback(() => {
    if (!isValid) {
      toast.error(`Formula tidak valid: ${errorMessage || "Terjadi kesalahan"}`);
      return false;
    }
    
    const result = onSave(formula);
    
    if (result) {
      toast.success("Formula SHU berhasil disimpan");
    } else {
      toast.error("Gagal menyimpan formula SHU");
    }
    
    return result;
  }, [formula, isValid, errorMessage, onSave]);

  // Insert variable into formula
  const handleInsertVariable = useCallback((variableId) => {
    // Get current cursor position
    const input = formulaInputRef.current;
    if (!input) return;
    
    const cursorPosition = input.selectionStart || formula.length;
    
    // Insert variable at cursor position
    const newFormula = 
      formula.substring(0, cursorPosition) + 
      variableId + 
      formula.substring(cursorPosition);
    
    setFormula(newFormula);
    
    // Focus back on input and set cursor after inserted variable
    setTimeout(() => {
      if (input) {
        input.focus();
        const newCursorPosition = cursorPosition + variableId.length;
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  }, [formula]);

  // Insert operator into formula
  const handleInsertOperator = useCallback((operator) => {
    // Get current cursor position
    const input = formulaInputRef.current;
    if (!input) return;
    
    const cursorPosition = input.selectionStart || formula.length;
    
    // Insert operator with spaces at cursor position
    const newFormula = 
      formula.substring(0, cursorPosition) + 
      ` ${operator} ` + 
      formula.substring(cursorPosition);
    
    setFormula(newFormula);
    
    // Focus back on input and set cursor after inserted operator
    setTimeout(() => {
      if (input) {
        input.focus();
        const newCursorPosition = cursorPosition + operator.length + 2; // +2 for spaces
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  }, [formula]);

  return {
    formula,
    setFormula,
    isValid,
    setIsValid,
    errorMessage,
    setErrorMessage,
    formulaInputRef,
    validateFormula,
    handleFormulaChange,
    handleSaveFormula,
    handleInsertVariable,
    handleInsertOperator,
  };
}
