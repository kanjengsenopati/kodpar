
import { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { Pengajuan } from "@/types";
import { useNavigate } from "react-router-dom";
import { getPengaturan } from "@/services/pengaturanService";

interface ExpandablePengajuanRowProps {
  item: Pengajuan;
  onDelete: (id: string) => void;
  colSpan: number;
}

export function ExpandablePengajuanRow({ item, onDelete, colSpan }: ExpandablePengajuanRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const pengaturan = getPengaturan();

  const getStatusBadge = (status: string) => {
    const cls = status === "Menunggu" ? "bg-yellow-100 text-yellow-800" :
                status === "Disetujui" ? "bg-green-100 text-green-800" :
                "bg-red-100 text-red-800";
    return <Badge className={cls}>{status}</Badge>;
  };

  const getJenisBadge = (jenis: string) => {
    const cls = jenis === "Simpan" ? "bg-blue-100 text-blue-800" :
                jenis === "Pinjam" ? "bg-purple-100 text-purple-800" :
                "bg-orange-100 text-orange-800";
    return <Badge className={cls}>{jenis}</Badge>;
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
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TableCell className="w-8 px-2">
          {isOpen
            ? <ChevronDown className="h-4 w-4 text-muted-foreground" />
            : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
        </TableCell>
        <TableCell className="font-medium">{item.id}</TableCell>
        <TableCell>{formatDate(item.tanggal)}</TableCell>
        <TableCell>{item.anggotaNama}</TableCell>
        <TableCell>{getJenisBadge(item.jenis)}</TableCell>
        <TableCell className="font-semibold">{formatCurrency(item.jumlah)}</TableCell>
        <TableCell>{getStatusBadge(item.status)}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => navigate(`/transaksi/pengajuan/${item.id}/edit`)}
            >
              <Edit className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {isOpen && (
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableCell colSpan={colSpan + 1} className="p-0">
            <div className="px-6 py-4 border-l-4 border-primary/30 animate-in slide-in-from-top-1 duration-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {detailFields.map((field) => (
                  <div key={field.label} className={field.full ? "col-span-2 md:col-span-4" : ""}>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">{field.label}</p>
                    {field.statusBadge ? (
                      getStatusBadge(field.value)
                    ) : field.jenisBadge ? (
                      getJenisBadge(field.value)
                    ) : field.highlight ? (
                      <p className="text-sm font-bold text-primary">{field.value}</p>
                    ) : (
                      <p className="text-sm">{field.value}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
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
