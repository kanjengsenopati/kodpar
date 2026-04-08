
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KategoriOption {
  id: string;
  nama: string;
  keterangan?: string;
}

interface KategoriSelectFieldProps {
  kategoriList: KategoriOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

export function KategoriSelectField({ 
  kategoriList, 
  value, 
  onChange, 
  label = "Kategori Simpanan", 
  placeholder = "Pilih kategori simpanan",
  required = true 
}: KategoriSelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="kategori">{label} {required && "*"}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {kategoriList.map((kategori) => (
            <SelectItem key={kategori.id} value={kategori.nama}>
              {kategori.nama}
              {kategori.keterangan && (
                <span className="text-xs text-muted-foreground ml-2">
                  - {kategori.keterangan}
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
