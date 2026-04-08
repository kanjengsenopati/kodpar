
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface KeteranganFieldProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
}

export function KeteranganField({ 
  value, 
  onChange, 
  label = "Keterangan", 
  placeholder = "Keterangan simpanan (opsional)",
  rows = 3 
}: KeteranganFieldProps) {
  return (
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="keterangan">{label}</Label>
      <Textarea
        id="keterangan"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
      />
    </div>
  );
}
