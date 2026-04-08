
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";
import { NominalInputField } from "@/components/ui/NominalInputField";
import { usePengajuanAmount } from "@/hooks/usePengajuanAmount";

interface JumlahFieldProps {
  jenis: "Simpan" | "Pinjam" | "Penarikan";
  anggotaId?: string;
  value: number;
  onChange: (value: number) => void;
}

export function JumlahField({ jenis, anggotaId, value, onChange }: JumlahFieldProps) {
  // Use the hook only for validation and help text, not for state management
  const {
    placeholder,
    helpText,
    validation
  } = usePengajuanAmount({
    jenis,
    anggotaId,
    initialAmount: value
  });

  const getJumlahLabel = () => {
    switch (jenis) {
      case "Simpan": return "Jumlah Simpanan";
      case "Pinjam": return "Jumlah Pinjaman";
      case "Penarikan": return "Jumlah Penarikan";
      default: return "Jumlah";
    }
  };

  // Simple validation function
  const validateAmount = (amount: number) => {
    if (amount <= 0) return null;
    
    const minAmount = 1000;
    if (amount < minAmount) {
      return {
        error: `Jumlah minimal ${jenis.toLowerCase()} adalah Rp ${minAmount.toLocaleString('id-ID')}`
      };
    }
    
    if (amount >= 100000000) {
      return {
        warning: `Jumlah ${jenis.toLowerCase()} sangat besar, pastikan data sudah benar`
      };
    }
    
    return null;
  };

  const currentValidation = validateAmount(value);

  return (
    <div>
      <Label htmlFor="jumlah" className="required">
        {getJumlahLabel()} (Rp)
      </Label>
      <NominalInputField
        id="jumlah"
        value={value}
        onValueChange={onChange}
        required
        placeholder={`Contoh: ${placeholder}`}
      />
      
      {/* Validation Messages */}
      {currentValidation?.error && (
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{currentValidation.error}</AlertDescription>
        </Alert>
      )}
      
      {currentValidation?.warning && (
        <Alert className="mt-2">
          <Info className="h-4 w-4" />
          <AlertDescription>{currentValidation.warning}</AlertDescription>
        </Alert>
      )}
      
      <p className="text-xs text-muted-foreground mt-1">
        {helpText}
      </p>
    </div>
  );
}
