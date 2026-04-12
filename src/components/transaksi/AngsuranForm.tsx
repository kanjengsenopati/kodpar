import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { Calculator, Zap } from "lucide-react";
import { Text } from "@/components/ui/text";
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

  // Constants for Koperasi Style
  const cardStyle = "rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white";

  // Calculate allocation preview when amount or loan changes
  useEffect(() => {
    const updatePreview = async () => {
      if (selectedLoanId && formData.jumlah && parseInt(formData.jumlah) > 0) {
        try {
          const pinjaman = await getTransaksiById(selectedLoanId);
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
        } catch (error) {
          console.error("Error fetching pinjaman for preview:", error);
        }
      } else {
        setAllocationPreview(null);
      }
    };
    
    updatePreview();
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

    const jumlahAngsuran = Math.round(Number(formData.jumlah));
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
        const result = await updateTransaksi(initialData.id, {
          tanggal: formData.tanggal,
          anggotaId: formData.anggotaId,
          jenis: "Angsuran",
          jumlah: jumlahAngsuran,
          kategori: "Pinjaman Reguler",
          keterangan: enhancedKeterangan,
          referensiPinjamanId: selectedLoanId,
          nominalPokok: allocationPreview?.nominalPokok ?? 0,
          nominalJasa: allocationPreview?.nominalJasa ?? 0,
          status: initialData.status
        });

        if (result.success && result.data) {
          toast({
            title: "Angsuran berhasil diupdate",
            description: `Transaksi dengan ID ${result.data.id} telah diperbarui dan disinkronkan ke akuntansi`,
          });
          onSuccess();
        } else {
          throw new Error(result.error || "Gagal mengupdate transaksi");
        }
      } else {
        // Create new transaction with all structured financial fields
        const result = await createTransaksi({
          tanggal: formData.tanggal,
          anggotaId: formData.anggotaId,
          jenis: "Angsuran",
          kategori: "Pinjaman Reguler",
          jumlah: jumlahAngsuran,
          keterangan: enhancedKeterangan,
          referensiPinjamanId: selectedLoanId,
          nominalPokok: allocationPreview?.nominalPokok ?? 0,
          nominalJasa: allocationPreview?.nominalJasa ?? 0,
          status: "Sukses"
        });

        if (result.success && result.data) {
          toast({
            title: "Angsuran berhasil disimpan",
            description: `Transaksi dengan ID ${result.data.id} telah dibuat dan disinkronkan ke akuntansi`,
          });
          
          // Auto-reset form for next entry (Stay on page)
          setFormData(prev => ({
            ...prev,
            jumlah: "",
            keterangan: ""
          }));
          setSelectedLoanId("");
          
          if (onSuccess) onSuccess();
        } else {
          throw new Error(result.error || "Gagal membuat transaksi");
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
  };

  const applySuggestedAmount = () => {
    if (suggestedAmount > 0) {
      handleInputChange("jumlah", suggestedAmount.toString());
    }
  };

  return (
    <Card className={cardStyle}>
      <CardHeader className="pb-2 pt-6 px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-600" />
            <Text.H2>
              {initialData ? "Edit Angsuran" : "Form Angsuran"}
            </Text.H2>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
            <Zap size={12} />
            Auto-Sync Akuntansi
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Text.Label>Tanggal Transaksi</Text.Label>
              <Input
                id="tanggal"
                type="date"
                value={formData.tanggal}
                onChange={(e) => handleInputChange("tanggal", e.target.value)}
                required
                className="rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <Text.Label>Pilih Anggota</Text.Label>
              <Select
                value={formData.anggotaId}
                onValueChange={(value) => handleInputChange("anggotaId", value)}
              >
                <SelectTrigger className="rounded-2xl border-slate-100 bg-slate-50">
                  <SelectValue placeholder="Pilih anggota" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {Array.isArray(anggotaList) && anggotaList.map((anggota: any) => (
                    <SelectItem key={anggota.id} value={anggota.id}>
                      {anggota.nama} - {anggota.noAnggota || anggota.id.substring(0, 8)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.anggotaId && (
            <div className="bg-slate-50/50 p-4 rounded-[24px] border border-slate-100/50">
              <LoanSelectionPreview
                anggotaId={formData.anggotaId}
                onLoanSelect={setSelectedLoanId}
                onAmountChange={handleAmountSuggestion}
                selectedLoanId={selectedLoanId}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Text.Label>Jumlah Angsuran</Text.Label>
              <div className="space-y-2">
                <Input
                  id="jumlah"
                  type="number"
                  min="1"
                  placeholder="Masukkan jumlah angsuran"
                  value={formData.jumlah}
                  onChange={(e) => handleInputChange("jumlah", e.target.value)}
                  required
                  className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all text-lg font-semibold"
                />
                
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {suggestedAmount > 0 ? (
                    <div className="flex items-center gap-2">
                      <Text.Caption className="not-italic text-slate-500">
                        Saran: {formatCurrency(suggestedAmount)}
                      </Text.Caption>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={applySuggestedAmount}
                        className="h-7 text-[10px] font-bold uppercase tracking-wider text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                      >
                        Gunakan
                      </Button>
                    </div>
                  ) : <div></div>}
                  
                  {formData.jumlah && (
                    <Text.Amount className="text-sm">
                      {formatCurrency(parseInt(formData.jumlah || "0"))}
                    </Text.Amount>
                  )}
                </div>
                
                {/* Enhanced Allocation Preview */}
                {allocationPreview && (
                  <div className="mt-4 p-4 bg-white border border-slate-100 rounded-[18px] shadow-sm">
                    <Text.Label className="block mb-3 text-slate-500">Alokasi Pembayaran Bulanan</Text.Label>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Text.Body className="text-slate-500">Jasa Bulanan (Prioritas)</Text.Body>
                        <Text.Body className="font-bold text-emerald-600">{formatCurrency(allocationPreview.nominalJasa)}</Text.Body>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text.Body className="text-slate-500">Pokok (Sisa)</Text.Body>
                        <Text.Body className="font-bold text-blue-600">{formatCurrency(allocationPreview.nominalPokok)}</Text.Body>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-50 flex gap-2">
                      <div className="w-1 h-1 rounded-full bg-blue-400 mt-1.5" />
                      <Text.Caption className="leading-tight">
                        Sistem secara otomatis memecah pendapatan jasa dan pengurangan piutang pada laporan keuangan.
                      </Text.Caption>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Text.Label>Keterangan Tambahan</Text.Label>
              <div className="h-full">
                <Textarea
                  id="keterangan"
                  placeholder="Contoh: Pembayaran angsuran ke-5 via transfer"
                  value={formData.keterangan}
                  onChange={(e) => handleInputChange("keterangan", e.target.value)}
                  rows={4}
                  className="rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full h-12 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100" 
              disabled={isSubmitting || !selectedLoanId || !formData.jumlah || parseInt(formData.jumlah || "0") <= 0}
            >
              {isSubmitting ? "Menyimpan Transaksi..." : initialData ? "Update Angsuran" : "Konfirmasi & Simpan Angsuran"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
