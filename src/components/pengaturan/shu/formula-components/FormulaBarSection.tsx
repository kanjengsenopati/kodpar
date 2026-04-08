
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { FormulaBar } from "../formula/FormulaBar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface FormulaBarSectionProps {
  formula: string;
  setFormula: (formula: string) => void;
  evaluateFormula: () => boolean;
  error: string | null;
  isSaved: boolean;
  variablesRecord?: Record<string, number>;
}

export function FormulaBarSection({
  formula,
  setFormula,
  evaluateFormula,
  error,
  isSaved,
  variablesRecord = {}
}: FormulaBarSectionProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        Formula SHU
        {isSaved && <span className="text-green-500 text-xs">✓ Saved</span>}
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help ml-1" />
            </TooltipTrigger>
            <TooltipContent className="p-3 max-w-xs">
              <p className="text-xs">
                Formula akan digunakan untuk menghitung SHU anggota.
                Gunakan format desimal untuk persentase, 
                contoh: 5% ditulis sebagai 0.05
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </label>
      <FormulaBar
        value={formula}
        onChange={setFormula}
        onEvaluate={evaluateFormula}
        variables={variablesRecord} 
        error={error}
        isValid={!error}
        className="mb-2"
      />
    </div>
  );
}
