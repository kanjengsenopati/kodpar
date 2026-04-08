
import { useState, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Pengaturan } from "@/types";
import { validateFormula } from "@/services/keuangan/formulaEvaluatorService";
import { SheetFormulaHeader } from "./SheetFormulaHeader";
import { VariablesTable } from "./VariablesTable";
import { FormulaBarSection } from "./FormulaBarSection";
import { FormulaControlsGrid } from "./FormulaControlsGrid";
import { FormulaActions } from "./FormulaActions";
import { calculateSHUForSamples } from "@/utils/shuUtils";

interface SheetFormulaEditorProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
  variables: { id: string; label: string; description: string; value: number }[];
}

export function SheetFormulaEditor({
  settings,
  setSettings,
  variables
}: SheetFormulaEditorProps) {
  const [formula, setFormula] = useState(settings.shu?.formula || "");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Convert variables array to record for evaluation
  const variablesRecord = variables.reduce((acc, v) => {
    acc[v.id] = v.value;
    return acc;
  }, {} as Record<string, number>);
  
  // Add custom variables from settings
  const customVariables = settings.shu?.customVariables || [];
  customVariables.forEach(v => {
    variablesRecord[v.id] = v.value;
  });
  
  // Update formula state when settings change
  useEffect(() => {
    if (settings.shu?.formula && settings.shu.formula !== formula) {
      setFormula(settings.shu.formula);
      setIsSaved(true);
    }
  }, [settings.shu?.formula]);

  // Handle formula evaluation
  const evaluateCurrentFormula = useCallback(() => {
    if (!formula.trim()) {
      setError("Formula tidak boleh kosong");
      setResult(null);
      return false;
    }
    
    const validation = validateFormula(formula, variablesRecord);
    
    if (validation.isValid) {
      setError(null);
      setResult(validation.testResult || 0);
      return true;
    } else {
      setError(validation.error || "Invalid formula");
      setResult(null);
      return false;
    }
  }, [formula, variablesRecord]);
  
  // Auto-evaluate when formula changes
  useEffect(() => {
    evaluateCurrentFormula();
    setIsSaved(formula === (settings.shu?.formula || ""));
  }, [formula, evaluateCurrentFormula, settings.shu?.formula]);
  
  // Handle formula change
  const handleFormulaChange = (newFormula: string) => {
    setFormula(newFormula);
    setIsSaved(false);
  };
  
  // Handle save formula
  const handleSaveFormula = () => {
    if (evaluateCurrentFormula()) {
      setIsSaving(true);
      
      // Create updated settings object
      const updatedSettings = {
        ...settings,
        shu: {
          ...(settings.shu || {}),
          formula: formula
        }
      };
      
      // Update settings state
      setSettings(updatedSettings);
      
      // Force save to localStorage to ensure persistence
      import('@/services/pengaturanService').then(({ savePengaturan }) => {
        savePengaturan(updatedSettings);
        
        // Calculate sample SHU to verify formula works and force recalculation
        try {
          const sampleResults = calculateSHUForSamples();
          console.log("SHU calculation samples with new formula:", sampleResults);
          
          // Add a trigger to local storage to signal formula change
          const timestamp = Date.now().toString();
          localStorage.setItem('shu_formula_updated', timestamp);
          
          // Dispatch custom event for immediate update across components
          const formulaChangeEvent = new CustomEvent('shu-formula-changed', {
            detail: { formula, timestamp }
          });
          window.dispatchEvent(formulaChangeEvent);
        } catch (err) {
          console.error("Error testing formula with samples:", err);
        }
        
        setTimeout(() => {
          setIsSaved(true);
          setIsSaving(false);
          toast.success("Formula SHU berhasil disimpan dan akan langsung diterapkan");
        }, 500);
      });
      
      return true;
    } else {
      toast.error("Formula tidak valid: " + (error || "Terjadi kesalahan"));
      return false;
    }
  };
  
  // Insert variable to formula
  const insertVariable = (variable: string) => {
    setFormula(prev => prev + variable);
    setIsSaved(false);
  };
  
  // Insert operator to formula
  const insertOperator = (operator: string) => {
    setFormula(prev => prev + ` ${operator} `);
    setIsSaved(false);
  };
  
  // Handle reset formula
  const handleResetFormula = () => {
    setFormula(settings.shu?.formula || "");
    setIsSaved(true);
  };
  
  return (
    <Card className="shadow-md">
      <SheetFormulaHeader />
      
      <CardContent className="space-y-4">
        {/* Formula Bar Section */}
        <FormulaBarSection
          formula={formula}
          setFormula={handleFormulaChange}
          evaluateFormula={evaluateCurrentFormula}
          error={error}
          isSaved={isSaved}
          variablesRecord={variablesRecord}
        />
        
        {/* Formula Controls Grid */}
        <FormulaControlsGrid
          result={result}
          error={error}
          onInsertOperator={insertOperator}
        />
        
        <Separator className="my-4" />
        
        {/* Variables Table */}
        <VariablesTable 
          variables={variables}
          customVariables={customVariables}
          onInsertVariable={insertVariable}
        />
      </CardContent>
      
      {/* Formula Actions */}
      <FormulaActions
        isSaved={isSaved}
        isSaving={isSaving}
        hasError={!!error}
        onSave={handleSaveFormula}
        onReset={handleResetFormula}
      />
    </Card>
  );
}
