
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Calculator } from "lucide-react";

interface FormulaInputProps {
  algorithmType: 'shu' | 'thr';
  formula: string;
  onFormulaChange: (formula: string) => void;
  error: string | null;
  result: number | null;
}

export function FormulaInput({
  algorithmType,
  formula,
  onFormulaChange,
  error,
  result
}: FormulaInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`${algorithmType}-formula`} className="text-sm font-medium">
          Formula {algorithmType.toUpperCase()}
        </Label>
        <Input
          id={`${algorithmType}-formula`}
          value={formula}
          onChange={(e) => onFormulaChange(e.target.value)}
          placeholder={`Masukkan formula ${algorithmType.toUpperCase()}...`}
          className="mt-1 font-mono text-sm"
        />
      </div>

      {/* Validation Status */}
      {error ? (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : result !== null ? (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span>Preview hasil: <strong>{result.toLocaleString('id-ID')}</strong></span>
            </div>
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
