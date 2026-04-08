import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpFromLine, Info } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { createTransaksi } from "@/services/transaksiService";
import { getTransaksiByAnggotaId } from "@/services/transaksi/transaksiCore";
import { getJenisOptions } from "@/services/jenisService";
import { Transaksi } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PenarikanFormEnhancedProps {
  anggotaList: any[];
  initialData?: Transaksi;
  onSuccess: () => void;
}

interface SimpananByJenis {
  [key: string]: {
    total: number;
    transactions: Transaksi[];
  };
}

export function PenarikanFormEnhanced({ anggotaList, initialData, onSuccess }: PenarikanFormEnhancedProps) {
  const [formData, setFormData] = useState({
    tanggal: initialData?.tanggal || new Date().toISOString().split('T')[0],
    anggotaId: initialData?.anggotaId || "",
    kategori: initialData?.kategori || "",
    jumlah: initialData?.jumlah?.toString() || "",
    keterangan: initialData?.keterangan || ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [simpananByJenis, setSimpananByJenis] = useState<SimpananByJenis>({});
  const [selectedJenisBalance, setSelectedJenisBalance] = useState(0);

  // Get available simpanan categories
  const simpananCategories = getJenisOptions("Simpanan");

  const calculateSimpananByJenis = (anggotaId: string): SimpananByJenis => {
    const transaksi = getTransaksiByAnggotaId(anggotaId);
    const simpananTransaksi = transaksi.filter(t => t.jenis === "Simpan" || t.jenis === "Penarikan");
    
    const result: SimpananByJenis = {};
    
    // Initialize all categories
    simpananCategories.forEach(kategori => {
      result[kategori.nama] = {
        total: 0,
        transactions: []
      };
    });
    
    // Calculate balances by category
    simpananTransaksi.forEach(tr => {
      const kategori = tr.kategori || "Simpanan Umum";
      if (!result[kategori]) {
        result[kategori] = { total: 0, transactions: [] };
      }
      
      if (tr.jenis === "Simpan") {
        result[kategori].total += tr.jumlah;
      } else if (tr.jenis === "Penarikan") {
        result[kategori].total -= tr.jumlah;
      }
      
      result[kategori].transactions.push(tr);
    });
    
    return result;
  };

  const handleAnggotaChange = (anggotaId: string) => {
    setFormData(prev => ({ ...prev, anggotaId, kategori: "" }));
    
    if (anggotaId) {
      const simpananData = calculateSimpananByJenis(anggotaId);
      setSimpananByJenis(simpananData);
    } else {
      setSimpananByJenis({});
    }
    setSelectedJenisBalance(0);
  };

  const handleKategoriChange = (kategori: string) => {
    setFormData(prev => ({ ...prev, kategori }));
    
    if (kategori && simpananByJenis[kategori]) {
      setSelectedJenisBalance(simpananByJenis[kategori].total);
    } else {
      setSelectedJenisBalance(0);
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
    
    // Check if withdrawal amount exceeds available balance for specific category
    if (jumlahPenarikan > selectedJenisBalance) {
      toast({
        title: "Saldo Tidak Mencukupi",
        description: `Jumlah penarikan (${formatCurrency(jumlahPenarikan)}) melebihi saldo ${formData.kategori} yang tersedia (${formatCurrency(selectedJenisBalance)})`,
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
        toast({
          title: "Penarikan Berhasil Diproses",
          description: `Penarikan ${formData.kategori} sebesar ${formatCurrency(jumlahPenarikan)} telah berhasil diproses`,
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori Simpanan *</Label>
              <Select
                value={formData.kategori}
                onValueChange={handleKategoriChange}
                disabled={!formData.anggotaId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori simpanan" />
                </SelectTrigger>
                <SelectContent>
                  {simpananCategories.map((kategori) => {
                    const balance = simpananByJenis[kategori.nama]?.total || 0;
                    return (
                      <SelectItem key={kategori.id} value={kategori.nama} disabled={balance <= 0}>
                        {kategori.nama} - {formatCurrency(balance)}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {formData.kategori && selectedJenisBalance > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Saldo {formData.kategori}: <span className="font-semibold text-green-600">{formatCurrency(selectedJenisBalance)}</span>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="jumlah">Jumlah Penarikan *</Label>
              <Input
                id="jumlah"
                type="number"
                placeholder="Masukkan jumlah penarikan"
                value={formData.jumlah}
                onChange={(e) => handleInputChange("jumlah", e.target.value)}
                max={selectedJenisBalance}
                disabled={!formData.kategori}
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

          {/* Preview Section */}
          {formData.anggotaId && Object.keys(simpananByJenis).length > 0 && (
            <Card className="bg-gray-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Ringkasan Simpanan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  {Object.entries(simpananByJenis).map(([jenis, data]) => (
                    <div key={jenis} className="flex justify-between">
                      <span>{jenis}:</span>
                      <span className={`font-medium ${data.total > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                        {formatCurrency(data.total)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-4 pt-4">
            <Button type="submit" className="flex-1" disabled={isSubmitting || !formData.anggotaId || !formData.kategori || selectedJenisBalance <= 0}>
              {isSubmitting ? "Memproses..." : initialData ? "Update Penarikan" : "Simpan Penarikan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
