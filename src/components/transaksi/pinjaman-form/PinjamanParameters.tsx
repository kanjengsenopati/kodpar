
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getPengaturan } from "@/services/pengaturanService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PinjamanParametersProps } from "./types";

export function PinjamanParameters({
  tanggal,
  tenor,
  bunga,
  onChange,
}: PinjamanParametersProps) {
  const pengaturan = getPengaturan();
  const tenorOptions = pengaturan.tenor?.tenorOptions || [3, 6, 12, 24];

  return (
    <div className="grid gap-4">
      <h3 className="text-base font-medium">Parameter Pinjaman</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="grid w-full gap-2">
          <Label htmlFor="tanggal" className="required">
            Tanggal Pinjaman
          </Label>
          <Input
            type="date"
            id="tanggal"
            value={tanggal}
            onChange={(e) => onChange("tanggal", e.target.value)}
            required
          />
        </div>

        <div className="grid w-full gap-2">
          <Label htmlFor="tenor" className="required">
            Tenor (Bulan)
          </Label>
          <Select
            value={tenor.toString()}
            onValueChange={(value) => onChange("tenor", parseInt(value))}
          >
            <SelectTrigger id="tenor">
              <SelectValue placeholder="Pilih tenor" />
            </SelectTrigger>
            <SelectContent>
              {tenorOptions.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option} bulan
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full gap-2">
          <Label htmlFor="bunga" className="required">
            Bunga (%)
          </Label>
          <Input
            id="bunga"
            type="number"
            step="0.1"
            min="0"
            value={bunga}
            onChange={(e) => onChange("bunga", parseFloat(e.target.value))}
            required
          />
          <p className="text-xs text-muted-foreground">
            Suku bunga flat per bulan
          </p>
        </div>
      </div>
    </div>
  );
}
