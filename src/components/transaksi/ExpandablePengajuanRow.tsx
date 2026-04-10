
import { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { Pengajuan } from "@/types";
import { useNavigate } from "react-router-dom";
import { getPengaturan } from "@/services/pengaturanService";
import * as Text from "@/components/ui/text";
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

  const getInterestRate = (kategori: string): number => {
    if (pengaturan?.sukuBunga?.pinjamanByCategory && kategori in pengaturan.sukuBunga.pinjamanByCategory) {
      return pengaturan.sukuBunga.pinjamanByCategory[kategori];
    }
    return pengaturan?.sukuBunga?.pinjaman || 1.5;
  };

  const detailFields = [
    { label: "ID Pengajuan", value: item.id },
    { label: "Tanggal", value: formatDate(item.tanggal) },
    { label: "Nama Anggota", value: item.anggotaNama },
    { label: "ID Anggota", value: item.anggotaId },
    { label: "Jenis", value: item.jenis, jenisBadge: true },
    { label: "Kategori", value: item.kategori || "-" },
    { label: "Jumlah", value: formatCurrency(item.jumlah), highlight: true },
    { label: "Status", value: item.status, statusBadge: true },
    ...(item.jenis === "Pinjam" ? [
      { label: "Suku Bunga", value: `${getInterestRate(item.kategori)}% per bulan` },
      { label: "Tenor", value: `${(item as any).tenor || 12} bulan` },
    ] : []),
    { label: "Keterangan", value: item.keterangan || "-", full: true },
    { label: "Dibuat", value: formatDate(item.createdAt) },
    { label: "Diperbarui", value: formatDate(item.updatedAt) },
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
          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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
        <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">
          <TableCell colSpan={colSpan + 1} className="p-0 border-none">
            <div className="px-10 py-6 border-l-4 border-slate-100 animate-in slide-in-from-top-1 duration-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {detailFields.map((field) => (
                  <div key={field.label} className={field.full ? "col-span-2 md:col-span-4" : ""}>
                    <Text.Label className="block mb-1">{field.label}</Text.Label>
                    {field.statusBadge ? (
                      getStatusBadge(field.value)
                    ) : field.jenisBadge ? (
                      getJenisBadge(field.value)
                    ) : field.highlight ? (
                      <Text.Amount className="text-base block">{field.value}</Text.Amount>
                    ) : (
                      <Text.Body className="text-[13px]">{field.value}</Text.Body>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full shadow-sm text-xs font-bold"
                  onClick={(e) => { e.stopPropagation(); navigate(`/transaksi/pengajuan/${item.id}`); }}
                >
                  Lihat Detail Lengkap
                </Button>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
