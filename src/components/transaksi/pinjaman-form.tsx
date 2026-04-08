
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { updateTransaksi } from "@/services/transaksiService";
import { Transaksi } from "@/types";

interface PinjamanFormProps {
  anggotaList: any[];
  initialData?: Transaksi;
  onSuccess: () => void;
}

export function PinjamanForm({ anggotaList, initialData, onSuccess }: PinjamanFormProps) {
  const [formData, setFormData] = useState({
    tanggal: initialData?.tanggal || new Date().toISOString().split('T')[0],
    anggotaId: initialData?.anggotaId || "",
    jumlah: initialData?.jumlah?.toString() || "",
    kategori: initialData?.kategori || "",
    keterangan: initialData?.keterangan || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.anggotaId || !formData.jumlah) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (initialData) {
        // Update existing transaction
        const updatedTransaksi = updateTransaksi(initialData.id, {
          tanggal: formData.tanggal,
          anggotaId: formData.anggotaId,
          jenis: "Pinjam",
          jumlah: parseInt(formData.jumlah),
          kategori: formData.kategori,
          keterangan: formData.keterangan,
          status: initialData.status
        });

        if (updatedTransaksi) {
          onSuccess();
        }
      }
    } catch (error) {
      console.error("Error updating pinjaman:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {initialData ? "Edit Pinjaman" : "Form Pinjaman"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tanggal">Tanggal *</Label>
              <Input
                id="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) => handleInputChange("tanggal", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anggota">Anggota *</Label>
              <Select
                value={formData.anggotaId}
                onValueChange={(value) => handleInputChange("anggotaId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>
                <SelectContent>
                  {anggotaList.map((anggota: any) => (
                    <SelectItem key={anggota.id} value={anggota.id}>
                      {anggota.nama} - {anggota.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jumlah">Jumlah Pinjaman *</Label>
              <Input
                id="jumlah"
                type="number"
                placeholder="Masukkan jumlah pinjaman"
                value={formData.jumlah}
                onChange={(e) => handleInputChange("jumlah", e.target.value)}
                required
              />
              {formData.jumlah && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(parseInt(formData.jumlah || "0"))}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori</Label>
              <Select
                value={formData.kategori}
                onValueChange={(value) => handleInputChange("kategori", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reguler">Reguler</SelectItem>
                  <SelectItem value="Sertifikasi">Sertifikasi</SelectItem>
                  <SelectItem value="Musiman">Musiman</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                placeholder="Keterangan pinjaman (opsional)"
                value={formData.keterangan}
                onChange={(e) => handleInputChange("keterangan", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan..." : initialData ? "Update Pinjaman" : "Simpan Pinjaman"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
