
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpFromLine } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { createTransaksi } from "@/services/transaksiService";
import { calculateTotalSimpanan } from "@/services/transaksi/financialOperations";
import { getJenisOptions } from "@/services/jenisService";
import { Transaksi } from "@/types";
import { toast } from "@/components/ui/use-toast";

interface PenarikanFormProps {
  anggotaList: any[];
  initialData?: Transaksi;
  onSuccess: () => void;
}

export function PenarikanForm({ anggotaList, initialData, onSuccess }: PenarikanFormProps) {
  const [formData, setFormData] = useState({
    tanggal: initialData?.tanggal || new Date().toISOString().split('T')[0],
    anggotaId: initialData?.anggotaId || "",
    kategori: initialData?.kategori || "",
    jumlah: initialData?.jumlah?.toString() || "",
    keterangan: initialData?.keterangan || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableBalance, setAvailableBalance] = useState(0);

  // Get available simpanan categories
  const simpananCategories = getJenisOptions("Simpanan");

  const handleAnggotaChange = (anggotaId: string) => {
    setFormData(prev => ({ ...prev, anggotaId }));
    
    // Calculate available balance when anggota is selected
    if (anggotaId) {
      const totalSimpanan = calculateTotalSimpanan(anggotaId);
      setAvailableBalance(totalSimpanan);
    } else {
      setAvailableBalance(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.anggotaId || !formData.jumlah || !formData.kategori) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Harap lengkapi semua field yang wajib diisi termasuk kategori simpanan",
        variant: "destructive"
      });
      return;
    }

    const jumlahPenarikan = parseInt(formData.jumlah);
    
    // Check if withdrawal amount exceeds available balance
    if (jumlahPenarikan > availableBalance) {
      toast({
        title: "Saldo Tidak Mencukupi",
        description: `Jumlah penarikan (${formatCurrency(jumlahPenarikan)}) melebihi saldo tersedia (${formatCurrency(availableBalance)})`,
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newTransaksi = createTransaksi({
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jenis: "Penarikan",
        kategori: formData.kategori,
        jumlah: jumlahPenarikan,
        keterangan: formData.keterangan,
        status: "Sukses"
      });

      if (newTransaksi) {
        // Additional success toast for withdrawal specifically
        toast({
          title: "Penarikan Berhasil Diproses",
          description: `Penarikan ${formData.kategori} sebesar ${formatCurrency(jumlahPenarikan)} telah berhasil diproses dan saldo anggota telah diperbarui`,
        });
        onSuccess();
      } else {
        throw new Error("Failed to create penarikan");
      }
    } catch (error) {
      console.error("Error creating penarikan:", error);
      toast({
        title: "Gagal Memproses Penarikan",
        description: "Terjadi kesalahan saat memproses penarikan. Silakan periksa kembali data yang dimasukkan.",
        variant: "destructive"
      });
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
          <ArrowUpFromLine className="h-5 w-5" />
          {initialData ? "Edit Penarikan" : "Form Penarikan Simpanan"}
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
                onValueChange={handleAnggotaChange}
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
              {formData.anggotaId && (
                <p className="text-sm text-muted-foreground">
                  Saldo tersedia: <span className="font-semibold text-green-600">{formatCurrency(availableBalance)}</span>
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori Simpanan *</Label>
              <Select
                value={formData.kategori}
                onValueChange={(value) => handleInputChange("kategori", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori simpanan" />
                </SelectTrigger>
                <SelectContent>
                  {simpananCategories.map((kategori) => (
                    <SelectItem key={kategori.id} value={kategori.nama}>
                      {kategori.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jumlah">Jumlah Penarikan *</Label>
              <Input
                id="jumlah"
                type="number"
                placeholder="Masukkan jumlah penarikan"
                value={formData.jumlah}
                onChange={(e) => handleInputChange("jumlah", e.target.value)}
                max={availableBalance}
                required
              />
              {formData.jumlah && (
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(parseInt(formData.jumlah || "0"))}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                placeholder="Keterangan penarikan (opsional)"
                value={formData.keterangan}
                onChange={(e) => handleInputChange("keterangan", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting || !formData.anggotaId || !formData.kategori}>
              {isSubmitting ? "Memproses..." : initialData ? "Update Penarikan" : "Simpan Penarikan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
