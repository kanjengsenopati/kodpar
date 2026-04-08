
import { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { Transaksi } from "@/types";
import { Link } from "react-router-dom";

interface ExpandableTransaksiRowProps {
  transaksi: Transaksi;
  type: "simpan" | "pinjam" | "angsuran" | "penarikan";
  onDelete: (id: string) => void;
  colSpan: number;
}

export function ExpandableTransaksiRow({ transaksi, type, onDelete, colSpan }: ExpandableTransaksiRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const cls = status === "Sukses" ? "bg-green-100 text-green-800" :
                status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800";
    return <Badge className={cls}>{status}</Badge>;
  };

  const detailFields = [
    { label: "ID Transaksi", value: transaksi.id },
    { label: "Tanggal", value: formatDate(transaksi.tanggal) },
    { label: "Nama Anggota", value: transaksi.anggotaNama },
    { label: "ID Anggota", value: transaksi.anggotaId },
    { label: "Kategori", value: transaksi.kategori || "-" },
    { label: "Jumlah", value: formatCurrency(transaksi.jumlah), highlight: true },
    { label: "Status", value: transaksi.status, badge: true },
    { label: "Keterangan", value: transaksi.keterangan || "-", full: true },
    { label: "Dibuat", value: formatDate(transaksi.createdAt) },
    { label: "Diperbarui", value: formatDate(transaksi.updatedAt) },
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
        <TableCell className="font-medium">{transaksi.id}</TableCell>
        <TableCell>{formatDate(transaksi.tanggal)}</TableCell>
        <TableCell>{transaksi.anggotaNama}</TableCell>
        <TableCell>{transaksi.kategori || "-"}</TableCell>
        <TableCell className="font-semibold text-primary">
          {formatCurrency(transaksi.jumlah)}
        </TableCell>
        <TableCell>{getStatusBadge(transaksi.status)}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-1">
            <Button asChild variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Link to={`/transaksi/${type}/edit/${transaksi.id}`}>
                <Edit className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-destructive hover:text-destructive"
              onClick={() => onDelete(transaksi.id)}
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
                    {field.badge ? (
                      getStatusBadge(field.value)
                    ) : field.highlight ? (
                      <p className="text-sm font-bold text-primary">{field.value}</p>
                    ) : (
                      <p className="text-sm">{field.value}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
