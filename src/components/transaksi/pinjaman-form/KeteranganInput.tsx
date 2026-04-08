
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { KeteranganInputProps } from "./types";

export function KeteranganInput({ value, onChange }: KeteranganInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="keterangan">Keterangan</Label>
      <Textarea
        id="keterangan"
        placeholder="Keterangan tambahan (opsional)"
        value={value}
        onChange={handleChange}
        rows={3}
      />
      <p className="text-sm text-muted-foreground">
        Tambahkan keterangan untuk pinjaman ini jika diperlukan
      </p>
    </div>
  );
}
