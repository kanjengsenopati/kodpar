
import { Label } from "@/components/ui/label";
import { Anggota } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AnggotaFieldProps {
  value: string;
  onChange: (value: string) => void;
  anggotaList: Anggota[];
}

export function AnggotaField({ value, onChange, anggotaList }: AnggotaFieldProps) {
  return (
    <div>
      <Label htmlFor="anggotaId" className="required">Anggota</Label>
      <Select 
        value={value}
        onValueChange={onChange}
        required
      >
        <SelectTrigger id="anggotaId">
          <SelectValue placeholder="Pilih anggota" />
        </SelectTrigger>
        <SelectContent>
          {anggotaList.map((anggota) => (
            <SelectItem key={anggota.id} value={anggota.id}>
              {anggota.nama} ({anggota.id})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
