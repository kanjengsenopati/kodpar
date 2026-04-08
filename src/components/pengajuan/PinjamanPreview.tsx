
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { getPengaturan } from "@/services/pengaturanService";

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
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-blue-800">
          Preview Informasi Pinjaman
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Rate Suku Bunga:</p>
            <p className="font-medium">{calculatedValues.sukuBunga}% per bulan</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Jumlah Tenor:</p>
            <p className="font-medium">{calculatedValues.tenor} bulan</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Nominal Pokok:</p>
            <p className="font-medium">{formatCurrency(calculatedValues.nominalPokok)}</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Nominal Jasa per Bulan:</p>
            <p className="font-medium">{formatCurrency(calculatedValues.nominalJasa)}</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Total Nominal Jasa:</p>
            <p className="font-medium">{formatCurrency(calculatedValues.totalNominalJasa)}</p>
          </div>
          
          <div>
            <p className="text-muted-foreground">Total Pengembalian:</p>
            <p className="font-medium text-lg">{formatCurrency(calculatedValues.totalPengembalian)}</p>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-muted-foreground">Angsuran per Bulan:</p>
            <p className="font-medium text-lg text-blue-700">{formatCurrency(calculatedValues.angsuranPerBulan)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
