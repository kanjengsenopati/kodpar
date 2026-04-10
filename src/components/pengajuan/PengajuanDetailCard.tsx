
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pengajuan, Anggota } from "@/types";
import { Link } from "react-router-dom";
import * as Text from "@/components/ui/text";

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
      <CardHeader className="pb-3 px-5 pt-5">
        <Text.H2>Informasi Pengajuan</Text.H2>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
          <div>
            <Text.Label className="block mb-1">ID Pengajuan</Text.Label>
            <Text.Body className="font-semibold text-slate-800">{pengajuan.id}</Text.Body>
          </div>
          
          <div>
            <Text.Label className="block mb-1">Tanggal</Text.Label>
            <Text.Body>{formatDate(pengajuan.tanggal)}</Text.Body>
          </div>
          
          <div>
            <Text.Label className="block mb-1">Jenis Pengajuan</Text.Label>
            <div className="flex items-center">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                pengajuan.jenis === "Simpan" ? "bg-emerald-100 text-emerald-600" : 
                "bg-amber-100 text-amber-600"
              }`}>
                {pengajuan.jenis}
              </span>
            </div>
          </div>
          
          <div>
            <Text.Label className="block mb-1">Status</Text.Label>
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                pengajuan.status === "Disetujui" ? "bg-emerald-100 text-emerald-600" : 
                pengajuan.status === "Menunggu" ? "bg-amber-100 text-amber-600" : 
                "bg-red-100 text-red-600"
              }`}>
                {pengajuan.status}
              </span>
            </div>
          </div>
          
          <div>
            <Text.Label className="block mb-1">Jumlah</Text.Label>
            <Text.Amount>{formatCurrency(pengajuan.jumlah)}</Text.Amount>
          </div>
          
          <div>
            <Text.Label className="block mb-1">Keterangan</Text.Label>
            <Text.Body>{pengajuan.keterangan || "-"}</Text.Body>
          </div>
        </div>

        {pengajuan.buktiTransfer && (
          <div className="mt-6 p-4 border rounded-xl bg-slate-50">
            <p className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span className="p-1 bg-emerald-100 text-emerald-600 rounded">📸</span>
              Bukti Transfer
            </p>
            <div className="relative group overflow-hidden rounded-xl border-2 border-slate-200 bg-white">
              <img 
                src={pengajuan.buktiTransfer} 
                alt="Bukti Transfer" 
                className="max-h-[400px] w-auto mx-auto object-contain transition-transform group-hover:scale-105 cursor-zoom-in"
                onClick={() => window.open(pengajuan.buktiTransfer, '_blank')}
              />
              <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-3 py-1 bg-black/60 text-white text-[10px] font-bold rounded-full">Klik untuk memperbesar</span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 border-t border-slate-100 pt-6">
          <Text.H2 className="text-sm mb-4">Informasi Anggota</Text.H2>
          
          {anggota ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
              <div>
                <Text.Label className="block mb-1">ID Anggota</Text.Label>
                <Text.Body className="font-semibold text-slate-800">{anggota.id}</Text.Body>
              </div>
              
              <div>
                <Text.Label className="block mb-1">Nama</Text.Label>
                <Text.Body>
                  <Link 
                    to={`/anggota/${anggota.id}`}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    {anggota.nama}
                  </Link>
                </Text.Body>
              </div>
              
              <div>
                <Text.Label className="block mb-1">No. HP</Text.Label>
                <Text.Body>{anggota.noHp || "-"}</Text.Body>
              </div>
              
              <div>
                <Text.Label className="block mb-1">Alamat</Text.Label>
                <Text.Body>{anggota.alamat || "-"}</Text.Body>
              </div>
            </div>
          ) : (
            <Text.Body className="text-amber-600 italic">
              Data anggota tidak ditemukan
            </Text.Body>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
