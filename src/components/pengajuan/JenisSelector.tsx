
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface JenisSelectorProps {
  value: "Simpan" | "Pinjam" | "Penarikan";
  onChange: (value: "Simpan" | "Pinjam" | "Penarikan") => void;
}

export function JenisSelector({ value, onChange }: JenisSelectorProps) {
  return (
    <div>
      <Label htmlFor="jenis" className="required">Jenis Pengajuan</Label>
      <Select 
        value={value} 
        onValueChange={(val) => onChange(val as "Simpan" | "Pinjam" | "Penarikan")}
        required
      >
        <SelectTrigger id="jenis">
          <SelectValue placeholder="Pilih jenis pengajuan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Simpan">Simpanan</SelectItem>
          <SelectItem value="Pinjam">Pinjaman</SelectItem>
          <SelectItem value="Penarikan">Penarikan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
