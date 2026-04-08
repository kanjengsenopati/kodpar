
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pengaturan } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { updatePengaturan } from "@/services/pengaturanService";

interface DendaSettingsProps {
  settings: Pengaturan;
  setSettings: React.Dispatch<React.SetStateAction<Pengaturan>>;
}

export function DendaSettings({ settings, setSettings }: DendaSettingsProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleDendaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      denda: {
        ...prev.denda,
        [name]: name === "gracePeriod" ? parseInt(value) : parseFloat(value)
      }
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      denda: {
        ...prev.denda,
        metodeDenda: value as "harian" | "bulanan"
      }
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      updatePengaturan(settings);
      
      toast({
        title: "Pengaturan berhasil disimpan",
        description: "Perubahan pengaturan denda telah berhasil diterapkan",
      });
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan pengaturan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <AlertTriangle size={18} className="text-koperasi-blue" />
          Pengaturan Denda
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="persentase">Persentase Denda (% dari angsuran)</Label>
              <Input 
                id="persentase"
                name="persentase"
                type="number" 
                value={settings.denda.persentase}
                onChange={handleDendaChange}
                step="0.1" 
                min="0" 
                max="1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Persentase denda yang diterapkan pada keterlambatan pembayaran
              </p>
            </div>
            <div>
              <Label htmlFor="gracePeriod">Grace Period (hari)</Label>
              <Input 
                id="gracePeriod"
                name="gracePeriod"
                type="number" 
                value={settings.denda.gracePeriod}
                onChange={handleDendaChange}
                min="0" 
                max="10"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Jumlah hari tenggang sebelum denda diterapkan
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="metodeDenda">Metode Perhitungan Denda</Label>
            <Select 
              value={settings.denda.metodeDenda}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="metodeDenda">
                <SelectValue placeholder="Pilih metode denda" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="harian">Harian (dihitung per hari keterlambatan)</SelectItem>
                <SelectItem value="bulanan">Bulanan (flat per bulan keterlambatan)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Metode yang digunakan untuk menghitung denda keterlambatan
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg mt-6">
            <h3 className="font-medium text-sm mb-2">Contoh Perhitungan Denda</h3>
            <p className="text-sm mb-2">
              Untuk angsuran Rp 500.000 yang terlambat 10 hari:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                Perhitungan: Rp 500.000 x {settings.denda.persentase}% x 
                ({10} - {settings.denda.gracePeriod} [grace period]) = 
                Rp {(500000 * settings.denda.persentase / 100 * Math.max(0, 10 - settings.denda.gracePeriod)).toLocaleString("id-ID")}
              </li>
              <li>
                Total yang harus dibayar: 
                Rp {(500000 + (500000 * settings.denda.persentase / 100 * Math.max(0, 10 - settings.denda.gracePeriod))).toLocaleString("id-ID")}
              </li>
            </ul>
          </div>
          
          <div className="flex justify-end mt-6">
            <Button type="submit" className="gap-2" disabled={isSubmitting}>
              <Save size={16} /> Simpan Pengaturan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
