
import { useEffect, useState } from "react";
import { formatCurrency } from "@/utils/formatters";
import { getPengaturan } from "@/services/pengaturanService";
import { Text } from "@/components/ui/text";
import { CalendarClock, ShieldCheck } from "lucide-react";

interface PinjamanPreviewProps {
  kategori: string;
  jumlah: number;
  tenor?: number;
}

export function PinjamanPreview({ kategori, jumlah, tenor }: PinjamanPreviewProps) {
  const pengaturan = getPengaturan();
  const [calculatedValues, setCalculatedValues] = useState({
    sukuBunga: 0,
    nominalPokok: 0,
    nominalJasa: 0,
    totalNominalJasa: 0,
    totalPengembalian: 0,
    tenor: 12,
    angsuranPerBulan: 0
  });

  useEffect(() => {
    if (!kategori || !jumlah || jumlah <= 0) {
      setCalculatedValues({
        sukuBunga: 0,
        nominalPokok: 0,
        nominalJasa: 0,
        totalNominalJasa: 0,
        totalPengembalian: 0,
        tenor: 12,
        angsuranPerBulan: 0
      });
      return;
    }

    // Get interest rate for category
    let sukuBunga = pengaturan?.sukuBunga?.pinjaman || 1;
    if (pengaturan?.sukuBunga?.pinjamanByCategory && kategori in pengaturan.sukuBunga.pinjamanByCategory) {
      sukuBunga = pengaturan.sukuBunga.pinjamanByCategory[kategori];
    }

    // Use provided tenor or default
    const selectedTenor = tenor || pengaturan?.tenor?.defaultTenor || pengaturan?.tenor?.tenorOptions?.[1] || 12;

    // Calculate loan values (flat rate)
    const nominalPokok = jumlah;
    const nominalJasa = (nominalPokok * sukuBunga / 100); // Per month
    const totalNominalJasa = nominalJasa * selectedTenor;
    const totalPengembalian = nominalPokok + totalNominalJasa;
    const angsuranPerBulan = Math.ceil(totalPengembalian / selectedTenor);

    setCalculatedValues({
      sukuBunga,
      nominalPokok,
      nominalJasa,
      totalNominalJasa,
      totalPengembalian,
      tenor: selectedTenor,
      angsuranPerBulan
    });
  }, [kategori, jumlah, tenor, pengaturan]);

  if (!kategori || !jumlah || jumlah <= 0) {
    return null;
  }

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-5 border border-slate-100 flex flex-col gap-4">
      <div className="flex items-center gap-2">
         <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
            <CalendarClock size={16} className="text-blue-600" />
         </div>
         <Text.H2>Estimasi Angsuran</Text.H2>
      </div>
      
      <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-1 border border-slate-100">
         <Text.Label>TAGIHAN BULANAN</Text.Label>
         <Text.Amount className="text-[28px]">{formatCurrency(calculatedValues.angsuranPerBulan)}</Text.Amount>
         <Text.Caption>Selama {calculatedValues.tenor} bulan</Text.Caption>
      </div>

      <div className="space-y-3 mt-1">
         <div className="flex justify-between items-center text-[13px]">
            <span className="text-slate-500 font-medium">Nominal Pokok</span>
            <span className="text-slate-800 font-bold">{formatCurrency(calculatedValues.nominalPokok)}</span>
         </div>
         <div className="flex justify-between items-center text-[13px]">
            <span className="text-slate-500 font-medium">Bunga ({calculatedValues.sukuBunga}% /bln)</span>
            <span className="text-slate-800 font-bold">+{formatCurrency(calculatedValues.totalNominalJasa)}</span>
         </div>
         <div className="flex justify-between items-center text-[13px] pt-3 border-t border-slate-100">
            <span className="text-slate-500 font-medium">Total Pengembalian</span>
            <span className="text-slate-800 font-bold">{formatCurrency(calculatedValues.totalPengembalian)}</span>
         </div>
      </div>
      
      <div className="mt-2 bg-emerald-50 rounded-2xl p-3 flex flex-col gap-2 border border-emerald-100/50">
         <div className="flex gap-2 items-start">
            <ShieldCheck size={16} className="text-emerald-600 mt-0.5 shrink-0" />
            <p className="text-emerald-700 leading-relaxed text-[11px] font-semibold">
               Rencana Jadwal Pembayaran:
            </p>
         </div>
         <div className="grid grid-cols-1 gap-1.5 pl-6">
            {[1, 2, 3].map((num) => {
               const d = new Date();
               d.setMonth(d.getMonth() + num);
               const dateStr = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
               return (
                  <div key={num} className="flex justify-between items-center text-[10.5px]">
                     <span className="text-emerald-600/70 font-medium">Angsuran {num}</span>
                     <span className="text-emerald-800 font-bold">{dateStr}</span>
                  </div>
               );
            })}
            <div className="text-[9px] italic text-emerald-600/60 mt-1">
               *Jadwal lengkap akan dibuat otomatis setelah persetujuan
            </div>
         </div>
         <p className="text-emerald-700 leading-relaxed text-[11px] font-medium pl-6 pt-1 border-t border-emerald-100/30">
            Pembayaran akan dijadwalkan secara periodik setiap bulannya.
         </p>
      </div>
    </div>
  );
}
