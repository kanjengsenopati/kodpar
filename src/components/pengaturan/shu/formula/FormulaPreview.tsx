
import { formatCurrency } from "@/utils/formatters";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";

interface FormulaPreviewProps {
  previewResult: number;
  isValid: boolean;
  formula: string;
}

export function FormulaPreview({ previewResult, isValid, formula }: FormulaPreviewProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Pratinjau Hasil Formula
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-1">
          <div className="text-2xl font-semibold">
            {isValid ? formatCurrency(previewResult) : "Error"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Hasil pratinjau berdasarkan nilai contoh variabel
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm font-medium">Formula Aktif:</div>
          <code className="text-xs bg-muted p-2 rounded-md block mt-1 overflow-auto max-w-full whitespace-pre-wrap">
            {formula || "Belum ada formula yang diinput"}
          </code>
        </div>
      </CardContent>
    </Card>
  );
}
