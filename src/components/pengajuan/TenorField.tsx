
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getPengaturan } from "@/services/pengaturanService";

interface TenorFieldProps {
  value?: number;
  onChange: (value: string) => void;
}

export function TenorField({ value, onChange }: TenorFieldProps) {
  const pengaturan = getPengaturan();

  return (
    <div>
      <Label htmlFor="tenor" className="required">
        Tenor Pinjaman (Bulan)
      </Label>
      <Select 
        value={value?.toString() || pengaturan?.tenor?.defaultTenor?.toString() || "12"}
        onValueChange={onChange}
        required
      >
        <SelectTrigger id="tenor">
          <SelectValue placeholder="Pilih tenor pinjaman" />
        </SelectTrigger>
        <SelectContent>
          {(pengaturan?.tenor?.tenorOptions || [3, 6, 12, 24, 36]).map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option} bulan
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground mt-1">
        Jangka waktu pengembalian pinjaman
      </p>
    </div>
  );
}
