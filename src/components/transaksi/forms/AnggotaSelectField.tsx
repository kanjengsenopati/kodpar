import { Text } from "@/components/ui/text";
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
  required?: boolean;
}

export function AnggotaSelectField({ 
  anggotaList, 
  value, 
  onChange, 
  required = true 
}: AnggotaSelectFieldProps) {
  return (
    <div className="space-y-2">
      <Text.Label id="label-anggota">Pilih Anggota {required && "*"}</Text.Label>
      <Select
        value={value}
        onValueChange={onChange}
        required={required}
      >
        <SelectTrigger className="rounded-xl border-slate-100 bg-slate-50 focus:ring-blue-500">
          <SelectValue placeholder="-- Pilih Anggota --" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
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
