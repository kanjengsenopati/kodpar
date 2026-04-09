import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/formatters";

interface AmountFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export function AmountField({ 
  value, 
  onChange, 
  label = "Jumlah Simpanan", 
  required = true 
}: AmountFieldProps) {
  return (
    <div className="space-y-2">
      <Text.Label id="label-amount">{label} {required && "*"}</Text.Label>
      <div className="space-y-2">
        <Input
          id="jumlah"
          type="number"
          min="1"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all text-lg font-semibold"
        />
        {value && (
          <Text.Amount className="text-sm">
            {formatCurrency(parseInt(value || "0"))}
          </Text.Amount>
        )}
      </div>
    </div>
  );
}
