
import { useEffect, useState } from "react";
import { getPengaturan } from "@/services/pengaturanService";
import { formatCurrency } from "@/utils/formatters";
import { PinjamanFormSummaryProps } from "./types";

export function PinjamanFormSummary({ kategori, jumlah, bunga }: PinjamanFormSummaryProps) {
  const pengaturan = getPengaturan();
  const tenorDefault = pengaturan?.tenor?.tenorOptions?.[1] || 12; // Default to 12 if not available
  const [calculatedValues, setCalculatedValues] = useState({
    angsuran: 0,
    totalPembayaran: 0,
    totalBunga: 0
  });
  
  // Calculate loan values when props change
  useEffect(() => {
    const numericJumlah = Number(jumlah);
    if (isNaN(numericJumlah) || numericJumlah <= 0) return;
    
    // Simple flat rate calculation
    const bungaPerBulan = (numericJumlah * bunga / 100);
    const totalBunga = bungaPerBulan * tenorDefault;
    const totalBayar = numericJumlah + totalBunga;
    const angsuranPerBulan = Math.ceil(totalBayar / tenorDefault);
    
    setCalculatedValues({
      angsuran: angsuranPerBulan,
      totalPembayaran: totalBayar,
      totalBunga: totalBunga
    });
  }, [kategori, jumlah, bunga, tenorDefault]);
  
  return (
    <div className="bg-amber-50 p-4 rounded-md">
      <div className="mb-2 font-semibold">Ringkasan Pinjaman</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Kategori Pinjaman:</p>
          <p className="font-medium">{kategori}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Pokok Pinjaman:</p>
          <p className="font-medium">{formatCurrency(Number(jumlah))}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Bunga:</p>
          <p className="font-medium">{bunga}% (Flat)</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Tenor:</p>
          <p className="font-medium">{tenorDefault} bulan</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Angsuran per Bulan:</p>
          <p className="font-medium">{formatCurrency(calculatedValues.angsuran)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Pembayaran:</p>
          <p className="font-medium">{formatCurrency(calculatedValues.totalPembayaran)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Bunga:</p>
          <p className="font-medium">{formatCurrency(calculatedValues.totalBunga)}</p>
        </div>
      </div>
    </div>
  );
}
