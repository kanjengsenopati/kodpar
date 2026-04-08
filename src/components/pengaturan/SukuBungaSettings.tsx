
import { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Percent, Save, Shield, CreditCard } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Pengaturan } from "@/types";
import { useToast } from "@/components/ui/use-toast";
import { updatePengaturan } from "@/services/pengaturanService";
import { getPinjamanCategories } from "@/services/transaksi/categories";

interface SukuBungaSettingsProps {
  settings: Pengaturan;
  setSettings: React.Dispatch<React.SetStateAction<Pengaturan>>;
}

export function SukuBungaSettings({ settings, setSettings }: SukuBungaSettingsProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pinjamanCategories = getPinjamanCategories();
  
  const handleSukuBungaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      sukuBunga: {
        ...prev.sukuBunga,
        [name]: parseFloat(value)
      }
    }));
  };
  
  const handleCategoryBungaChange = (category: string, value: string) => {
    const floatValue = parseFloat(value);
    
    setSettings(prev => ({
      ...prev,
      sukuBunga: {
        ...prev.sukuBunga,
        pinjamanByCategory: {
          ...(prev.sukuBunga.pinjamanByCategory || {}),
          [category]: floatValue
        }
      }
    }));
  };

  const handleDanaResikoChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      sukuBunga: {
        ...prev.sukuBunga,
        danaResikoKredit: {
          ...prev.sukuBunga.danaResikoKredit,
          [field]: value
        }
      }
    }));
  };

  const handleSimpananWajibChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      sukuBunga: {
        ...prev.sukuBunga,
        simpananWajibKredit: {
          ...prev.sukuBunga.simpananWajibKredit,
          [field]: value
        }
      }
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setSettings(prev => ({
      ...prev,
      sukuBunga: {
        ...prev.sukuBunga,
        metodeBunga: value as "flat" | "menurun"
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
        description: "Perubahan pengaturan suku bunga telah berhasil diterapkan",
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
  
  // Helper to safely get category bunga rate
  const getCategoryBungaRate = (category: string): number => {
    if (settings.sukuBunga.pinjamanByCategory && 
        category in settings.sukuBunga.pinjamanByCategory) {
      return settings.sukuBunga.pinjamanByCategory[category];
    }
    return settings.sukuBunga.pinjaman; // Default to general rate
  };

  // Format percentage for display
  const formatPercentage = (value: number): string => {
    return value.toString();
  };

  // Parse percentage from input
  const parsePercentage = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Percent size={18} className="text-koperasi-blue" />
          Pengaturan Suku Bunga
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="pinjaman">Bunga Pinjaman (% per bulan)</Label>
              <Input 
                id="pinjaman"
                name="pinjaman"
                type="number" 
                value={settings.sukuBunga.pinjaman}
                onChange={handleSukuBungaChange}
                step="0.1" 
                min="0" 
                max="5"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Bunga umum yang diterapkan untuk pinjaman anggota
              </p>
            </div>
            <div>
              <Label htmlFor="simpanan">Bunga Simpanan (% per tahun)</Label>
              <Input 
                id="simpanan"
                name="simpanan"
                type="number"
                value={settings.sukuBunga.simpanan}
                onChange={handleSukuBungaChange}
                step="0.1" 
                min="0" 
                max="2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Bunga yang diberikan untuk simpanan anggota
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Dana Resiko Kredit Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-orange-600" />
              <h3 className="text-base font-medium">Dana Resiko Kredit</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.sukuBunga.danaResikoKredit?.enabled || false}
                  onCheckedChange={(checked) => handleDanaResikoChange('enabled', checked)}
                />
                <Label>Aktifkan Dana Resiko Kredit</Label>
              </div>
              
              {settings.sukuBunga.danaResikoKredit?.enabled && (
                <>
                  <div>
                    <Label htmlFor="dana-resiko-persen">Persentase (%)</Label>
                    <div className="relative">
                      <Input
                        id="dana-resiko-persen"
                        type="number"
                        value={formatPercentage(settings.sukuBunga.danaResikoKredit?.persentase || 0)}
                        onChange={(e) => handleDanaResikoChange('persentase', parsePercentage(e.target.value))}
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="2.00"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Contoh: 2.00 = 2%, 2.50 = 2.5%
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.sukuBunga.danaResikoKredit?.autoDeduction || false}
                      onCheckedChange={(checked) => handleDanaResikoChange('autoDeduction', checked)}
                    />
                    <Label>Auto Deduction</Label>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Simpanan Wajib Kredit Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-medium">Simpanan Wajib Kredit</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={settings.sukuBunga.simpananWajibKredit?.enabled || false}
                  onCheckedChange={(checked) => handleSimpananWajibChange('enabled', checked)}
                />
                <Label>Aktifkan Simpanan Wajib Kredit</Label>
              </div>
              
              {settings.sukuBunga.simpananWajibKredit?.enabled && (
                <>
                  <div>
                    <Label htmlFor="simpanan-wajib-persen">Persentase (%)</Label>
                    <div className="relative">
                      <Input
                        id="simpanan-wajib-persen"
                        type="number"
                        value={formatPercentage(settings.sukuBunga.simpananWajibKredit?.persentase || 0)}
                        onChange={(e) => handleSimpananWajibChange('persentase', parsePercentage(e.target.value))}
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="5.00"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 text-sm">%</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Contoh: 5.00 = 5%, 5.25 = 5.25%
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.sukuBunga.simpananWajibKredit?.autoDeduction || false}
                      onCheckedChange={(checked) => handleSimpananWajibChange('autoDeduction', checked)}
                    />
                    <Label>Auto Deduction</Label>
                  </div>
                </>
              )}
            </div>
          </div>

          <Separator className="my-6" />
          
          <div className="mt-8">
            <h3 className="text-base font-medium mb-4">Bunga Berdasarkan Kategori Pinjaman</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pinjamanCategories.map(category => (
                <div key={category}>
                  <Label htmlFor={`bunga-${category}`}>
                    Bunga Pinjaman {category} (% per bulan)
                  </Label>
                  <Input 
                    id={`bunga-${category}`}
                    type="number" 
                    value={getCategoryBungaRate(category)}
                    onChange={(e) => handleCategoryBungaChange(category, e.target.value)}
                    step="0.1" 
                    min="0" 
                    max="5"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-6">
            <Label htmlFor="metodeBunga">Metode Perhitungan Bunga Pinjaman</Label>
            <Select 
              value={settings.sukuBunga.metodeBunga}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="metodeBunga">
                <SelectValue placeholder="Pilih metode bunga" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flat">Flat</SelectItem>
                <SelectItem value="menurun">Menurun (Sliding)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              Metode perhitungan bunga yang digunakan untuk pinjaman
            </p>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg mt-6">
            <h3 className="font-medium text-sm mb-2">Contoh Perhitungan</h3>
            <p className="text-sm mb-2">
              Untuk pinjaman Rp 5.000.000 dengan tenor 12 bulan:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Bunga per bulan: Rp {(5000000 * settings.sukuBunga.pinjaman / 100).toLocaleString("id-ID")} ({settings.sukuBunga.pinjaman}%)</li>
              <li>Total bunga: Rp {(5000000 * settings.sukuBunga.pinjaman / 100 * 12).toLocaleString("id-ID")}</li>
              <li>Angsuran per bulan: Rp {((5000000 + (5000000 * settings.sukuBunga.pinjaman / 100 * 12)) / 12).toLocaleString("id-ID", { maximumFractionDigits: 0 })}</li>
              <li>Total yang harus dibayar: Rp {(5000000 + (5000000 * settings.sukuBunga.pinjaman / 100 * 12)).toLocaleString("id-ID")}</li>
            </ul>
            
            {/* Dana Resiko Kredit & Simpanan Wajib Kredit Examples */}
            {(settings.sukuBunga.danaResikoKredit?.enabled || settings.sukuBunga.simpananWajibKredit?.enabled) && (
              <>
                <h4 className="font-medium text-sm mt-4 mb-2">Potongan Otomatis:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {settings.sukuBunga.danaResikoKredit?.enabled && (
                    <li>Dana Resiko Kredit ({settings.sukuBunga.danaResikoKredit.persentase}%): Rp {(5000000 * (settings.sukuBunga.danaResikoKredit.persentase || 0) / 100).toLocaleString("id-ID")}</li>
                  )}
                  {settings.sukuBunga.simpananWajibKredit?.enabled && (
                    <li>Simpanan Wajib Kredit ({settings.sukuBunga.simpananWajibKredit.persentase}%): Rp {(5000000 * (settings.sukuBunga.simpananWajibKredit.persentase || 0) / 100).toLocaleString("id-ID")}</li>
                  )}
                </ul>
              </>
            )}
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
