
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PiggyBank, CreditCard, Receipt, User, FileCheck, AlertTriangle, Clock, ArrowUpFromLine } from "lucide-react";

interface FinancialStatsCardsProps {
  stats: {
    totalAnggota: number;
    totalSimpanan: number;
    totalPinjaman: number;
    totalAngsuran: number;
    totalPenarikan: number;
    totalPengajuan: number;
    totalTunggakan: number;
    totalJatuhTempo: number;
  };
}

export function FinancialStatsCards({ stats }: FinancialStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalAnggota}</div>
          <p className="text-xs text-muted-foreground">
            Anggota terdaftar
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Simpanan</CardTitle>
          <PiggyBank className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {stats.totalSimpanan.toLocaleString('id-ID')}</div>
          <p className="text-xs text-muted-foreground">
            Dana simpanan anggota
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pinjaman</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {stats.totalPinjaman.toLocaleString('id-ID')}</div>
          <p className="text-xs text-muted-foreground">
            Dana pinjaman tersalur
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Angsuran</CardTitle>
          <Receipt className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {stats.totalAngsuran.toLocaleString('id-ID')}</div>
          <p className="text-xs text-muted-foreground">
            Pembayaran angsuran
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Penarikan</CardTitle>
          <ArrowUpFromLine className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Rp {stats.totalPenarikan.toLocaleString('id-ID')}</div>
          <p className="text-xs text-muted-foreground">
            Dana penarikan
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Pengajuan</CardTitle>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPengajuan}</div>
          <p className="text-xs text-muted-foreground">
            Pengajuan menunggu
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tunggakan</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.totalTunggakan}</div>
          <p className="text-xs text-muted-foreground">
            Pinjaman menunggak
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Jatuh Tempo</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.totalJatuhTempo}</div>
          <p className="text-xs text-muted-foreground">
            Pinjaman mendekati jatuh tempo
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
