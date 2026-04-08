
import { useState, useRef, useEffect, RefObject } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Save, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SHUManager } from "@/services/transaksi/financialOperations/SHUManager";
import { FormulaBar } from "../formula/FormulaBar";
import { FormulaPreview } from "../formula/FormulaPreview";
import { FormulaOperators } from "../formula-components/FormulaOperators";
import { Pengaturan } from "@/types";
import { toast } from "sonner";
import { savePengaturan } from "@/services/pengaturanService";

interface FormulaEditorSectionProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
  variablesRecord: Record<string, number>;
  formulaInputRef?: RefObject<HTMLInputElement>;
}

export function FormulaEditorSection({ 
  settings, 
  setSettings,
  variablesRecord,
  formulaInputRef
}: FormulaEditorSectionProps) {
  const [formula, setFormula] = useState(settings.shu?.formula || "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [previewResult, setPreviewResult] = useState<number>(0);
  const localFormulaInputRef = useRef<HTMLInputElement>(null);
  
  // Use passed ref or the local ref
  const inputRef = formulaInputRef || localFormulaInputRef;

  // Sync formula with settings
  useEffect(() => {
    if (settings.shu?.formula) {
      setFormula(settings.shu.formula);
      validateFormula(settings.shu.formula);
    }
  }, [settings.shu?.formula]);
  
  // Validate formula
  const validateFormula = (formulaToValidate: string) => {
    try {
      // Basic validation
      if (!formulaToValidate.trim()) {
        setErrorMessage("Formula tidak boleh kosong");
        setPreviewResult(0);
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
        setPreviewResult(0);
        return false;
      }
      
      // All good
      setErrorMessage(null);
      setPreviewResult(result);
      return true;
    } catch (error) {
      console.error("Formula validation error:", error);
      setErrorMessage(`Error: ${error instanceof Error ? error.message : 'Formula tidak valid'}`);
      setPreviewResult(0);
      return false;
    }
  };

  // Handle formula change
  const handleFormulaChange = (newFormula: string) => {
    setFormula(newFormula);
    validateFormula(newFormula);
  };

  // Handle save formula
  const handleSaveFormula = () => {
    if (!validateFormula(formula)) {
      toast.error("Formula tidak valid. Silakan perbaiki terlebih dahulu.");
      return;
    }

    setIsSaving(true);
    
    // Create updated settings object with new formula
    const updatedSettings = {
      ...settings,
      shu: {
        ...(settings.shu || {}),
        formula: formula
      }
    };
    
    // Update settings state
    setSettings(updatedSettings);
    
    // Save to localStorage to ensure persistence
    savePengaturan(updatedSettings);
    
    // Set a timestamp for formula update to trigger recalculations
    localStorage.setItem('shu_formula_updated', Date.now().toString());
    
    // Dispatch event for immediate update across components
    const formulaChangeEvent = new CustomEvent('shu-formula-changed', {
      detail: { formula, timestamp: Date.now() }
    });
    window.dispatchEvent(formulaChangeEvent);
    
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Formula SHU berhasil disimpan");
    }, 500);
  };

  // Handle reset formula
  const handleResetFormula = () => {
    // Reset to the current saved formula
    setFormula(settings.shu?.formula || "");
    validateFormula(settings.shu?.formula || "");
    toast.info("Formula dikembalikan ke nilai tersimpan");
  };

  // Insert operator
  const handleInsertOperator = (operator: string) => {
    // Get current cursor position
    const input = inputRef.current;
    if (!input) return;
    
    const cursorPosition = input.selectionStart || formula.length;
    
    // Insert operator with spaces at cursor position
    const newFormula = 
      formula.substring(0, cursorPosition) + 
      ` ${operator} ` + 
      formula.substring(cursorPosition);
    
    setFormula(newFormula);
    validateFormula(newFormula);
    
    // Focus back on input and set cursor after inserted operator
    setTimeout(() => {
      if (input) {
        input.focus();
        const newCursorPosition = cursorPosition + operator.length + 2; // +2 for spaces
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 10);
  };
  
  // Handle constant insertion
  const handleInsertValue = (value: string) => {
    // Get current cursor position
    const input = inputRef.current;
    if (!input) return;
    
    const cursorPosition = input.selectionStart || formula.length;
    
    // Insert value at cursor position
    const newFormula = 
      formula.substring(0, cursorPosition) + 
      value + 
      formula.substring(cursorPosition);
    
    setFormula(newFormula);
    validateFormula(newFormula);
    
    // Focus back on input and set cursor after inserted value
    setTimeout(() => {
      if (input) {
        input.focus();
        const newCursorPosition = cursorPosition + value.length;
        input.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 10);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5 text-primary" />
          Formula SHU
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div>
            <FormulaBar
              value={formula}
              onChange={handleFormulaChange}
              onEvaluate={() => validateFormula(formula)}
              variables={variablesRecord}
              error={errorMessage}
              isValid={!errorMessage}
              className="mb-2"
              inputRef={inputRef}
            />
            
            {errorMessage && (
              <Alert variant="destructive" className="mt-2">
                <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <FormulaOperators
                onInsertOperator={handleInsertOperator}
                onInsertValue={handleInsertValue}
              />
            </div>
            <div>
              <FormulaPreview
                previewResult={previewResult}
                isValid={!errorMessage}
                formula={formula}
              />
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t p-4">
        <Button 
          variant="outline"
          onClick={handleResetFormula}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
        
        <Button
          onClick={handleSaveFormula}
          disabled={!!errorMessage || isSaving || formula === settings.shu?.formula}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Menyimpan..." : "Simpan Formula"}
        </Button>
      </CardFooter>
    </Card>
  );
}
