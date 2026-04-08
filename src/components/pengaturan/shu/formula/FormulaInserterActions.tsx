
import { FormulaBuilder } from "../FormulaBuilder";

interface FormulaInserterActionsProps {
  variables: { id: string; label: string; description: string; value: number }[];
  onInsertVariable: (variable: string) => void;
  onInsertOperator: (operator: string) => void;
  onInsertConstant: (constant: string) => void;
  onUseFormula: (formula: string) => void;
  settings?: any; // For FormulaLibrary
  setSettings?: (settings: any) => void; // For FormulaLibrary
}

export function FormulaInserterActions({
  variables,
  onInsertVariable,
  onInsertOperator,
  onInsertConstant,
  onUseFormula,
  settings,
  setSettings
}: FormulaInserterActionsProps) {
  return (
    <div className="mt-4">
      <FormulaBuilder 
        variables={variables}
        onInsertVariable={onInsertVariable}
        onInsertOperator={onInsertOperator}
        onInsertConstant={onInsertConstant}
        onUseFormula={onUseFormula}
        settings={settings}
        setSettings={setSettings}
      />
    </div>
  );
}
