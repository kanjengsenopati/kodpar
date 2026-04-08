
import { FormulaPreviewCard } from "./FormulaPreviewCard";
import { FormulaOperators } from "./FormulaOperators";
import { useEffect } from "react";

interface FormulaControlsGridProps {
  result: number | null;
  error: string | null;
  onInsertOperator: (operator: string) => void;
  onFormulaPreview?: (result: number | null) => void;
}

export function FormulaControlsGrid({
  result,
  error,
  onInsertOperator,
  onFormulaPreview
}: FormulaControlsGridProps) {
  // Send the preview result to parent if needed
  useEffect(() => {
    if (onFormulaPreview) {
      onFormulaPreview(result);
    }
  }, [result, onFormulaPreview]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Preview Result */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium">Preview</h3>
        <FormulaPreviewCard result={result} error={error} />
      </div>
      
      {/* Operator Buttons */}
      <div>
        <FormulaOperators onInsertOperator={onInsertOperator} />
      </div>
    </div>
  );
}
