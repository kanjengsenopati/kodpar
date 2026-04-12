
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
import { getLoanInterestRate } from "@/services/transaksiService";
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
    const loadLoans = async () => {
      if (anggotaId) {
        try {
          const allTransaksi = await getAllTransaksi();
          const pinjamanList = allTransaksi.filter(
            t => t.anggotaId === anggotaId && 
                t.jenis === "Pinjam" && 
                t.status === "Sukses"
          );

          // Filter only loans that still have remaining balance (properly awaited)
          const loansWithBalance = [];
          for (const pinjaman of pinjamanList) {
            const remaining = await getRemainingLoanAmount(pinjaman.id);
            if (remaining > 0) {
              loansWithBalance.push({
                ...pinjaman,
                actualRemaining: remaining
              });
            }
          }

          setAvailableLoans(loansWithBalance);

          // Auto-select first loan if available
          if (loansWithBalance.length > 0 && !selectedLoanId) {
            onLoanSelect(loansWithBalance[0].id);
          }
        } catch (error) {
          console.error("Error loading available loans:", error);
        }
      }
    };
    
    loadLoans();
  }, [anggotaId, selectedLoanId, onLoanSelect]);

  useEffect(() => {
    const loadLoanDetails = async () => {
      if (selectedLoanId) {
        try {
          const selectedLoan = availableLoans.find(loan => loan.id === selectedLoanId);
          if (selectedLoan) {
            const remainingAmount = await getRemainingLoanAmount(selectedLoanId);
            const pengaturan = getPengaturan();
            
            // Get interest rate using the centralized function with proper conversion
            const sukuBungaDecimal = getLoanInterestRate(selectedLoan.kategori || "");
            const sukuBungaPersen = sukuBungaDecimal * 100; // Convert to percentage for display

            // Calculate monthly interest (jasa bulanan) based on remaining principal
            const monthlyInterest = Math.round(remainingAmount * sukuBungaDecimal);
            
            // Calculate suggested monthly installment (interest + some principal)
            const suggestedPrincipal = Math.min(remainingAmount * 0.1, remainingAmount); // 10% of remaining or full amount
            const suggestedAmount = Math.round(monthlyInterest + suggestedPrincipal);

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
        } catch (error) {
          console.error("Error loading loan details:", error);
        }
      }
    };
    
    loadLoanDetails();
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
    <div className="space-y-3">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
          <Calculator className="h-4 w-4 text-blue-500" />
          <span className="text-sm">Pilih Pinjaman</span>
        </div>
        <Badge variant="outline" className="text-[10px] h-5 bg-blue-50 text-blue-600 border-blue-100">
          {availableLoans.length} Aktif
        </Badge>
      </div>

      <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar">
        {availableLoans.map((loan) => (
          <div
            key={loan.id}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              selectedLoanId === loan.id
                ? "border-blue-500 bg-blue-50/50 shadow-sm"
                : "border-slate-100 bg-white hover:border-blue-200"
            }`}
            onClick={() => onLoanSelect(loan.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-6 rounded-full ${selectedLoanId === loan.id ? 'bg-blue-500' : 'bg-slate-200'}`} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-bold text-slate-700">
                      {loan.nomorTransaksi || `#${loan.id.substring(0, 5)}`}
                    </span>
                    <span className="text-[10px] text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                      {loan.kategori || "Umum"}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Sisa: <span className="font-semibold text-slate-700">{formatCurrency(loan.actualRemaining)}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-bold text-blue-600">
                  {formatCurrency(loan.jumlah)}
                </div>
                <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Limit Awal</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {loanDetails && (
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
            <div className="bg-white p-2 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Suku Bunga</span>
              <p className="text-[13px] font-bold text-slate-700">{loanDetails.sukuBunga.toFixed(2)}% <span className="text-[10px] font-normal text-slate-400 italic">/ bln</span></p>
            </div>
            <div className="bg-emerald-50/50 p-2 rounded-xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest block mb-0.5">Jasa Bulanan</span>
              <p className="text-[13px] font-bold text-emerald-600">{formatCurrency(loanDetails.monthlyInterest)}</p>
            </div>
            <div className="bg-white p-2 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Sisa Hutang Pokok</span>
              <p className="text-[13px] font-bold text-slate-700">{formatCurrency(loanDetails.remainingAmount)}</p>
            </div>
            <div className="bg-blue-50/50 p-2 rounded-xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-600/60 uppercase tracking-widest block mb-0.5">Jatuh Tempo</span>
              <p className="text-[12px] font-bold text-blue-600">{new Date(loanDetails.jatuhTempo).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Saran Pembayaran</span>
              <span className="text-[14px] font-bold text-slate-800">{formatCurrency(loanDetails.suggestedAmount)}</span>
            </div>
            <Button
              variant="default"
              size="sm"
              className="h-8 px-4 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm"
              onClick={() => onAmountChange(loanDetails.suggestedAmount)}
            >
              Gunakan
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

