
import { Button } from "@/components/ui/button";
import { Save, RotateCcw, Eye, Loader2 } from "lucide-react";

interface FormulaActionsProps {
  onSave: () => void;
  onReset: () => void;
  onPreview: () => void;
  hasError: boolean;
  isSaved: boolean;
}

export function FormulaActions({
  onSave,
  onReset,
  onPreview,
  hasError,
  isSaved
}: FormulaActionsProps) {
  return (
    <div className="flex gap-2 justify-end">
      <Button
        variant="outline"
        onClick={onPreview}
        className="flex items-center gap-2"
      >
        <Eye className="h-4 w-4" />
        Preview
      </Button>
      
      <Button
        variant="outline"
        onClick={onReset}
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Reset
      </Button>
      
      <Button
        onClick={onSave}
        disabled={hasError}
        className="flex items-center gap-2"
        variant={isSaved ? "outline" : "default"}
      >
        {!isSaved && <Loader2 className="h-4 w-4 animate-spin" />}
        <Save className="h-4 w-4" />
        {isSaved ? "Tersimpan" : "Simpan"}
      </Button>
    </div>
  );
}
