
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calculator, Clock, TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { 
  getAllTransaksi, 
  getRemainingLoanAmount,
  calculateJatuhTempo 
} from "@/services/transaksiService";
import { getPengaturan } from "@/services/pengaturanService";
import { getLoanInterestRate } from "@/services/transaksi/loanOperations";
import { calculateAngsuranAllocation } from "@/services/akuntansi/accountingSyncService";

interface LoanSelectionPreviewProps {
  anggotaId: string;
  onLoanSelect: (loanId: string) => void;
  onAmountChange: (amount: number) => void;
  selectedLoanId: string;
}

export function LoanSelectionPreview({
  anggotaId,
  onLoanSelect,
  onAmountChange,
  selectedLoanId
}: LoanSelectionPreviewProps) {
  const [availableLoans, setAvailableLoans] = useState<any[]>([]);
  const [loanDetails, setLoanDetails] = useState<any>(null);

  useEffect(() => {
    if (anggotaId) {
      const allTransaksi = getAllTransaksi();
      const pinjamanList = allTransaksi.filter(
        t => t.anggotaId === anggotaId && 
            t.jenis === "Pinjam" && 
            t.status === "Sukses"
      );

      // Filter only loans that still have remaining balance
      const loansWithBalance = pinjamanList.filter(pinjaman => {
        const remaining = getRemainingLoanAmount(pinjaman.id);
        return remaining > 0;
      });

      setAvailableLoans(loansWithBalance);

      // Auto-select first loan if available
      if (loansWithBalance.length > 0 && !selectedLoanId) {
        onLoanSelect(loansWithBalance[0].id);
      }
    }
  }, [anggotaId, selectedLoanId, onLoanSelect]);

  useEffect(() => {
    if (selectedLoanId) {
      const selectedLoan = availableLoans.find(loan => loan.id === selectedLoanId);
      if (selectedLoan) {
        const remainingAmount = getRemainingLoanAmount(selectedLoanId);
        const pengaturan = getPengaturan();
        
        // Get interest rate using the centralized function with proper conversion
        const sukuBungaDecimal = getLoanInterestRate(selectedLoan.kategori || "");
        const sukuBungaPersen = sukuBungaDecimal * 100; // Convert to percentage for display

        // Calculate monthly interest (jasa bulanan) based on remaining principal
        const monthlyInterest = Math.round(remainingAmount * sukuBungaDecimal);
        
        // Calculate suggested monthly installment (interest + some principal)
        const suggestedPrincipal = Math.min(remainingAmount * 0.1, remainingAmount); // 10% of remaining or full amount
        const suggestedAmount = monthlyInterest + suggestedPrincipal;

        setLoanDetails({
          ...selectedLoan,
          remainingAmount,
          monthlyInterest,
          suggestedAmount,
          sukuBunga: sukuBungaPersen,
          sukuBungaDecimal: sukuBungaDecimal,
          jatuhTempo: calculateJatuhTempo(selectedLoan.tanggal, pengaturan?.tenor?.defaultTenor || 12)
        });

        onAmountChange(suggestedAmount);
      }
    }
  }, [selectedLoanId, availableLoans, onAmountChange]);

  if (!anggotaId) {
    return null;
  }

  if (availableLoans.length === 0) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-orange-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Tidak Ada Pinjaman Aktif
            </h3>
            <p className="text-orange-600">
              Anggota ini tidak memiliki pinjaman dengan saldo yang perlu dibayar.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Calculator className="h-5 w-5" />
          Pilih Pinjaman untuk Angsuran
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {availableLoans.map((loan) => (
            <div
              key={loan.id}
              className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                selectedLoanId === loan.id
                  ? "border-blue-500 bg-blue-100"
                  : "border-gray-200 bg-white hover:border-blue-300"
              }`}
              onClick={() => onLoanSelect(loan.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">#{loan.id}</span>
                    <Badge variant="outline">{loan.kategori || "Umum"}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Tanggal: {new Date(loan.tanggal).toLocaleDateString('id-ID')}
                  </p>
                  <p className="text-sm font-medium">
                    Sisa: {formatCurrency(getRemainingLoanAmount(loan.id))}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">
                    {formatCurrency(loan.jumlah)}
                  </p>
                  <p className="text-xs text-gray-500">Total Pinjaman</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {loanDetails && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Detail Angsuran Bulanan
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Suku Bunga:</span>
                <p className="font-medium">{loanDetails.sukuBunga.toFixed(2)}% per bulan</p>
              </div>
              <div>
                <span className="text-gray-600">Jasa Bulanan:</span>
                <p className="font-medium text-green-600">{formatCurrency(loanDetails.monthlyInterest)}</p>
              </div>
              <div>
                <span className="text-gray-600">Sisa Pokok:</span>
                <p className="font-medium">{formatCurrency(loanDetails.remainingAmount)}</p>
              </div>
              <div>
                <span className="text-gray-600">Pokok Bulanan (Saran):</span>
                <p className="font-medium text-blue-600">{formatCurrency(loanDetails.suggestedAmount - loanDetails.monthlyInterest)}</p>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Jatuh Tempo:</span>
                <p className="font-medium text-red-500">{new Date(loanDetails.jatuhTempo).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm font-medium text-blue-800 mb-2">
                <Clock className="h-4 w-4 inline mr-1" />
                Prioritas Pembayaran Bulanan:
              </p>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium text-green-600">1. Jasa Bulanan ({loanDetails.sukuBunga.toFixed(2)}%):</span> {formatCurrency(loanDetails.monthlyInterest)} → Pendapatan Jasa</p>
                <p><span className="font-medium text-blue-600">2. Pokok (Sisa):</span> Mengurangi Piutang Pinjaman</p>
              </div>
              <div className="mt-2 text-xs text-blue-600">
                <strong>Formula Jasa:</strong> Sisa Pokok × {loanDetails.sukuBunga.toFixed(2)}% = {formatCurrency(loanDetails.remainingAmount)} × {(loanDetails.sukuBungaDecimal * 100).toFixed(2)}% = {formatCurrency(loanDetails.monthlyInterest)}
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full mt-3"
              onClick={() => onAmountChange(loanDetails.suggestedAmount)}
            >
              Gunakan Saran: {formatCurrency(loanDetails.suggestedAmount)}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
