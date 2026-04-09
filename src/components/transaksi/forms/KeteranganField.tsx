import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";

interface KeteranganFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export function KeteranganField({ value, onChange }: KeteranganFieldProps) {
  return (
    <div className="space-y-2 md:col-span-2">
      <Text.Label id="label-keterangan">Keterangan Tambahan</Text.Label>
      <Textarea
        id="keterangan"
        placeholder="Informasi tambahan untuk transaksi ini..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all resize-none"
      />
    </div>
  );
}
