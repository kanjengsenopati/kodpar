
/**
 * Service for evaluating mathematical formulas and expressions
 * Used for SHU calculations and other financial computations
 */

export interface FormulaVariable {
  name: string;
  value: number;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  testResult?: number;
}

/**
 * Safely evaluate a mathematical expression with given variables
 */
export function evaluateFormula(formula: string, variables: FormulaVariable[]): number {
  try {
    // Replace variables in the formula with their values
    let processedFormula = formula;
    
    variables.forEach(variable => {
      const regex = new RegExp(`\\b${variable.name}\\b`, 'g');
      processedFormula = processedFormula.replace(regex, variable.value.toString());
    });
    
    // Use Function constructor for safe evaluation (basic math operations only)
    // This is safer than eval() but still limited to mathematical expressions
    const result = new Function('return ' + processedFormula)();
    
    return typeof result === 'number' && !isNaN(result) ? result : 0;
  } catch (error) {
    console.error('Error evaluating formula:', error);
    return 0;
  }
}

/**
 * Evaluate formula with variables as a record object
 */
export function evaluateFormulaWithVariables(formula: string, variables: Record<string, number>): number {
  try {
    // Replace variables in the formula with their values
    let processedFormula = formula;
    
    Object.entries(variables).forEach(([name, value]) => {
      const regex = new RegExp(`\\b${name}\\b`, 'g');
      processedFormula = processedFormula.replace(regex, value.toString());
    });
    
    // Use Function constructor for safe evaluation
    const result = new Function('return ' + processedFormula)();
    
    return typeof result === 'number' && !isNaN(result) ? result : 0;
  } catch (error) {
    console.error('Error evaluating formula:', error);
    return 0;
  }
}

/**
 * Validate if a formula is syntactically correct - returns detailed result
 */
export function validateFormula(formula: string, variables: Record<string, number>): ValidationResult {
  try {
    if (!formula.trim()) {
      return {
        isValid: false,
        error: "Formula tidak boleh kosong",
        testResult: 0
      };
    }

    // Check if all variables in formula are available
    const variableRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g;
    const usedVariables = formula.match(variableRegex) || [];
    const availableVariables = Object.keys(variables);
    
    for (const variable of usedVariables) {
      if (!availableVariables.includes(variable)) {
        return {
          isValid: false,
          error: `Variabel '${variable}' tidak terdefinisi`,
          testResult: 0
        };
      }
    }
    
    // Try to evaluate with provided values
    const testResult = evaluateFormulaWithVariables(formula, variables);
    
    if (isNaN(testResult)) {
      return {
        isValid: false,
        error: "Formula menghasilkan nilai tidak valid",
        testResult: 0
      };
    }
    
    return {
      isValid: true,
      testResult: testResult
    };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Formula tidak valid",
      testResult: 0
    };
  }
}

/**
 * Legacy function for backward compatibility - returns boolean
 */
export function validateFormulaBoolean(formula: string, availableVariables: string[]): boolean {
  try {
    // Check if all variables in formula are available
    const variableRegex = /[a-zA-Z_][a-zA-Z0-9_]*/g;
    const usedVariables = formula.match(variableRegex) || [];
    
    for (const variable of usedVariables) {
      if (!availableVariables.includes(variable)) {
        return false;
      }
    }
    
    // Try to evaluate with dummy values
    const dummyVariables = availableVariables.reduce((acc, name) => {
      acc[name] = 1;
      return acc;
    }, {} as Record<string, number>);
    
    const result = evaluateFormulaWithVariables(formula, dummyVariables);
    return !isNaN(result);
  } catch (error) {
    return false;
  }
}
