
import { formatCurrency } from "@/utils/formatters";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface ProductivityTableProps {
  anggotaBaru: {
    current: number;
    previous: number;
  };
  transaksiSimpanan: {
    current: number;
    previous: number;
  };
  transaksiPinjaman: {
    current: number;
    previous: number;
  };
  shuBulanIni: {
    current: number;
    previous: number;
  };
  nilaiPenjualan: {
    current: number;
    previous: number;
  };
}

export function ProductivityTable({
  anggotaBaru,
  transaksiSimpanan,
  transaksiPinjaman,
  shuBulanIni,
  nilaiPenjualan
}: ProductivityTableProps) {
  
  // Helper function to calculate percentage change
  const getPercentageChange = (currentValue: number, previousValue: number) => {
    if (previousValue === 0) return '+∞%';
    
    const change = ((currentValue - previousValue) / previousValue) * 100;
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  // Helper function to get CSS class based on percentage change
  const getPercentageChangeClass = (currentValue: number, previousValue: number) => {
    if (previousValue === 0) return 'text-green-600';
    
    const change = ((currentValue - previousValue) / previousValue) * 100;
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Metrik</TableHead>
          <TableHead>Bulan Ini</TableHead>
          <TableHead>Bulan Lalu</TableHead>
          <TableHead>Perubahan</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Anggota Baru</TableCell>
          <TableCell>{anggotaBaru.current}</TableCell>
          <TableCell>{anggotaBaru.previous}</TableCell>
          <TableCell className={getPercentageChangeClass(anggotaBaru.current, anggotaBaru.previous)}>
            {getPercentageChange(anggotaBaru.current, anggotaBaru.previous)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Transaksi Simpanan</TableCell>
          <TableCell>{transaksiSimpanan.current}</TableCell>
          <TableCell>{transaksiSimpanan.previous}</TableCell>
          <TableCell className={getPercentageChangeClass(
            transaksiSimpanan.current, 
            transaksiSimpanan.previous
          )}>
            {getPercentageChange(
              transaksiSimpanan.current, 
              transaksiSimpanan.previous
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Transaksi Pinjaman</TableCell>
          <TableCell>{transaksiPinjaman.current}</TableCell>
          <TableCell>{transaksiPinjaman.previous}</TableCell>
          <TableCell className={getPercentageChangeClass(
            transaksiPinjaman.current, 
            transaksiPinjaman.previous
          )}>
            {getPercentageChange(
              transaksiPinjaman.current, 
              transaksiPinjaman.previous
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">SHU Bulan Ini</TableCell>
          <TableCell>{formatCurrency(shuBulanIni.current)}</TableCell>
          <TableCell>{formatCurrency(shuBulanIni.previous)}</TableCell>
          <TableCell className={getPercentageChangeClass(shuBulanIni.current, shuBulanIni.previous)}>
            {getPercentageChange(shuBulanIni.current, shuBulanIni.previous)}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Nilai Penjualan</TableCell>
          <TableCell>{formatCurrency(nilaiPenjualan.current)}</TableCell>
          <TableCell>{formatCurrency(nilaiPenjualan.previous)}</TableCell>
          <TableCell className={getPercentageChangeClass(nilaiPenjualan.current, nilaiPenjualan.previous)}>
            {getPercentageChange(nilaiPenjualan.current, nilaiPenjualan.previous)}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
