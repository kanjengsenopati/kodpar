import { Text } from "@/components/ui/text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface KategoriSelectFieldProps {
  kategoriList: any[];
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function KategoriSelectField({ 
  kategoriList, 
  value, 
  onChange, 
  required = true 
}: KategoriSelectFieldProps) {
  return (
    <div className="space-y-2">
      <Text.Label id="label-kategori">Kategori Simpanan {required && "*"}</Text.Label>
      <Select
        value={value}
        onValueChange={onChange}
        required={required}
      >
        <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50">
          <SelectValue placeholder="-- Pilih Kategori --" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {kategoriList.map((kategori) => (
            <SelectItem key={kategori.id} value={kategori.id}>
              {kategori.nama}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
