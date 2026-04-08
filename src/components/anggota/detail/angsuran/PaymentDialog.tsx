
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Wallet, Calculator, DollarSign, Building, TrendingUp } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { AngsuranDetail } from "./types";
import { getTransaksiById, createTransaksi } from "@/services/transaksi";
import { getPengaturan } from "@/services/pengaturanService";
import { calculateAngsuranAllocation } from "@/services/akuntansi/accountingSyncService";
import { formatCurrency } from "@/utils/formatters";

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentAngsuran: AngsuranDetail | null;
  selectedPinjaman: string;
  simpananBalance: number;
  onPaymentComplete: () => void;
}

export function PaymentDialog({
  isOpen,
  onOpenChange,
  currentAngsuran,
  selectedPinjaman,
  simpananBalance,
  onPaymentComplete,
}: PaymentDialogProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate allocation preview
  const pinjaman = selectedPinjaman ? getTransaksiById(selectedPinjaman) : null;
  const allocation = pinjaman && currentAngsuran 
    ? calculateAngsuranAllocation(pinjaman, currentAngsuran.nominal, pinjaman.anggotaId)
    : null;

  const processPaymentWithSimpanan = async () => {
    if (!currentAngsuran || !selectedPinjaman || !pinjaman || !allocation) return;

    setIsProcessing(true);

    try {
      // Check if balance is sufficient
      if (simpananBalance < currentAngsuran.nominal) {
        toast({
          title: "Saldo Simpanan Tidak Cukup",
          description: `Saldo simpanan anggota (${formatCurrency(simpananBalance)}) tidak cukup untuk membayar angsuran (${formatCurrency(currentAngsuran.nominal)})`,
          variant: "destructive",
        });
        setIsProcessing(false);
        onOpenChange(false);
        return;
      }

      // Create enhanced keterangan with allocation details
      const allocationInfo = `(Jasa: ${formatCurrency(allocation.nominalJasa)} → Pendapatan, Pokok: ${formatCurrency(allocation.nominalPokok)} → Modal Koperasi)`;
      const keteranganPinjaman = `Angsuran ke-${currentAngsuran.nomorAngsuran} untuk pinjaman #${selectedPinjaman} ${allocationInfo}`;
      
      // Create angsuran transaction with enhanced allocation info
      const angsuranTransaksi = createTransaksi({
        tanggal: new Date().toISOString().split('T')[0],
        anggotaId: pinjaman.anggotaId,
        jenis: "Angsuran",
        jumlah: currentAngsuran.nominal,
        keterangan: `${keteranganPinjaman} (Dibayar dari simpanan)`,
        status: "Sukses"
      });

      // Create simpanan withdraw transaction
      const simpananTransaksi = createTransaksi({
        tanggal: new Date().toISOString().split('T')[0],
        anggotaId: pinjaman.anggotaId,
        jenis: "Simpan",
        jumlah: -currentAngsuran.nominal, // Negative for withdrawal
        keterangan: `Penarikan simpanan untuk ${keteranganPinjaman}`,
        status: "Sukses"
      });

      if (angsuranTransaksi && simpananTransaksi) {
        toast({
          title: "Pembayaran Berhasil & Auto-Sync ke Akuntansi",
          description: `Angsuran berhasil dibayarkan. Auto-Split: Jasa ${formatCurrency(allocation.nominalJasa)} → Pendapatan Jasa, Pokok ${formatCurrency(allocation.nominalPokok)} → Modal Koperasi`,
        });
        onPaymentComplete();
      } else {
        throw new Error("Gagal menyimpan transaksi");
      }

    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: error instanceof Error ? error.message : "Gagal memproses pembayaran",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Konfirmasi Pembayaran Angsuran
          </DialogTitle>
          <DialogDescription>
            Auto-split pembayaran dan sinkronisasi ke akuntansi dengan distribusi yang benar
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {/* Payment Summary */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Ringkasan Pembayaran</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Jumlah Angsuran:</span>
                <span className="font-medium">{formatCurrency(currentAngsuran?.nominal || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saldo Simpanan:</span>
                <span className="font-medium">{formatCurrency(simpananBalance)}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Sisa Simpanan:</span>
                <span className="font-bold">
                  {formatCurrency(simpananBalance - (currentAngsuran?.nominal || 0))}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Allocation Preview */}
          {allocation && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Auto-Split Pembayaran Bulanan
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-green-600" />
                    <span>Jasa Bulanan (Prioritas):</span>
                  </div>
                  <span className="font-medium text-green-600">
                    {formatCurrency(allocation.nominalJasa)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Building className="h-3 w-3 text-blue-600" />
                    <span>Pokok (Sisa):</span>
                  </div>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(allocation.nominalPokok)}
                  </span>
                </div>
              </div>
              
              <div className="mt-3 pt-2 border-t border-blue-200">
                <p className="text-xs text-blue-600 mb-1">
                  <strong>Auto-Akuntansi (Jurnal):</strong>
                </p>
                <p className="text-xs text-blue-600">
                  • Jasa → Pendapatan Jasa (Kredit)
                </p>
                <p className="text-xs text-blue-600">
                  • Pokok → Modal Koperasi (Kredit) + Kurangi Piutang (Kredit)
                </p>
              </div>
            </div>
          )}
          
          {simpananBalance < (currentAngsuran?.nominal || 0) && (
            <div className="text-destructive text-sm font-medium bg-red-50 p-2 rounded">
              ⚠️ Saldo simpanan tidak mencukupi untuk pembayaran ini
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button 
            onClick={processPaymentWithSimpanan}
            disabled={isProcessing || simpananBalance < (currentAngsuran?.nominal || 0)}
            className="gap-2"
          >
            <Wallet size={16} />
            {isProcessing ? "Memproses..." : "Bayar & Auto-Sync"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
