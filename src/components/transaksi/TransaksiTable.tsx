
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Transaksi } from "@/types";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { ActionGrid } from "@/components/ui/action-grid";

interface TransaksiTableProps {
  data: Transaksi[];
  columns: Array<{id: string; label: string; isVisible: boolean}>;
  type: "simpan" | "pinjam" | "angsuran" | "penarikan";
  onDelete: (id: string) => void;
  emptyMessage?: string;
}

export function TransaksiTable({ 
  data, 
  columns, 
  type, 
  onDelete, 
  emptyMessage = "Tidak ada data yang ditemukan" 
}: TransaksiTableProps) {
  const visibleColumns = columns.filter(col => col.isVisible);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Sukses":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Gagal":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getJenisBadgeColor = (jenis: string) => {
    switch (jenis) {
      case "Simpan":
        return "bg-blue-100 text-blue-800";
      case "Pinjam":
        return "bg-amber-100 text-amber-800";
      case "Angsuran":
        return "bg-purple-100 text-purple-800";
      case "Penarikan":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {visibleColumns.map((column) => (
            <TableHead key={column.id}>{column.label}</TableHead>
          ))}
          <TableHead className="text-center w-[100px]">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((transaksi) => (
          <TableRow key={transaksi.id}>
            {visibleColumns.map((column) => (
              <TableCell key={column.id}>
                {column.id === "id" && transaksi.id}
                {column.id === "tanggal" && formatDate(transaksi.tanggal)}
                {column.id === "anggota" && transaksi.anggotaNama}
                {column.id === "jenis" && (
                  <Badge className={getJenisBadgeColor(transaksi.jenis)}>
                    {transaksi.jenis}
                  </Badge>
                )}
                {column.id === "jenisSimpanan" && (
                  <span className="text-sm font-medium text-blue-700">
                    {transaksi.kategori || "Simpanan Pokok"}
                  </span>
                )}
                {column.id === "jenisPinjaman" && (
                  <span className="text-sm font-medium text-amber-700">
                    {transaksi.kategori || "Pinjaman Reguler"}
                  </span>
                )}
                {column.id === "jumlah" && formatCurrency(transaksi.jumlah)}
                {column.id === "keterangan" && (
                  <div className="max-w-xs">
                    <span className="text-sm text-muted-foreground">
                      {transaksi.keterangan ? 
                        (transaksi.keterangan.length > 30 
                          ? `${transaksi.keterangan.substring(0, 30)}...` 
                          : transaksi.keterangan)
                        : "-"
                      }
                    </span>
                  </div>
                )}
                {column.id === "keteranganDetail" && (
                  <div className="max-w-sm">
                    <span className="text-sm text-gray-700 leading-relaxed">
                      {transaksi.keterangan ? 
                        transaksi.keterangan
                        : "-"
                      }
                    </span>
                    {transaksi.kategori && (
                      <div className="mt-1">
                        <Badge variant="outline" className="text-xs">
                          {transaksi.kategori}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}
                {column.id === "status" && (
                  <Badge className={getStatusBadgeColor(transaksi.status)}>
                    {transaksi.status}
                  </Badge>
                )}
              </TableCell>
            ))}
            <TableCell className="text-center">
              <div className="flex justify-center">
                <ActionGrid
                  onView={() => window.location.href = `/transaksi/${type}/${transaksi.id}`}
                  onEdit={() => window.location.href = `/transaksi/${type}/edit/${transaksi.id}`}
                  onDelete={() => onDelete(transaksi.id)}
                  layout="grid"
                  compact={true}
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
