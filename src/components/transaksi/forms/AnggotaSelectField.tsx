
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnggotaSelectFieldProps {
  anggotaList: any[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
}

export function AnggotaSelectField({ 
  anggotaList, 
  value, 
  onChange, 
  label = "Anggota", 
  required = true 
}: AnggotaSelectFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="anggota">{label} {required && "*"}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Pilih anggota" />
        </SelectTrigger>
        <SelectContent>
          {anggotaList.map((anggota: any) => (
            <SelectItem key={anggota.id} value={anggota.id}>
              {anggota.nama} - {anggota.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
