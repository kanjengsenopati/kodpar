
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Transaksi, Pengajuan } from "@/types";
import { formatCurrency } from "@/utils/formatters";
import { TransactionTable } from "./TransactionTable";
import { PengajuanTable } from "./PengajuanTable";
import { 
  TrendingUp, 
  Wallet, 
  ArrowRight, 
  CreditCard,
  Clock
} from "lucide-react";

interface TransaksiDashboardProps {
  totalSimpanan: number;
  totalPinjaman: number;
  totalAngsuran: number;
  pendingPengajuan: number;
  recentTransaksi: Transaksi[];
  recentPengajuan: Pengajuan[];
  onNavigateToSimpanan: () => void;
  onNavigateToPinjaman: () => void;
  onNavigateToAngsuran: () => void;
  onNavigateToPengajuan: () => void;
}

export function TransaksiDashboard({
  totalSimpanan,
  totalPinjaman,
  totalAngsuran,
  pendingPengajuan,
  recentTransaksi,
  recentPengajuan,
  onNavigateToSimpanan,
  onNavigateToPinjaman,
  onNavigateToAngsuran,
  onNavigateToPengajuan,
}: TransaksiDashboardProps) {
  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Simpanan Summary */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Simpanan</p>
                <p className="text-2xl font-bold">{formatCurrency(totalSimpanan)}</p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onNavigateToSimpanan}
              className="w-full justify-between mt-4"
            >
              Lihat Simpanan <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
        
        {/* Pinjaman Summary */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Pinjaman</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPinjaman)}</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3">
                <CreditCard className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onNavigateToPinjaman}
              className="w-full justify-between mt-4"
            >
              Lihat Pinjaman <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
        
        {/* Angsuran Summary */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Angsuran</p>
                <p className="text-2xl font-bold">{formatCurrency(totalAngsuran)}</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onNavigateToAngsuran}
              className="w-full justify-between mt-4"
            >
              Lihat Angsuran <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
        
        {/* Pengajuan Summary */}
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pengajuan Menunggu</p>
                <p className="text-2xl font-bold">{pendingPengajuan}</p>
              </div>
              <div className="rounded-full bg-purple-100 p-3">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onNavigateToPengajuan}
              className="w-full justify-between mt-4"
            >
              Lihat Pengajuan <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-2 px-2">ID</th>
                    <th className="text-left font-medium py-2 px-2">Tanggal</th>
                    <th className="text-left font-medium py-2 px-2">Jenis</th>
                    <th className="text-left font-medium py-2 px-2">Jumlah</th>
                    <th className="text-left font-medium py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransaksi.map(transaksi => (
                    <tr key={transaksi.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2">
                        <Link 
                          to={`/transaksi/${transaksi.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {transaksi.id}
                        </Link>
                      </td>
                      <td className="py-2 px-2">{formatDate(transaksi.tanggal)}</td>
                      <td className="py-2 px-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          transaksi.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                          transaksi.jenis === "Pinjam" ? "bg-amber-100 text-amber-800" : 
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {transaksi.jenis}
                        </span>
                      </td>
                      <td className="py-2 px-2">{formatCurrency(transaksi.jumlah)}</td>
                      <td className="py-2 px-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          transaksi.status === "Sukses" ? "bg-green-100 text-green-800" : 
                          transaksi.status === "Pending" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-red-100 text-red-800"
                        }`}>
                          {transaksi.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentTransaksi.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        Tidak ada transaksi terbaru
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Link 
                to="/transaksi"
                className="text-sm text-blue-600 hover:underline flex items-center justify-end gap-1"
              >
                Lihat semua transaksi <ArrowRight size={14} />
              </Link>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Applications */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Pengajuan Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-medium py-2 px-2">ID</th>
                    <th className="text-left font-medium py-2 px-2">Tanggal</th>
                    <th className="text-left font-medium py-2 px-2">Jenis</th>
                    <th className="text-left font-medium py-2 px-2">Jumlah</th>
                    <th className="text-left font-medium py-2 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPengajuan.map(pengajuan => (
                    <tr key={pengajuan.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-2">
                        <Link 
                          to={`/transaksi/pengajuan/${pengajuan.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {pengajuan.id}
                        </Link>
                      </td>
                      <td className="py-2 px-2">{formatDate(pengajuan.tanggal)}</td>
                      <td className="py-2 px-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          pengajuan.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                          "bg-amber-100 text-amber-800"
                        }`}>
                          {pengajuan.jenis}
                        </span>
                      </td>
                      <td className="py-2 px-2">{formatCurrency(pengajuan.jumlah)}</td>
                      <td className="py-2 px-2">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          pengajuan.status === "Disetujui" ? "bg-green-100 text-green-800" : 
                          pengajuan.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" : 
                          "bg-red-100 text-red-800"
                        }`}>
                          {pengajuan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentPengajuan.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        Tidak ada pengajuan terbaru
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Link 
                to="/transaksi/pengajuan"
                className="text-sm text-blue-600 hover:underline flex items-center justify-end gap-1"
              >
                Lihat semua pengajuan <ArrowRight size={14} />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Tautan Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/transaksi/simpan/tambah">
                <Button variant="outline" className="w-full">
                  Tambah Simpanan
                </Button>
              </Link>
              <Link to="/transaksi/pinjam/tambah">
                <Button variant="outline" className="w-full">
                  Tambah Pinjaman
                </Button>
              </Link>
              <Link to="/transaksi/angsuran/tambah">
                <Button variant="outline" className="w-full">
                  Tambah Angsuran
                </Button>
              </Link>
              <Link to="/transaksi/pengajuan/tambah">
                <Button variant="outline" className="w-full">
                  Tambah Pengajuan
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
