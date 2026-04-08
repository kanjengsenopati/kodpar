
import { Card } from "@/components/ui/card";
import { Pengaturan } from "@/types";
import { FormulaEditorHeader } from "./FormulaEditorHeader";
import { FormulaEditorContent } from "./FormulaEditorContent";
import { FormulaEditorFooter } from "./FormulaEditorFooter";
import { useFormulaValidator } from "../hooks/useFormulaValidator";
import { useFormulaEditor } from "../hooks/useFormulaEditor";
import { toast } from "sonner";

interface FormulaEditorCardProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
  variables: { id: string; label: string; description: string; value: number }[];
}

export function FormulaEditorCard({ settings, setSettings, variables }: FormulaEditorCardProps) {
  // Get the initial formula from settings
  const initialFormula = settings.shu?.formula || "simpanan_khusus * 0.05 + simpanan_wajib * 0.015";
  
  // Use the formula editor hook
  const {
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
  } = useFormulaEditor({
    settings,
    setSettings,
    initialFormula
  });
  
  // Use the validator hook
  const { isValid, errorMessage, previewResult } = useFormulaValidator({
    formulaInput,
    variables
  });

  // Handle save button click
  const handleSave = () => {
    if (saveFormula(isValid, errorMessage)) {
      toast.success("Formula SHU berhasil disimpan dan akan digunakan untuk perhitungan SHU anggota");
    }
  };

  return (
    <Card className="border-2 border-muted">
      <FormulaEditorHeader />
      
      <FormulaEditorContent
        formulaInput={formulaInput}
        isEditing={isEditing}
        isSaving={isSaving}
        errorMessage={errorMessage}
        previewResult={previewResult}
        isValid={isValid}
        variables={variables}
        settings={settings}
        setSettings={setSettings}
        handleFormulaChange={handleFormulaChange}
        handleSave={handleSave}
        resetFormula={resetFormula}
        handleCursorChange={handleCursorChange}
        handleInsertVariable={handleInsertVariable}
        handleInsertOperator={handleInsertOperator}
        handleInsertConstant={handleInsertConstant}
        handleUseFormula={handleUseFormula}
      />
      
      <FormulaEditorFooter 
        onSave={handleSave} 
        isValid={isValid} 
        isSaving={isSaving} 
      />
    </Card>
  );
}
