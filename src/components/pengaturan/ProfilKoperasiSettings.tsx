import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Phone, Save } from "lucide-react";
import { toast } from "sonner";
import { Pengaturan } from "@/types";
import { savePengaturan } from "@/services/pengaturanService";

interface ProfilKoperasiSettingsProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
}

export function ProfilKoperasiSettings({ settings, setSettings }: ProfilKoperasiSettingsProps) {
  const [namaKoperasi, setNamaKoperasi] = useState(settings.profil?.namaKoperasi || "Koperasi-ERP");
  const [alamat, setAlamat] = useState(settings.profil?.alamat || "");
  const [telepon, setTelepon] = useState(settings.profil?.telepon || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    const updatedSettings: Pengaturan = {
      ...settings,
      profil: {
        namaKoperasi,
        alamat,
        telepon
      }
    };
    
    setSettings(updatedSettings);
    savePengaturan(updatedSettings);
    
    setIsEditing(false);
    toast.success("Profil koperasi berhasil disimpan");
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setter(e.target.value);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="nama-koperasi" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Nama Koperasi
              </Label>
              <Input
                id="nama-koperasi"
                value={namaKoperasi}
                onChange={handleChange(setNamaKoperasi)}
                placeholder="Masukkan nama koperasi"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="alamat" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Alamat
              </Label>
              <Textarea
                id="alamat"
                value={alamat}
                onChange={handleChange(setAlamat)}
                placeholder="Masukkan alamat koperasi"
                rows={3}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="telepon" className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> Nomor Telepon
              </Label>
              <Input
                id="telepon"
                value={telepon}
                onChange={handleChange(setTelepon)}
                placeholder="Masukkan nomor telepon"
              />
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={!isEditing}
                className="gap-2"
              >
                <Save className="h-4 w-4" /> Simpan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-4">Pratinjau Identitas Koperasi</h3>
          
          <div className="border rounded-lg p-4 text-center">
            <h4 className="font-bold text-lg">{namaKoperasi}</h4>
            <p className="text-sm text-muted-foreground">{alamat}</p>
            <p className="text-sm text-muted-foreground">Telp: {telepon}</p>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Identitas koperasi akan ditampilkan pada semua bukti transaksi cetak dan dokumen resmi lainnya.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
