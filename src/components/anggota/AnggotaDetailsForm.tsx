
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { MonthYearPicker } from "@/components/ui/month-year-picker";
import { useUnitKerja } from "@/hooks/useUnitKerja";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AnggotaFormData {
  nama: string;
  nip?: string; 
  alamat: string;
  noHp: string;
  jenisKelamin: "L" | "P";
  agama: string;
  unitKerja: string;
  tanggalRegistrasi: string; // Format: "YYYY-MM"
}

interface AnggotaDetailsFormProps {
  formData: AnggotaFormData;
  anggotaId?: string;
  isEditMode: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

export function AnggotaDetailsForm({
  formData,
  anggotaId,
  isEditMode,
  onInputChange,
  onSelectChange,
}: AnggotaDetailsFormProps) {
  const { unitKerjaList, isLoading, refreshUnitKerja, syncWithAnggota } = useUnitKerja();
  const { toast } = useToast();

  const handleSyncUnitKerja = () => {
    const syncedCount = syncWithAnggota();
    if (syncedCount > 0) {
      toast({
        title: "Unit Kerja Diperbarui",
        description: `${syncedCount} unit kerja baru ditambahkan`,
      });
    } else {
      toast({
        title: "Unit Kerja Terbaru",
        description: "Semua unit kerja sudah tersinkronisasi",
      });
    }
  };

  // Calculate membership duration in years and months
  const calculateMembershipDuration = (registrationDate: string): string => {
    if (!registrationDate) return "Belum tersedia";
    
    try {
      let year: number, month: number;
      
      // Handle both old format (year only) and new format (YYYY-MM)
      if (registrationDate.includes('-')) {
        [year, month] = registrationDate.split('-').map(Number);
      } else {
        year = parseInt(registrationDate);
        month = 1; // Default to January for backward compatibility
      }
      
      if (isNaN(year) || isNaN(month)) return "Format tanggal tidak valid";
      
      const registrationDateObj = new Date(year, month - 1, 1);
      const currentDate = new Date();
      
      if (registrationDateObj > currentDate) return "Tanggal registrasi tidak valid";
      
      // Calculate difference in months
      const yearsDiff = currentDate.getFullYear() - year;
      const monthsDiff = currentDate.getMonth() - (month - 1);
      
      let totalMonths = yearsDiff * 12 + monthsDiff;
      
      if (totalMonths < 0) totalMonths = 0;
      
      const years = Math.floor(totalMonths / 12);
      const months = totalMonths % 12;
      
      if (years === 0 && months === 0) return "Anggota baru (bulan ini)";
      if (years === 0) return `${months} bulan`;
      if (months === 0) return `${years} tahun`;
      return `${years} tahun ${months} bulan`;
      
    } catch (error) {
      return "Error menghitung periode";
    }
  };
  
  return (
    <Card className="lg:col-span-2">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="id">ID Anggota</Label>
              <Input 
                id="id" 
                placeholder={isEditMode ? anggotaId : "ID akan digenerate otomatis"} 
                disabled 
              />
            </div>
            <div>
              <Label htmlFor="nip">NIP</Label>
              <Input 
                id="nip" 
                placeholder="Masukkan NIP (opsional)" 
                value={formData.nip || ''} 
                onChange={onInputChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="nama" className="required">Nama Lengkap</Label>
            <Input 
              id="nama" 
              placeholder="Masukkan nama lengkap" 
              value={formData.nama} 
              onChange={onInputChange} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="alamat" className="required">Alamat</Label>
            <Textarea 
              id="alamat" 
              placeholder="Masukkan alamat lengkap" 
              rows={3} 
              value={formData.alamat} 
              onChange={onInputChange} 
              required 
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="noHp" className="required">No HP / WA</Label>
              <Input 
                id="noHp" 
                placeholder="Contoh: 081234567890" 
                value={formData.noHp} 
                onChange={onInputChange} 
                required 
              />
            </div>
            
            <div>
              <Label className="required">Jenis Kelamin</Label>
              <RadioGroup 
                value={formData.jenisKelamin} 
                onValueChange={(value) => onSelectChange("jenisKelamin", value)} 
                className="flex gap-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="L" id="L" />
                  <Label htmlFor="L">Laki-laki</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="P" id="P" />
                  <Label htmlFor="P">Perempuan</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="agama" className="required">Agama</Label>
              <Select 
                value={formData.agama} 
                onValueChange={(value) => onSelectChange("agama", value)} 
                required
              >
                <SelectTrigger id="agama">
                  <SelectValue placeholder="Pilih agama" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ISLAM">Islam</SelectItem>
                  <SelectItem value="KRISTEN">Kristen</SelectItem>
                  <SelectItem value="KATOLIK">Katolik</SelectItem>
                  <SelectItem value="HINDU">Hindu</SelectItem>
                  <SelectItem value="BUDHA">Budha</SelectItem>
                  <SelectItem value="KEPERCAYAAN">Kepercayaan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="unitKerja" className="required">Unit Kerja</Label>
              <div className="flex gap-2">
                <Select 
                  value={formData.unitKerja} 
                  onValueChange={(value) => onSelectChange("unitKerja", value)} 
                  required
                >
                  <SelectTrigger id="unitKerja">
                    <SelectValue placeholder="Pilih unit kerja" />
                  </SelectTrigger>
                  <SelectContent>
                    {unitKerjaList.map((unit) => (
                      <SelectItem key={unit.id} value={unit.nama}>{unit.nama}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={refreshUnitKerja}
                    disabled={isLoading}
                    title="Refresh unit kerja"
                  >
                    <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleSyncUnitKerja}
                    title="Sinkronisasi unit kerja"
                  >
                    <Database className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {unitKerjaList.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  Belum ada unit kerja. Klik tombol sinkronisasi untuk mengambil dari data yang ada.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tanggalRegistrasi" className="required">Bulan & Tahun Registrasi</Label>
              <MonthYearPicker
                value={formData.tanggalRegistrasi}
                onValueChange={(value) => onSelectChange("tanggalRegistrasi", value)}
                placeholder="Pilih bulan dan tahun registrasi"
              />
            </div>
            
            <div>
              <Label>Lama Keanggotaan</Label>
              <div className="p-3 bg-muted rounded-md">
                <span className="text-sm font-medium">
                  {calculateMembershipDuration(formData.tanggalRegistrasi)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
