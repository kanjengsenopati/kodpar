
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react';
import { PemasukanPengeluaran } from '@/types';
import { formatRupiah } from '@/lib/utils';

interface KeuanganStatsCardsProps {
  data: PemasukanPengeluaran[];
  loading: boolean;
}

export function KeuanganStatsCards({ data, loading }: KeuanganStatsCardsProps) {
  const stats = React.useMemo(() => {
    const pemasukan = data.filter(t => t.jenis === 'Pemasukan');
    const pengeluaran = data.filter(t => t.jenis === 'Pengeluaran');
    
    const totalPemasukan = pemasukan.reduce((sum, t) => sum + t.jumlah, 0);
    const totalPengeluaran = pengeluaran.reduce((sum, t) => sum + t.jumlah, 0);
    const netIncome = totalPemasukan - totalPengeluaran;
    
    return {
      totalPemasukan,
      totalPengeluaran,
      netIncome,
      countPemasukan: pemasukan.length,
      countPengeluaran: pengeluaran.length,
      totalTransaksi: data.length
    };
  }, [data]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-20 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Total Pemasukan</p>
              <p className="text-2xl font-bold text-green-700">
                {formatRupiah(stats.totalPemasukan)}
              </p>
              <p className="text-xs text-green-600 mt-1">
                {stats.countPemasukan} transaksi
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Total Pengeluaran</p>
              <p className="text-2xl font-bold text-red-700">
                {formatRupiah(stats.totalPengeluaran)}
              </p>
              <p className="text-xs text-red-600 mt-1">
                {stats.countPengeluaran} transaksi
              </p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={`${stats.netIncome >= 0 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${stats.netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                Net Income
              </p>
              <p className={`text-2xl font-bold ${stats.netIncome >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
                {formatRupiah(Math.abs(stats.netIncome))}
              </p>
              <p className={`text-xs mt-1 ${stats.netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'}`}>
                {stats.netIncome >= 0 ? 'Surplus' : 'Defisit'}
              </p>
            </div>
            <div className={`p-3 rounded-full ${stats.netIncome >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
              <DollarSign className={`h-6 w-6 ${stats.netIncome >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transaksi</p>
              <p className="text-2xl font-bold text-gray-700">
                {stats.totalTransaksi}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Semua transaksi
              </p>
            </div>
            <div className="bg-gray-100 p-3 rounded-full">
              <FileText className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
