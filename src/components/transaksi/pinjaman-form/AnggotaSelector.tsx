
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AnggotaSelectorProps } from "./types";

export function AnggotaSelector({
  anggotaList,
  selectedAnggotaId,
  onChange,
  disabled = false,
}: AnggotaSelectorProps) {
  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="anggota" className="required">
        Anggota
      </Label>
      <Select
        value={selectedAnggotaId}
        onValueChange={onChange}
        disabled={disabled}
        required
      >
        <SelectTrigger id="anggota" className={disabled ? "bg-muted" : ""}>
          <SelectValue placeholder="Pilih anggota" />
        </SelectTrigger>
        <SelectContent>
          {anggotaList.map((anggota) => (
            <SelectItem key={anggota.id} value={anggota.id}>
              {anggota.nama} - {anggota.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        {disabled
          ? "Anggota tidak dapat diubah pada mode edit"
          : "Pilih anggota yang akan melakukan pinjaman"}
      </p>
    </div>
  );
}
