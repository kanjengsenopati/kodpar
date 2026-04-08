
import { useState, useEffect } from 'react';
import { validateFormula } from '@/services/keuangan/formulaEvaluatorService';

interface FormulaValidatorProps {
  formulaInput: string;
  variables: { id: string; label: string; description: string; value: number }[];
}

interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
  previewResult: number;
}

export function useFormulaValidator({ 
  formulaInput, 
  variables 
}: FormulaValidatorProps): ValidationResult {
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: true,
    errorMessage: null,
    previewResult: 0
  });

  useEffect(() => {
    // Debounce validation to prevent excessive calculations while typing
    const debounceTimeout = setTimeout(() => {
      if (!formulaInput.trim()) {
        setValidation({
          isValid: false,
          errorMessage: "Formula tidak boleh kosong",
          previewResult: 0
        });
        return;
      }

      try {
        // Convert variables array to record object for validation
        const variablesRecord: Record<string, number> = {};
        variables.forEach(v => {
          variablesRecord[v.id] = v.value;
        });

        // Use the service function to validate the formula
        const result = validateFormula(formulaInput, variablesRecord);
        
        if (!result.isValid) {
          setValidation({
            isValid: false,
            errorMessage: result.error || "Formula tidak valid",
            previewResult: result.testResult || 0
          });
          return;
        }
        
        setValidation({
          isValid: true,
          errorMessage: null,
          previewResult: result.testResult || 0
        });
      } catch (error) {
        // Provide more specific error messages
        const errorMessage = error instanceof Error ? error.message : "Formula tidak valid";
        
        // Check for common errors and provide user-friendly messages
        let friendlyMessage = "Formula tidak valid";
        
        if (errorMessage.includes("undefined")) {
          friendlyMessage = "Formula menggunakan variabel yang tidak terdefinisi";
        } else if (errorMessage.includes("unexpected token")) {
          friendlyMessage = "Formula mengandung sintaks yang tidak valid";
        } else if (errorMessage.includes("division by zero")) {
          friendlyMessage = "Pembagian dengan angka nol tidak diperbolehkan";
        }
        
        setValidation({
          isValid: false,
          errorMessage: friendlyMessage,
          previewResult: 0
        });
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimeout);
  }, [formulaInput, variables]);

  return validation;
}
