
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface KeteranganFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function KeteranganField({ value, onChange }: KeteranganFieldProps) {
  return (
    <div>
      <Label htmlFor="keterangan">Keterangan</Label>
      <Textarea 
        id="keterangan" 
        placeholder="Masukkan keterangan (opsional)" 
        rows={3}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
