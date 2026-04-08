import { useState, useEffect } from "react";
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
import { Calculator } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { updateTransaksi, createTransaksi } from "@/services/transaksiService";
import { Transaksi } from "@/types";
import { LoanSelectionPreview } from "./angsuran/LoanSelectionPreview";
import { useToast } from "@/hooks/use-toast";
import { calculateAngsuranAllocation } from "@/services/akuntansi/accountingSyncService";
import { getTransaksiById } from "@/services/transaksiService";

interface AngsuranFormProps {
  anggotaList: any[];
  initialData?: Transaksi;
  onSuccess: () => void;
}

export function AngsuranForm({ anggotaList, initialData, onSuccess }: AngsuranFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    tanggal: initialData?.tanggal || new Date().toISOString().split('T')[0],
    anggotaId: initialData?.anggotaId || "",
    jumlah: initialData?.jumlah?.toString() || "",
    keterangan: initialData?.keterangan || ""
  });

  const [selectedLoanId, setSelectedLoanId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestedAmount, setSuggestedAmount] = useState<number>(0);
  const [allocationPreview, setAllocationPreview] = useState<{
    nominalJasa: number;
    nominalPokok: number;
  } | null>(null);

  // Calculate allocation preview when amount or loan changes
  useEffect(() => {
    if (selectedLoanId && formData.jumlah && parseInt(formData.jumlah) > 0) {
      const pinjaman = getTransaksiById(selectedLoanId);
      if (pinjaman) {
        const allocation = calculateAngsuranAllocation(
          pinjaman, 
          parseInt(formData.jumlah), 
          formData.anggotaId
        );
        setAllocationPreview({
          nominalJasa: allocation.nominalJasa,
          nominalPokok: allocation.nominalPokok
        });
      }
    } else {
      setAllocationPreview(null);
    }
  }, [selectedLoanId, formData.jumlah, formData.anggotaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.anggotaId || !formData.jumlah || !selectedLoanId) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }

    const jumlahAngsuran = parseInt(formData.jumlah);
    if (jumlahAngsuran <= 0) {
      toast({
        title: "Jumlah tidak valid",
        description: "Jumlah angsuran harus lebih dari 0",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Enhanced keterangan with allocation info
      let enhancedKeterangan = `${formData.keterangan} - Pinjaman: ${selectedLoanId}`;
      if (allocationPreview) {
        const allocationInfo = ` (Jasa Bulanan: ${formatCurrency(allocationPreview.nominalJasa)}, Pokok: ${formatCurrency(allocationPreview.nominalPokok)})`;
        enhancedKeterangan += allocationInfo;
      }

      if (initialData) {
        // Update existing transaction
        const updatedTransaksi = updateTransaksi(initialData.id, {
          tanggal: formData.tanggal,
          anggotaId: formData.anggotaId,
          jenis: "Angsuran",
          jumlah: jumlahAngsuran,
          keterangan: enhancedKeterangan,
          status: initialData.status
        });

        if (updatedTransaksi) {
          toast({
            title: "Angsuran berhasil diupdate",
            description: `Transaksi dengan ID ${updatedTransaksi.id} telah diperbarui dan disinkronkan ke akuntansi`,
          });
          onSuccess();
        } else {
          throw new Error("Gagal mengupdate transaksi");
        }
      } else {
        // Create new transaction
        const newTransaksi = createTransaksi({
          tanggal: formData.tanggal,
          anggotaId: formData.anggotaId,
          jenis: "Angsuran",
          jumlah: jumlahAngsuran,
          keterangan: enhancedKeterangan,
          status: "Sukses"
        });

        if (newTransaksi) {
          toast({
            title: "Angsuran berhasil disimpan",
            description: `Transaksi dengan ID ${newTransaksi.id} telah dibuat dan disinkronkan ke akuntansi`,
          });
          onSuccess();
        } else {
          throw new Error("Gagal membuat transaksi");
        }
      }
    } catch (error) {
      console.error("Error saving angsuran:", error);
      toast({
        title: "Gagal menyimpan angsuran",
        description: "Terjadi kesalahan saat menyimpan data transaksi",
        variant: "destructive",
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

  const handleAmountSuggestion = (amount: number) => {
    setSuggestedAmount(amount);
    // Don't automatically set the amount, just store the suggestion
  };

  const applySuggestedAmount = () => {
    if (suggestedAmount > 0) {
      handleInputChange("jumlah", suggestedAmount.toString());
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          {initialData ? "Edit Angsuran" : "Form Angsuran"}
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
          </div>

          {formData.anggotaId && (
            <LoanSelectionPreview
              anggotaId={formData.anggotaId}
              onLoanSelect={setSelectedLoanId}
              onAmountChange={handleAmountSuggestion}
              selectedLoanId={selectedLoanId}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="jumlah">Jumlah Angsuran *</Label>
              <div className="space-y-2">
                <Input
                  id="jumlah"
                  type="number"
                  min="1"
                  placeholder="Masukkan jumlah angsuran"
                  value={formData.jumlah}
                  onChange={(e) => handleInputChange("jumlah", e.target.value)}
                  required
                />
                {suggestedAmount > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">
                      Saran: {formatCurrency(suggestedAmount)}
                    </span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={applySuggestedAmount}
                    >
                      Gunakan
                    </Button>
                  </div>
                )}
                {formData.jumlah && (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(parseInt(formData.jumlah || "0"))}
                  </p>
                )}
                
                {/* Enhanced Allocation Preview */}
                {allocationPreview && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm font-medium text-blue-800 mb-2">Alokasi Pembayaran Bulanan:</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Jasa Bulanan (Prioritas):</span>
                        <span className="font-medium text-green-600">{formatCurrency(allocationPreview.nominalJasa)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pokok (Sisa):</span>
                        <span className="font-medium text-blue-600">{formatCurrency(allocationPreview.nominalPokok)}</span>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <p className="text-xs text-blue-600">
                        <strong>Prioritas:</strong> Jasa bulanan dipenuhi terlebih dahulu → Pendapatan Jasa (Akuntansi)
                      </p>
                      <p className="text-xs text-blue-600">
                        <strong>Sisa:</strong> Dialokasikan ke pokok → Mengurangi Piutang Pinjaman (Akuntansi)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                placeholder="Keterangan angsuran (opsional)"
                value={formData.keterangan}
                onChange={(e) => handleInputChange("keterangan", e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={isSubmitting || !selectedLoanId || !formData.jumlah || parseInt(formData.jumlah || "0") <= 0}
            >
              {isSubmitting ? "Menyimpan..." : initialData ? "Update Angsuran" : "Simpan Angsuran"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
