
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface DateFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DateField({ value, onChange }: DateFieldProps) {
  return (
    <div>
      <Label htmlFor="tanggal" className="required">Tanggal</Label>
      <Input 
        id="tanggal" 
        type="date"
        value={value}
        onChange={onChange}
        required 
      />
    </div>
  );
}
