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
      // Direct Fresh Calculation to prevent race conditions
      const pinjaman = await getTransaksiById(selectedLoanId);
      let finalNominalPokok = allocationPreview?.nominalPokok ?? 0;
      let finalNominalJasa = allocationPreview?.nominalJasa ?? 0;

      if (pinjaman) {
        const allocation = calculateAngsuranAllocation(pinjaman, jumlahAngsuran);
        finalNominalPokok = allocation.nominalPokok;
        finalNominalJasa = allocation.nominalJasa;
      }

      // Enhanced keterangan with allocation info
      let enhancedKeterangan = `${formData.keterangan} - Pinjaman: ${selectedLoanId}`;
      const allocationInfo = ` (Jasa Bulanan: ${formatCurrency(finalNominalJasa)}, Pokok: ${formatCurrency(finalNominalPokok)})`;
      enhancedKeterangan += allocationInfo;

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
          nominalPokok: finalNominalPokok,
          nominalJasa: finalNominalJasa,
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
          nominalPokok: finalNominalPokok,
          nominalJasa: finalNominalJasa,
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
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* KOLOM KIRI: SELEKSI DATA (col-span-7) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Text.Label>Tanggal Transaksi</Text.Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => handleInputChange("tanggal", e.target.value)}
                    required
                    className="h-10 rounded-xl border-slate-100 bg-slate-50 focus:bg-white transition-all text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Text.Label>Pilih Anggota</Text.Label>
                  <Select
                    value={formData.anggotaId}
                    onValueChange={(value) => handleInputChange("anggotaId", value)}
                  >
                    <SelectTrigger className="h-10 rounded-xl border-slate-100 bg-slate-50 text-sm">
                      <SelectValue placeholder="Pilih anggota" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {Array.isArray(anggotaList) && anggotaList.map((anggota: any) => (
                        <SelectItem key={anggota.id} value={anggota.id}>
                          {anggota.nama}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.anggotaId ? (
                <div className="bg-slate-50/50 p-3 rounded-[20px] border border-slate-100/50 min-h-[300px]">
                  <LoanSelectionPreview
                    anggotaId={formData.anggotaId}
                    onLoanSelect={setSelectedLoanId}
                    onAmountChange={handleAmountSuggestion}
                    selectedLoanId={selectedLoanId}
                  />
                </div>
              ) : (
                <div className="bg-slate-50 flex items-center justify-center h-[300px] rounded-[24px] border border-dashed border-slate-200">
                  <Text.Caption>Silakan pilih anggota untuk melihat pinjaman aktif</Text.Caption>
                </div>
              )}
            </div>

            {/* KOLOM KANAN: INPUT & KONFIRMASI (col-span-5) */}
            <div className="lg:col-span-5 space-y-4 bg-slate-50/30 p-4 rounded-[24px] border border-slate-100">
              <div className="space-y-1.5">
                <Text.Label>Jumlah Pembayaran</Text.Label>
                <div className="space-y-3">
                  <div className="relative">
                    <Input
                      id="jumlah"
                      type="number"
                      min="1"
                      placeholder="Rp 0"
                      value={formData.jumlah}
                      onChange={(e) => handleInputChange("jumlah", e.target.value)}
                      required
                      className="h-14 pl-4 rounded-xl border-slate-100 bg-white shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all text-xl font-bold text-emerald-600"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Calculator className="h-5 w-5 text-slate-300" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between px-1">
                    {suggestedAmount > 0 ? (
                      <div className="flex items-center gap-1.5">
                        <Text.Caption className="not-italic text-slate-400">Saran:</Text.Caption>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={applySuggestedAmount}
                          className="h-6 px-2 text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg"
                        >
                          {formatCurrency(suggestedAmount)}
                        </Button>
                      </div>
                    ) : <div />}
                    
                    {formData.jumlah && (
                      <div className="bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm">
                        <Text.Amount className="text-[14px]">
                          {formatCurrency(parseInt(formData.jumlah || "0"))}
                        </Text.Amount>
                      </div>
                    )}
                  </div>
                  
                  {/* Enhanced Allocation Preview */}
                  {allocationPreview && (
                    <div className="p-4 bg-white border border-slate-100 rounded-[20px] shadow-sm space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <Text.Body className="text-slate-400 text-xs">Jasa Bulanan (SAK EP)</Text.Body>
                        <Text.Body className="font-bold text-emerald-600">{formatCurrency(allocationPreview.nominalJasa)}</Text.Body>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <Text.Body className="text-slate-400 text-xs">Pokok (Piutang)</Text.Body>
                        <Text.Body className="font-bold text-blue-600">{formatCurrency(allocationPreview.nominalPokok)}</Text.Body>
                      </div>
                      <div className="h-0.5 bg-slate-50 w-full" />
                      <Text.Caption className="text-[10px] leading-tight text-slate-400">
                        * Alokasi otomatis dicatat sebagai Jasa & Pelunasan Pokok pada Jurnal Akuntansi.
                      </Text.Caption>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <Text.Label>Keterangan</Text.Label>
                <Textarea
                  id="keterangan"
                  placeholder="Catatan transaksi..."
                  value={formData.keterangan}
                  onChange={(e) => handleInputChange("keterangan", e.target.value)}
                  rows={2}
                  className="rounded-xl border-slate-100 bg-white focus:bg-white transition-all resize-none text-sm p-3"
                />
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 font-bold" 
                  disabled={isSubmitting || !selectedLoanId || !formData.jumlah || parseInt(formData.jumlah || "0") <= 0}
                >
                  {isSubmitting ? "Memproses..." : initialData ? "Update Angsuran" : "Simpan Angsuran"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
