import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatters";
import { calculateLoanDetails, LoanCalculation } from "@/utils/loanCalculations";
import { PinjamanFormSummaryProps } from "./types";
import { JenisName } from "@/components/common/JenisName";

export function PinjamanFormSummary({ jenisId, jumlah }: PinjamanFormSummaryProps) {
  const [calc, setCalc] = useState<LoanCalculation | null>(null);
  
  useEffect(() => {
    const numericJumlah = Number(jumlah);
    if (isNaN(numericJumlah) || numericJumlah <= 0 || !jenisId) {
      setCalc(null);
      return;
    }
    
    // Use modularized logic (SSOT)
    const result = calculateLoanDetails(jenisId, numericJumlah);
    setCalc(result);
  }, [jenisId, jumlah]);

  if (!calc) return null;
  
  return (
    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-[24px]">
      <div className="mb-3 font-semibold text-emerald-900 text-sm">Pratinjau Pinjaman (Database Driven)</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600/60">Kategori</p>
          <p className="font-medium text-slate-700 text-sm">
            <JenisName jenisId={jenisId} />
          </p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600/60">Pokok</p>
          <p className="font-medium text-slate-700 text-sm">{formatCurrency(calc.nominalPokok)}</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600/60">Bunga ({calc.metodeBunga.toUpperCase()})</p>
          <p className="font-medium text-slate-700 text-sm">{calc.sukuBunga}% / bln</p>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600/60">Tenor</p>
          <p className="font-medium text-slate-700 text-sm">{calc.tenor} bulan</p>
        </div>
        <div className="bg-white/60 p-2 rounded-xl">
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Angsuran / Bln</p>
          <p className="font-bold text-emerald-600 text-base">{formatCurrency(calc.angsuranPerBulan)}</p>
        </div>
        <div className="bg-white/60 p-2 rounded-xl">
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600/60">Admin Fee</p>
          <p className="font-medium text-slate-700 text-sm">{formatCurrency(calc.biayaAdmin)}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-emerald-100 flex justify-between items-center">
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600/60">Total Pengembalian</span>
        <span className="font-bold text-slate-800 text-sm">{formatCurrency(calc.totalPengembalian)}</span>
      </div>
    </div>
  );
}
