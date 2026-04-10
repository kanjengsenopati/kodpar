import { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2, History, Info } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { Pengajuan } from "@/types";
import { useNavigate } from "react-router-dom";
import { getPengaturan } from "@/services/pengaturanService";
import * as Text from "@/components/ui/text";
import { NestedDetailTable } from "@/components/ui/NestedDetailTable";
import { cn } from "@/lib/utils";

interface ExpandablePengajuanRowProps {
  item: Pengajuan;
  onDelete: (id: string) => void;
  colSpan: number;
  index: number;
}

export function ExpandablePengajuanRow({ item, onDelete, colSpan, index }: ExpandablePengajuanRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const pengaturan = getPengaturan();

  const getStatusBadge = (status: string) => {
    const cls = status === "Menunggu" ? "bg-yellow-50 text-yellow-600" :
                status === "Disetujui" ? "bg-emerald-50 text-emerald-600" :
                "bg-red-50 text-red-600";
    return (
      <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", cls)}>
        {status}
      </div>
    );
  };

  const getJenisBadge = (jenis: string) => {
    const cls = jenis === "Simpan" ? "bg-blue-50 text-blue-600" :
                jenis === "Pinjam" ? "bg-purple-50 text-purple-600" :
                "bg-orange-50 text-orange-600";
    return (
      <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", cls)}>
        {jenis}
      </div>
    );
  };

  const mockHistory = [
    { tgl: "10 Apr 2026, 14:00", aksi: "Diajukan", oleh: "Anggota (Mariem)", ket: "Via Mobile App" },
    { tgl: "10 Apr 2026, 15:30", aksi: "Review", oleh: "Admin (Susi)", ket: "Verifikasi dokumen OK" },
    { tgl: "Sedang diproses", aksi: "Validasi", oleh: "Petugas Lapangan", ket: "Pengecekan unit" },
  ];

  return (
    <>
      <TableRow
        className="group cursor-pointer border-slate-50 hover:bg-slate-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TableCell className="text-center font-medium text-slate-400 text-xs">
          {index}
        </TableCell>
        <TableCell className="w-8 px-2">
          {isOpen
            ? <ChevronDown className="h-4 w-4 text-slate-400" />
            : <ChevronRight className="h-4 w-4 text-slate-400" />}
        </TableCell>
        <TableCell><Text.Caption className="not-italic font-bold text-slate-400">{item.id}</Text.Caption></TableCell>
        <TableCell><Text.Body className="text-xs">{formatDate(item.tanggal)}</Text.Body></TableCell>
        <TableCell><Text.Body className="font-bold text-slate-800">{item.anggotaNama}</Text.Body></TableCell>
        <TableCell>{getJenisBadge(item.jenis)}</TableCell>
        <TableCell><Text.Amount className="text-sm">{formatCurrency(item.jumlah)}</Text.Amount></TableCell>
        <TableCell>{getStatusBadge(item.status)}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()} className="text-right">
          <div className="flex justify-end gap-1.5 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => navigate(`/transaksi/pengajuan/${item.id}/edit`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {isOpen && (
        <TableRow className="bg-slate-50/20 hover:bg-slate-50/20 shadow-inner">
          <TableCell colSpan={colSpan + 1} className="p-0 border-none">
            <div className="px-10 py-6 border-l-4 border-slate-100 bg-white/40 backdrop-blur-sm animate-in slide-in-from-top-1 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Summary Panel */}
                <div className="md:col-span-4 space-y-4">
                  <div className="bg-slate-50/50 rounded-[20px] p-5 space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="h-3.5 w-3.5 text-blue-500" />
                      <Text.Label className="text-slate-400">Informasi Pengajuan</Text.Label>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between items-center">
                        <Text.Caption className="not-italic">Kategori</Text.Caption>
                        <Text.Body className="text-xs font-bold">{item.kategori || "Umum"}</Text.Body>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text.Caption className="not-italic">ID Anggota</Text.Caption>
                        <Text.Body className="text-xs font-bold">{item.anggotaId}</Text.Body>
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <Text.Caption className="not-italic mb-1 block">Catatan Tambahan</Text.Caption>
                        <Text.Body className="text-[12px] italic text-slate-500 leading-relaxed">
                          {item.keterangan || "Pemohon mengajukan dana untuk keperluan mendesak modal usaha."}
                        </Text.Body>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="link"
                    className="text-blue-600 hover:text-blue-700 text-[11px] font-bold h-auto p-0"
                    onClick={() => navigate(`/transaksi/pengajuan/${item.id}`)}
                  >
                    Buka Dokumen & Detail Lengkap →
                  </Button>
                </div>

                {/* History Table */}
                <div className="md:col-span-8">
                  <NestedDetailTable 
                    title="Riwayat Status & Validasi"
                    data={mockHistory}
                    columns={[
                      { header: "Waktu Update", accessor: "tgl" },
                      { 
                        header: "Aktivitas", 
                        accessor: "aksi",
                        render: (val) => (
                           <div className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                              <Text.Body className="text-xs font-semibold">{val}</Text.Body>
                           </div>
                        )
                      },
                      { header: "Oleh", accessor: "oleh" },
                      { header: "Keterangan Petugas", accessor: "ket", className: "italic text-slate-400" }
                    ]}
                  />
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
