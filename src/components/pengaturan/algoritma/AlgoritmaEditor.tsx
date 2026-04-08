import { useState, useEffect } from "react";
import { Pengaturan } from "@/types";
import { validateFormula } from "@/services/keuangan/formulaEvaluatorService";
import { toast } from "sonner";
import { FormulaInput } from "./editor/FormulaInput";
import { MinMaxValueInputs } from "./editor/MinMaxValueInputs";
import { VariableSelector } from "./editor/VariableSelector";
import { OperatorSelector } from "./editor/OperatorSelector";
import { FormulaActions } from "./editor/FormulaActions";
import { FormulaGuidance } from "./editor/FormulaGuidance";

interface AlgoritmaEditorProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
  algorithmType: 'shu' | 'thr';
}

const availableVariables = [
  { id: "simpanan_pokok", label: "Simpanan Pokok", description: "Total simpanan pokok anggota" },
  { id: "simpanan_wajib", label: "Simpanan Wajib", description: "Total simpanan wajib anggota" },
  { id: "simpanan_khusus", label: "Simpanan Khusus", description: "Total simpanan khusus/sukarela anggota" },
  { id: "pinjaman", label: "Pinjaman", description: "Total pinjaman anggota" },
  { id: "jasa", label: "Jasa", description: "Jasa dari bunga pinjaman" },
  { id: "pendapatan", label: "Pendapatan", description: "Estimasi pendapatan anggota" },
  { id: "lama_keanggotaan", label: "Lama Keanggotaan", description: "Lama keanggotaan dalam tahun" },
  { id: "transaksi_amount", label: "Total Transaksi", description: "Total nilai transaksi anggota" },
  { id: "angsuran", label: "Angsuran", description: "Total angsuran yang dibayar" },
];

const operators = [
  { symbol: "+", label: "Tambah" },
  { symbol: "-", label: "Kurang" },
  { symbol: "*", label: "Kali" },
  { symbol: "/", label: "Bagi" },
  { symbol: "(", label: "Kurung Buka" },
  { symbol: ")", label: "Kurung Tutup" },
];

export function AlgoritmaEditor({ settings, setSettings, algorithmType }: AlgoritmaEditorProps) {
  const [formula, setFormula] = useState("");
  const [minValue, setMinValue] = useState<number>(0);
  const [maxValue, setMaxValue] = useState<number>(10000000);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [isSaved, setIsSaved] = useState(true);

  // Load current formula from settings
  useEffect(() => {
    const currentFormula = algorithmType === 'shu' 
      ? (settings.shu?.formula || "")
      : (settings.shu?.thrFormula || "");
    const currentMin = Number(settings.shu?.minValue || 0);
    const currentMax = Number(settings.shu?.maxValue || 10000000);
    
    setFormula(currentFormula);
    setMinValue(currentMin);
    setMaxValue(currentMax);
    setIsSaved(true);
  }, [settings, algorithmType]);

  // Convert variables to record for validation
  const variablesRecord = availableVariables.reduce((acc, v) => {
    acc[v.id] = 1000000; // Sample value for testing
    return acc;
  }, {} as Record<string, number>);

  // Add custom variables from settings
  const customVariables = settings.shu?.customVariables || [];
  customVariables.forEach(v => {
    variablesRecord[v.id] = v.value;
  });

  // Validate and evaluate formula
  const validateAndEvaluate = () => {
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
      setError(validation.error || "Formula tidak valid");
      setResult(null);
      return false;
    }
  };

  // Handle formula change
  const handleFormulaChange = (newFormula: string) => {
    setFormula(newFormula);
    setIsSaved(false);
    
    // Auto-validate after a brief delay
    setTimeout(() => {
      validateAndEvaluate();
    }, 500);
  };

  // Insert variable into formula
  const insertVariable = (variableId: string) => {
    setFormula(prev => prev + variableId);
    setIsSaved(false);
  };

  // Insert operator into formula
  const insertOperator = (operator: string) => {
    setFormula(prev => prev + ` ${operator} `);
    setIsSaved(false);
  };

  // Handle min value change
  const handleMinValueChange = (value: number) => {
    setMinValue(value);
    setIsSaved(false);
  };

  // Handle max value change
  const handleMaxValueChange = (value: number) => {
    setMaxValue(value);
    setIsSaved(false);
  };

  // Save formula
  const handleSave = () => {
    if (validateAndEvaluate()) {
      const updatedSettings = {
        ...settings,
        shu: {
          ...(settings.shu || {}),
          [algorithmType === 'shu' ? 'formula' : 'thrFormula']: formula,
          minValue: String(minValue),
          maxValue: String(maxValue)
        }
      };
      
      setSettings(updatedSettings);
      setIsSaved(true);
      toast.success(`Algoritma ${algorithmType.toUpperCase()} berhasil disimpan`);
    } else {
      toast.error(`Formula ${algorithmType.toUpperCase()} tidak valid: ${error}`);
    }
  };

  // Reset formula
  const handleReset = () => {
    const originalFormula = algorithmType === 'shu' 
      ? (settings.shu?.formula || "")
      : (settings.shu?.thrFormula || "");
    const originalMin = Number(settings.shu?.minValue || 0);
    const originalMax = Number(settings.shu?.maxValue || 10000000);
    
    setFormula(originalFormula);
    setMinValue(originalMin);
    setMaxValue(originalMax);
    setIsSaved(true);
    validateAndEvaluate();
  };

  return (
    <div className="space-y-6">
      {/* Operators - Moved to top for better UX */}
      <OperatorSelector
        operators={operators}
        onOperatorInsert={insertOperator}
      />

      {/* Formula Input */}
      <div className="space-y-4">
        <FormulaInput
          algorithmType={algorithmType}
          formula={formula}
          onFormulaChange={handleFormulaChange}
          error={error}
          result={result}
        />

        {/* Min/Max Values */}
        <MinMaxValueInputs
          minValue={minValue}
          maxValue={maxValue}
          onMinValueChange={handleMinValueChange}
          onMaxValueChange={handleMaxValueChange}
        />
      </div>

      {/* Available Variables */}
      <VariableSelector
        availableVariables={availableVariables}
        customVariables={customVariables}
        onVariableInsert={insertVariable}
      />

      {/* Action Buttons */}
      <FormulaActions
        onSave={handleSave}
        onReset={handleReset}
        onPreview={validateAndEvaluate}
        hasError={!!error}
        isSaved={isSaved}
      />

      {/* Usage Instructions */}
      <FormulaGuidance />
    </div>
  );
}
