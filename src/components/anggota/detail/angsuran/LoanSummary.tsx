import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Transaksi } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { CreditCard, Calendar, Percent, Wallet, UserCircle } from "lucide-react";
import { Text } from "@/components/ui/text";

interface LoanSummaryProps {
  selectedLoan: Transaksi;
  remainingAmount: number;
  simpananBalance: number;
  onBayarAngsuran: (pinjamanId: string) => void;
  selectedPinjaman: string;
  disableSelfPayment?: boolean;
}

export function LoanSummary({
  selectedLoan,
  remainingAmount,
  simpananBalance,
  onBayarAngsuran,
  selectedPinjaman,
  disableSelfPayment = false,
}: LoanSummaryProps) {
  
  // Pure DB Driven Metadata
  const tenor = selectedLoan.tenor || 12;
  const rate = selectedLoan.sukuBunga || 0;
  const status = remainingAmount > 0 ? "Aktif" : "Lunas";
  const petugas = selectedLoan.petugas || "Sistem";
  const angsuranPerBulan = Math.floor(selectedLoan.jumlah / (selectedLoan.tenor || 12));

  return (
    <div className="mt-4 mb-6 p-5 rounded-[24px] bg-slate-50 border border-slate-100 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Text.H2 className="flex items-center gap-2">
          💰 Detail Keuangan SAK EP
        </Text.H2>
        <Badge 
          className={`rounded-full px-3 py-1 ${status === 'Aktif' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}
          variant="secondary"
        >
          {status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
        {/* Total Pinjaman */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-slate-400">
            <CreditCard size={14} />
            <Text.Label className="text-[10px]">Total Plafon</Text.Label>
          </div>
          <Text.H2 className="text-[15px]">{formatCurrency(selectedLoan.jumlah)}</Text.H2>
        </div>
        
        {/* Tenor */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-slate-400">
            <Calendar size={14} />
            <Text.Label className="text-[10px]">Tenor</Text.Label>
          </div>
          <Text.Body className="font-semibold text-slate-700">{tenor} Bulan</Text.Body>
        </div>
        
        {/* Bunga */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-slate-400">
            <Percent size={14} />
            <Text.Label className="text-[10px]">Suku Bunga</Text.Label>
          </div>
          <Text.Body className="font-semibold text-slate-700">{rate}% p.m</Text.Body>
        </div>
        
        {/* Sisa Pinjaman */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-slate-400">
            <Wallet size={14} />
            <Text.Label className="text-[10px]">Sisa Pokok</Text.Label>
          </div>
          <Text.Amount className="text-[16px]">{formatCurrency(remainingAmount)}</Text.Amount>
        </div>

        {/* Petugas */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-slate-400">
            <UserCircle size={14} />
            <Text.Label className="text-[10px]">Petugas</Text.Label>
          </div>
          <Text.Caption className="not-italic text-slate-600">{petugas}</Text.Caption>
        </div>
      </div>
      
      {!disableSelfPayment && remainingAmount > 0 && (
        <div className="flex justify-end pt-2 border-t border-slate-200">
          <Button 
            onClick={() => onBayarAngsuran(selectedPinjaman)} 
            className="rounded-[16px] bg-blue-600 hover:bg-blue-700 text-white px-6 shadow-md transition-all active:scale-95"
          >
            Bayar Angsuran Baru
          </Button>
        </div>
      )}
    </div>
  );
}
