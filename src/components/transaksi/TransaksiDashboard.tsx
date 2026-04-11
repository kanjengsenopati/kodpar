
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
  Clock,
  History,
  FileText
} from "lucide-react";
import { getCategoryNameSync } from "@/hooks/useCategoryLookup";
import { MemberName } from "@/components/anggota/MemberName";
import { Badge } from "@/components/ui/badge";
import * as Text from "@/components/ui/text";
import { cn } from "@/lib/utils";

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
        <Card className="hover:shadow-md transition-shadow border-none rounded-[24px] bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text.Label className="text-slate-400 mb-1">Total Simpanan</Text.Label>
                <Text.Amount className="text-2xl font-bold">{formatCurrency(totalSimpanan)}</Text.Amount>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3">
                <Wallet className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onNavigateToSimpanan}
              className="w-full justify-between mt-4 rounded-xl hover:bg-emerald-50 text-emerald-600 font-bold text-xs"
            >
              Lihat Simpanan <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
        
        {/* Pinjaman Summary */}
        <Card className="hover:shadow-md transition-shadow border-none rounded-[24px] bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text.Label className="text-slate-400 mb-1">Total Pinjaman</Text.Label>
                <Text.Amount className="text-2xl font-bold text-blue-600">{formatCurrency(totalPinjaman)}</Text.Amount>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onNavigateToPinjaman}
              className="w-full justify-between mt-4 rounded-xl hover:bg-blue-50 text-blue-600 font-bold text-xs"
            >
              Lihat Pinjaman <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
        
        {/* Angsuran Summary */}
        <Card className="hover:shadow-md transition-shadow border-none rounded-[24px] bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text.Label className="text-slate-400 mb-1">Total Angsuran</Text.Label>
                <Text.Amount className="text-2xl font-bold text-purple-600">{formatCurrency(totalAngsuran)}</Text.Amount>
              </div>
              <div className="rounded-2xl bg-purple-50 p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onNavigateToAngsuran}
              className="w-full justify-between mt-4 rounded-xl hover:bg-purple-50 text-purple-600 font-bold text-xs"
            >
              Lihat Angsuran <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
        
        {/* Pengajuan Summary */}
        <Card className="hover:shadow-md transition-shadow border-none rounded-[24px] bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text.Label className="text-slate-400 mb-1">Pengajuan Menunggu</Text.Label>
                <Text.Amount className="text-2xl font-bold text-amber-600">{pendingPengajuan}</Text.Amount>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <Button 
              variant="ghost" 
              onClick={onNavigateToPengajuan}
              className="w-full justify-between mt-4 rounded-xl hover:bg-amber-50 text-amber-600 font-bold text-xs"
            >
              Lihat Pengajuan <ArrowRight size={16} />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="rounded-[24px] border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <History className="h-4 w-4 text-slate-400" />
              Transaksi Terbaru
            </CardTitle>
            <Link to="/transaksi" className="text-[11px] font-bold text-blue-600 hover:underline uppercase tracking-wider">
              Lihat Semua
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">No. Transaksi</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Anggota</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Jumlah</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentTransaksi.map(transaksi => (
                    <tr key={transaksi.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3 px-4">
                        <Link 
                          to={`/transaksi/${transaksi.id}`}
                          className="flex flex-col"
                        >
                          <Text.Caption className="not-italic font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                            {transaksi.nomorTransaksi || (transaksi.id.length > 8 ? transaksi.id.substring(0,8) : transaksi.id)}
                          </Text.Caption>
                          <Text.Caption className="text-[8px] text-slate-300 font-mono mt-0.5">SYS: {transaksi.id.substring(0,8)}</Text.Caption>
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <MemberName memberId={transaksi.anggotaId} className="scale-90 origin-left" showId={true} />
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 text-[9px] border-none font-bold uppercase">
                          {getCategoryNameSync(transaksi.kategori)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Text.Amount className="text-xs font-bold">
                          {formatCurrency(transaksi.jumlah)}
                        </Text.Amount>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                          transaksi.status === "Sukses" ? "bg-emerald-50 text-emerald-600" : 
                          transaksi.status === "Pending" ? "bg-amber-50 text-amber-600" : 
                          "bg-red-50 text-red-600"
                        )}>
                          {transaksi.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {recentTransaksi.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10">
                        <Text.Body className="text-slate-400">Tidak ada transaksi terbaru</Text.Body>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Recent Applications */}
        <Card className="rounded-[24px] border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="h-4 w-4 text-slate-400" />
              Pengajuan Terbaru
            </CardTitle>
            <Link to="/transaksi/pengajuan" className="text-[11px] font-bold text-blue-600 hover:underline uppercase tracking-wider">
              Lihat Semua
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Anggota</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Jumlah</th>
                    <th className="py-3 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentPengajuan.map(pengajuan => (
                    <tr key={pengajuan.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3 px-4">
                        <Link 
                          to={`/transaksi/pengajuan/${pengajuan.id}`}
                          className="flex flex-col"
                        >
                          <Text.Caption className="not-italic font-bold text-slate-600 group-hover:text-blue-600 transition-colors">
                            {pengajuan.id.substring(0, 8)}
                          </Text.Caption>
                        </Link>
                      </td>
                      <td className="py-3 px-4">
                        <MemberName memberId={pengajuan.anggotaId} className="scale-90 origin-left" showId={true} />
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className="bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 text-[9px] border-none font-bold uppercase">
                          {getCategoryNameSync(pengajuan.kategori)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Text.Amount className="text-xs font-bold text-blue-600">
                          {formatCurrency(pengajuan.jumlah)}
                        </Text.Amount>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider",
                          pengajuan.status === "Disetujui" ? "bg-emerald-50 text-emerald-600" : 
                          pengajuan.status === "Menunggu" ? "bg-amber-50 text-amber-600" : 
                          "bg-red-50 text-red-600"
                        )}>
                          {pengajuan.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {recentPengajuan.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10">
                        <Text.Body className="text-slate-400">Tidak ada pengajuan terbaru</Text.Body>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right p-4 border-t border-slate-50">
              <Link 
                to="/transaksi/pengajuan"
                className="text-sm text-blue-600 hover:underline flex items-center justify-end gap-1 font-bold"
              >
                Semua Pengajuan <ArrowRight size={14} />
              </Link>
            </div>
          </CardContent>
        </Card>
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
