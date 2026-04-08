
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pengajuan, Anggota } from "@/types";
import { Link } from "react-router-dom";

interface PengajuanDetailCardProps {
  pengajuan: Pengajuan;
  anggota: Anggota | null;
  formatDate: (date: string) => string;
  formatCurrency: (amount: number) => string;
}

export function PengajuanDetailCard({ 
  pengajuan, 
  anggota,
  formatDate,
  formatCurrency
}: PengajuanDetailCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Informasi Pengajuan</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">ID Pengajuan</p>
            <p className="font-semibold">{pengajuan.id}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Tanggal</p>
            <p>{formatDate(pengajuan.tanggal)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Jenis Pengajuan</p>
            <div className="flex items-center">
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                pengajuan.jenis === "Simpan" ? "bg-green-100 text-green-800" : 
                "bg-amber-100 text-amber-800"
              }`}>
                {pengajuan.jenis}
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
            <div>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                pengajuan.status === "Disetujui" ? "bg-green-100 text-green-800" : 
                pengajuan.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" : 
                "bg-red-100 text-red-800"
              }`}>
                {pengajuan.status}
              </span>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Jumlah</p>
            <p className="text-lg font-bold">{formatCurrency(pengajuan.jumlah)}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Keterangan</p>
            <p>{pengajuan.keterangan || "-"}</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-medium text-muted-foreground mb-3">Informasi Anggota</p>
          
          {anggota ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">ID Anggota</p>
                <p className="font-semibold">{anggota.id}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Nama</p>
                <p>
                  <Link 
                    to={`/anggota/${anggota.id}`}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {anggota.nama}
                  </Link>
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">No. HP</p>
                <p>{anggota.noHp || "-"}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Alamat</p>
                <p>{anggota.alamat || "-"}</p>
              </div>
            </div>
          ) : (
            <p className="text-yellow-600">
              Data anggota tidak ditemukan
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
