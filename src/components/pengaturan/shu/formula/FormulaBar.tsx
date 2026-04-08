
import React, { forwardRef, RefObject } from "react";
import { Input } from "@/components/ui/input";
import { evaluateFormulaWithVariables } from "@/services/keuangan/formulaEvaluatorService";

interface FormulaBarProps {
  value: string;
  onChange: (value: string) => void;
  onEvaluate?: () => boolean;
  variables?: Record<string, number>;
  error?: string | null;
  isValid?: boolean;
  className?: string;
  inputRef?: RefObject<HTMLInputElement>;
}

export function FormulaBar({ 
  value, 
  onChange, 
  onEvaluate, 
  variables = {}, 
  error, 
  isValid = true,
  className = "",
  inputRef
}: FormulaBarProps) {
  // Calculate result preview
  const previewResult = React.useMemo(() => {
    if (!value || !isValid) return null;
    
    try {
      const result = evaluateFormulaWithVariables(value, variables);
      return isNaN(result) ? null : result;
    } catch (e) {
      console.error("Formula evaluation error:", e);
      return null;
    }
  }, [value, variables, isValid]);
  
  return (
    <div className={`relative ${className}`}>
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => onEvaluate && onEvaluate()}
        placeholder="Masukkan formula SHU (contoh: simpanan_wajib * 0.05 + simpanan_khusus * 0.03)"
        className={`font-mono text-sm ${error ? 'border-red-500' : isValid ? 'border-green-500' : ''}`}
      />
      
      {isValid && previewResult !== null && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-muted px-2 py-0.5 rounded text-xs font-mono text-muted-foreground">
          = {previewResult.toLocaleString()}
        </div>
      )}
    </div>
  );
}
