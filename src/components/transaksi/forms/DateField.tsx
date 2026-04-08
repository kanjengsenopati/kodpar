
import { Label } from "@/components/ui/label";
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
      <Label htmlFor="tanggal">{label} {required && "*"}</Label>
      <Input
        id="tanggal"
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
    </div>
  );
}
