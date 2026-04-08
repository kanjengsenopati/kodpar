
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/formatters";

interface AmountFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function AmountField({ 
  value, 
  onChange, 
  label = "Jumlah Simpanan", 
  placeholder = "Masukkan jumlah simpanan",
  required = true 
}: AmountFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="jumlah">{label} {required && "*"}</Label>
      <Input
        id="jumlah"
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      {value && (
        <p className="text-sm text-muted-foreground">
          {formatCurrency(parseInt(value || "0"))}
        </p>
      )}
    </div>
  );
}
