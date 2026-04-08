
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Clock, Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
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

interface TenorSettingsProps {
  settings: Pengaturan;
  setSettings: React.Dispatch<React.SetStateAction<Pengaturan>>;
}

export function TenorSettings({ settings, setSettings }: TenorSettingsProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Temporary state for tenor options checkboxes
  const [tenorOptions, setTenorOptions] = useState<{ [key: number]: boolean }>(() => {
    const options: { [key: number]: boolean } = {
      3: false,
      6: false,
      12: false,
      24: false,
      36: false
    };
    
    // Initialize tenor options from settings
    settings.tenor.tenorOptions.forEach(tenor => {
      options[tenor] = true;
    });
    
    return options;
  });
  
  const handleTenorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      tenor: {
        ...prev.tenor,
        [name]: parseInt(value)
      }
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      tenor: {
        ...prev.tenor,
        defaultTenor: parseInt(value)
      }
    }));
  };
  
  const handleTenorOptionChange = (tenor: number, checked: boolean) => {
    setTenorOptions(prev => ({
      ...prev,
      [tenor]: checked
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Update tenor options based on checkboxes
      const selectedOptions = Object.entries(tenorOptions)
        .filter(([_, isSelected]) => isSelected)
        .map(([tenor]) => parseInt(tenor));
        
      const updatedSettings = {
        ...settings,
        tenor: {
          ...settings.tenor,
          tenorOptions: selectedOptions
        }
      };
      
      updatePengaturan(updatedSettings);
      setSettings(updatedSettings);
      
      toast({
        title: "Pengaturan berhasil disimpan",
        description: "Perubahan pengaturan tenor telah berhasil diterapkan",
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
          <Clock size={18} className="text-koperasi-blue" />
          Pengaturan Tenor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="minTenor">Tenor Minimum (bulan)</Label>
              <Input 
                id="minTenor"
                name="minTenor"
                type="number" 
                value={settings.tenor.minTenor}
                onChange={handleTenorChange}
                min={1}
                max={12}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tenor pinjaman terendah yang diizinkan
              </p>
            </div>
            <div>
              <Label htmlFor="maxTenor">Tenor Maximum (bulan)</Label>
              <Input 
                id="maxTenor"
                name="maxTenor"
                type="number" 
                value={settings.tenor.maxTenor}
                onChange={handleTenorChange}
                min={12}
                max={60}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Tenor pinjaman tertinggi yang diizinkan
              </p>
            </div>
            <div>
              <Label htmlFor="defaultTenor">Tenor Default (bulan)</Label>
              <Select 
                value={settings.tenor.defaultTenor.toString()}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="defaultTenor">
                  <SelectValue placeholder="Pilih tenor default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Bulan</SelectItem>
                  <SelectItem value="6">6 Bulan</SelectItem>
                  <SelectItem value="12">12 Bulan</SelectItem>
                  <SelectItem value="24">24 Bulan</SelectItem>
                  <SelectItem value="36">36 Bulan</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Tenor yang dipilih secara default saat membuat pinjaman baru
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <Label>Opsi Tenor yang Tersedia</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tenor3"
                  checked={tenorOptions[3]}
                  onCheckedChange={(checked) => handleTenorOptionChange(3, checked === true)}
                />
                <label htmlFor="tenor3" className="text-sm">3 Bulan</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tenor6"
                  checked={tenorOptions[6]}
                  onCheckedChange={(checked) => handleTenorOptionChange(6, checked === true)}
                />
                <label htmlFor="tenor6" className="text-sm">6 Bulan</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tenor12"
                  checked={tenorOptions[12]}
                  onCheckedChange={(checked) => handleTenorOptionChange(12, checked === true)}
                />
                <label htmlFor="tenor12" className="text-sm">12 Bulan</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tenor24"
                  checked={tenorOptions[24]}
                  onCheckedChange={(checked) => handleTenorOptionChange(24, checked === true)}
                />
                <label htmlFor="tenor24" className="text-sm">24 Bulan</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="tenor36"
                  checked={tenorOptions[36]}
                  onCheckedChange={(checked) => handleTenorOptionChange(36, checked === true)}
                />
                <label htmlFor="tenor36" className="text-sm">36 Bulan</label>
              </div>
            </div>
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
