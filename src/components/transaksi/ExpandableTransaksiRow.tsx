import { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2, Calendar, DollarSign, Clock } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { Transaksi } from "@/types";
import { Link } from "react-router-dom";
import * as Text from "@/components/ui/text";
import { NestedDetailTable } from "@/components/ui/NestedDetailTable";
import { cn } from "@/lib/utils";

interface ExpandableTransaksiRowProps {
  transaksi: Transaksi;
  type: "simpan" | "pinjam" | "angsuran" | "penarikan";
  onDelete: (id: string) => void;
  colSpan: number;
}

export function ExpandableTransaksiRow({ transaksi, type, onDelete, colSpan }: ExpandableTransaksiRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    const cls = status === "Sukses" ? "bg-emerald-50 text-emerald-600" :
                status === "Pending" ? "bg-yellow-50 text-yellow-600" :
                "bg-red-50 text-red-600";
    return (
      <div className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider", cls)}>
        {status}
      </div>
    );
  };

  // Mock data for nested tables
  const mockSchedules = [
    { bulan: "Januari 2026", jumlah: transaksi.jumlah / 10, status: "Dibayar", tgl: "10 Jan 2026" },
    { bulan: "Februari 2026", jumlah: transaksi.jumlah / 10, status: "Dibayar", tgl: "12 Feb 2026" },
    { bulan: "Maret 2026", jumlah: transaksi.jumlah / 10, status: "Menunggu", tgl: "-" },
  ];

  const mockBreakdown = [
    { tipe: "Pokok", jumlah: transaksi.jumlah * 0.4, catatan: "Simpanan awal" },
    { tipe: "Wajib", jumlah: transaksi.jumlah * 0.3, catatan: "Iuran rutin" },
    { tipe: "Sukarela", jumlah: transaksi.jumlah * 0.3, catatan: "Tambahan" },
  ];

  return (
    <>
      <TableRow
        className="group cursor-pointer border-slate-50 hover:bg-slate-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TableCell className="w-8 px-2 text-center">
          {isOpen
            ? <ChevronDown className="h-4 w-4 text-slate-400" />
            : <ChevronRight className="h-4 w-4 text-slate-400" />}
        </TableCell>
        <TableCell><Text.Caption className="not-italic font-bold text-slate-400">{transaksi.id}</Text.Caption></TableCell>
        <TableCell><Text.Body className="text-xs">{formatDate(transaksi.tanggal)}</Text.Body></TableCell>
        <TableCell><Text.Body className="font-bold text-slate-800">{transaksi.anggotaNama}</Text.Body></TableCell>
        <TableCell><Text.Label className="bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 text-[10px]">{transaksi.kategori || "-"}</Text.Label></TableCell>
        <TableCell>
          <Text.Amount className="text-sm">
            {formatCurrency(transaksi.jumlah)}
          </Text.Amount>
        </TableCell>
        <TableCell>{getStatusBadge(transaksi.status)}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()} className="text-right">
          <div className="flex justify-end gap-1.5 transition-opacity">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
              <Link to={`/transaksi/${type}/edit/${transaksi.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete(transaksi.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {isOpen && (
        <TableRow className="bg-slate-50/20 hover:bg-slate-50/20">
          <TableCell colSpan={colSpan + 1} className="p-0 border-none">
            <div className="px-10 py-6 border-l-4 border-slate-100 bg-white/40 backdrop-blur-sm animate-in slide-in-from-top-1 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Basic Info Summary */}
                <div className="md:col-span-4 space-y-4">
                  <div className="bg-slate-50/50 rounded-[20px] p-5 space-y-3">
                    <Text.Label className="text-slate-400">Rincian Transaksi</Text.Label>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Text.Caption className="not-italic">ID Anggota</Text.Caption>
                        <Text.Body className="font-bold">{transaksi.anggotaId}</Text.Body>
                      </div>
                      <div className="flex justify-between items-center">
                        <Text.Caption className="not-italic">Dicek Pada</Text.Caption>
                        <Text.Body className="text-xs">{formatDate(transaksi.createdAt)}</Text.Body>
                      </div>
                      <div className="pt-2 border-t border-slate-100">
                        <Text.Caption className="not-italic mb-1 block">Keterangan</Text.Caption>
                        <Text.Body className="text-[13px] italic text-slate-500 leading-snug">
                          {transaksi.keterangan || "Tidak ada keterangan tambahan dari petugas."}
                        </Text.Body>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nested Table Section */}
                <div className="md:col-span-8">
                  {type === "pinjam" ? (
                    <NestedDetailTable 
                      title="Jadwal Angsuran & Tagihan"
                      data={mockSchedules}
                      columns={[
                        { header: "Periode", accessor: "bulan" },
                        { header: "Rencana Bayar", accessor: "tgl" },
                        { 
                          header: "Besaran", 
                          accessor: "jumlah",
                          render: (val) => <Text.Amount className="text-xs">{formatCurrency(val)}</Text.Amount>
                        },
                        { 
                          header: "Status", 
                          accessor: "status",
                          render: (val) => (
                            <div className={cn("text-[10px] font-bold uppercase", val === "Dibayar" ? "text-emerald-600" : "text-amber-500")}>
                              {val}
                            </div>
                          )
                        }
                      ]}
                    />
                  ) : (
                    <NestedDetailTable 
                      title="Breakdown Alokasi Dana"
                      data={mockBreakdown}
                      columns={[
                        { header: "Tipe Alokasi", accessor: "tipe" },
                        { 
                          header: "Nominal", 
                          accessor: "jumlah",
                          render: (val) => <Text.Amount className="text-xs">{formatCurrency(val)}</Text.Amount>
                        },
                        { header: "Catatan", accessor: "catatan", className: "italic text-slate-400" }
                      ]}
                    />
                  )}
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
