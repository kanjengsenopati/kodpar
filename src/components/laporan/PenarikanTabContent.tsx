
import { ArrowUpFromLine, TrendingDown, Calendar, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Transaksi } from "@/types";

interface ChartDataItem {
  name: string;
  penarikan: number;
}

interface PenarikanTabContentProps {
  transaksiList: Transaksi[];
  totalPenarikan: number;
  chartData: {
    penarikan: ChartDataItem[];
  };
  chartColors: {
    penarikan: string;
  };
  filterDateStart: Date;
  filterDateEnd: Date;
}

export function PenarikanTabContent({
  transaksiList,
  totalPenarikan,
  chartData,
  chartColors,
  filterDateStart,
  filterDateEnd,
}: PenarikanTabContentProps) {
  // Filter penarikan transactions
  const penarikanList = transaksiList.filter(t => 
    t.jenis === "Penarikan" && 
    t.status === "Sukses" &&
    new Date(t.tanggal) >= filterDateStart &&
    new Date(t.tanggal) <= filterDateEnd
  );

  // Calculate statistics
  const totalTransaksi = penarikanList.length;
  const rataRataPenarikan = totalTransaksi > 0 ? totalPenarikan / totalTransaksi : 0;
  const uniqueAnggota = new Set(penarikanList.map(t => t.anggotaId)).size;

  // Get recent withdrawals
  const recentPenarikan = penarikanList
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penarikan</CardTitle>
            <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {totalPenarikan.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">
              Periode: {filterDateStart.toLocaleDateString('id-ID')} - {filterDateEnd.toLocaleDateString('id-ID')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transaksi</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransaksi}</div>
            <p className="text-xs text-muted-foreground">
              Transaksi penarikan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rata-rata Penarikan</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {rataRataPenarikan.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">
              Per transaksi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Anggota Aktif</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueAnggota}</div>
            <p className="text-xs text-muted-foreground">
              Melakukan penarikan
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Tren Penarikan Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.penarikan}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [
                    `Rp ${value.toLocaleString('id-ID')}`, 
                    'Penarikan'
                  ]}
                />
                <Bar dataKey="penarikan" fill={chartColors.penarikan} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Withdrawals Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowUpFromLine className="h-5 w-5" />
              Penarikan Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPenarikan.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Tanggal</th>
                        <th className="text-left p-2">Anggota</th>
                        <th className="text-right p-2">Jumlah</th>
                        <th className="text-left p-2">Kategori</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPenarikan.map((penarikan) => (
                        <tr key={penarikan.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">{new Date(penarikan.tanggal).toLocaleDateString('id-ID')}</td>
                          <td className="p-2 max-w-[120px] truncate">{penarikan.anggotaNama}</td>
                          <td className="p-2 text-right font-medium">
                            Rp {Math.abs(penarikan.jumlah).toLocaleString('id-ID')}
                          </td>
                          <td className="p-2">
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                              {penarikan.kategori || 'Umum'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ArrowUpFromLine className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Tidak ada data penarikan pada periode ini</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
