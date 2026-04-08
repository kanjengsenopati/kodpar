
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Save, X, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormulaInputProps {
  formulaInput: string;
  onFormulaChange: (value: string) => void;
  onSave: () => void;
  onReset: () => void;
  isEditing: boolean;
  isSaving: boolean;
  errorMessage: string | null;
  onCursorChange: (e: React.MouseEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => void;
}

export function FormulaInput({
  formulaInput,
  onFormulaChange,
  onSave,
  onReset,
  isEditing,
  isSaving,
  errorMessage,
  onCursorChange,
}: FormulaInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="formula" className="text-sm font-medium">Formula SHU</Label>
      <div className="flex space-x-2">
        <div className="flex-1">
          <Input
            id="formula"
            value={formulaInput}
            onChange={(e) => onFormulaChange(e.target.value)}
            onClick={onCursorChange}
            onKeyUp={onCursorChange}
            placeholder="Masukkan formula SHU (contoh: simpanan_wajib * 0.05 + simpanan_khusus * 0.03)"
            className={`font-mono text-sm ${errorMessage ? "border-red-500" : ""}`}
          />
        </div>
        <Button
          type="button"
          onClick={onSave}
          disabled={isSaving || !!errorMessage}
          className="shrink-0 flex items-center gap-2"
          variant={errorMessage ? "outline" : "default"}
        >
          <Save className="h-4 w-4" /> 
          Simpan
        </Button>
        {isEditing && (
          <Button
            type="button"
            onClick={onReset}
            variant="outline"
            disabled={isSaving}
            className="shrink-0 flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>
      
      {errorMessage && (
        <Alert variant="destructive" className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <p className="text-sm text-muted-foreground">
        Ketik formula untuk menghitung SHU anggota. Gunakan variabel yang tersedia dan operator matematika.
      </p>
    </div>
  );
}
