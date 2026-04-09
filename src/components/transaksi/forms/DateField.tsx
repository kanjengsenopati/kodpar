import { Text } from "@/components/ui/text";
import { Input } from "@/components/ui/input";

interface DateFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export function DateField({ value, onChange, label = "Tanggal", required = true }: DateFieldProps) {
  return (
    <div className="space-y-2">
      <Text.Label id="label-tanggal">{label} {required && "*"}</Text.Label>
      <Input
        id="tanggal"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all"
      />
    </div>
  );
}
