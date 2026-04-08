
import { formatCurrency } from "@/utils/formatters";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface FormulaPreviewCardProps {
  result: number | null;
  error: string | null;
}

export function FormulaPreviewCard({ result, error }: FormulaPreviewCardProps) {
  return (
    <div className="border rounded-md p-4 bg-muted/30">
      <div className="text-sm mb-1">Hasil Kalkulasi SHU:</div>
      <div className="text-2xl font-semibold">
        {result !== null ? formatCurrency(result) : "Invalid"}
      </div>
      
      {error && (
        <div className="mt-2 text-destructive flex items-center text-sm gap-1">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
