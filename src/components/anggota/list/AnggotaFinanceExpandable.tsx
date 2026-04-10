
import React, { useState } from "react";
import { ChevronDown, ChevronRight, Eye, Edit, Trash2, Wallet, CreditCard, PieChart } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { formatRupiah, cn } from "@/lib/utils";
import * as Text from "@/components/ui/text";
import { NestedDetailTable } from "@/components/ui/NestedDetailTable";

interface AnggotaFinanceExpandableProps {
  anggota: any;
  index: number;
  columns: any[];
  visibleColumns: any[];
  getTotalSimpanan: (id: string) => number;
  getTotalPinjaman: (id: string) => number;
  getTotalSHU: (id: string) => number;
  getPetugas: (id: string) => string;
  onViewDetail: (id: string) => void;
  onDelete: (anggota: any) => void;
}

export function AnggotaFinanceExpandable({
  anggota,
  index,
  visibleColumns,
  getTotalSimpanan,
  getTotalPinjaman,
  getTotalSHU,
  getPetugas,
  onViewDetail,
  onDelete
}: AnggotaFinanceExpandableProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Mock data for finance tables
  const mockSavings = [
    { jenis: "Simpanan Pokok", nominal: getTotalSimpanan(anggota.id) * 0.2, status: "Aktif" },
    { jenis: "Simpanan Wajib", nominal: getTotalSimpanan(anggota.id) * 0.5, status: "Aktif" },
    { jenis: "Simpanan Sukarela", nominal: getTotalSimpanan(anggota.id) * 0.3, status: "Aktif" },
  ];

  const mockLoans = [
    { kontrak: "LN-2024-001", jenis: "Pinjaman Konsumtif", sisa: getTotalPinjaman(anggota.id), tenor: "12 Bulan" },
  ];

  return (
    <>
      <TableRow 
        className="group border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TableCell className="text-center font-medium text-slate-400 text-xs">
          {index}
        </TableCell>
        <TableCell className="w-8 px-2 text-center">
          {isOpen
            ? <ChevronDown className="h-4 w-4 text-slate-400" />
            : <ChevronRight className="h-4 w-4 text-slate-400" />}
        </TableCell>
        {visibleColumns.map((column) => (
          <TableCell key={column.id} className="py-2.5">
            {column.id === "id" && <Text.Caption className="not-italic font-bold text-slate-400">{anggota.id}</Text.Caption>}
            {column.id === "nama" && (
              <div className="flex flex-col">
                <Text.Body className="font-bold text-slate-800">{anggota.nama}</Text.Body>
                <Text.Caption className="not-italic text-[10px] text-slate-400">{anggota.nip || "-"}</Text.Caption>
              </div>
            )}
            {column.id === "nip" && <Text.Body className="text-xs">{anggota.nip}</Text.Body>}
            {column.id === "noHp" && <Text.Body className="text-xs">{anggota.noHp}</Text.Body>}
            {column.id === "unitKerja" && <Text.Body className="text-[13px]">{anggota.unitKerja}</Text.Body>}
            {column.id === "status" && (
              <div className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                anggota.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
              )}>
                {anggota.status === "active" ? "Aktif" : "Tidak Aktif"}
              </div>
            )}
            {column.id === "totalSimpanan" && <Text.Amount className="text-sm">{formatRupiah(getTotalSimpanan(anggota.id))}</Text.Amount>}
            {column.id === "totalPinjaman" && <Text.Amount className="text-sm text-blue-600">{formatRupiah(getTotalPinjaman(anggota.id))}</Text.Amount>}
            {column.id === "totalSHU" && <Text.Amount className="text-sm text-purple-600">{formatRupiah(getTotalSHU(anggota.id))}</Text.Amount>}
            {column.id === "petugas" && <Text.Body className="text-xs">{getPetugas(anggota.id)}</Text.Body>}
            {column.id === "tanggalBergabung" && <Text.Body className="text-xs">{anggota.tanggalBergabung && new Date(anggota.tanggalBergabung).toLocaleDateString('id-ID')}</Text.Body>}
          </TableCell>
        ))}
        <TableCell className="text-right py-2.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
              onClick={() => onViewDetail(anggota.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
              asChild
            >
              <Link to={`/master/anggota/edit/${anggota.id}`}>
                <Edit className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete(anggota)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>

      {isOpen && (
        <TableRow className="bg-slate-50/20 hover:bg-slate-50/20">
          <TableCell colSpan={visibleColumns.length + 3} className="p-0 border-none">
            <div className="px-12 py-8 border-l-4 border-slate-100 bg-white shadow-inner animate-in slide-in-from-top-1 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Savings Summary */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-emerald-500" />
                    <Text.H2 className="text-sm">Ringkasan Simpanan</Text.H2>
                  </div>
                  <NestedDetailTable 
                    title="Daftar Rekening Simpanan"
                    data={mockSavings}
                    columns={[
                      { header: "Jenis", accessor: "jenis" },
                      { 
                        header: "Saldo", 
                        accessor: "nominal",
                        render: (val) => <Text.Amount className="text-xs">{formatRupiah(val)}</Text.Amount>
                      },
                      { 
                        header: "Status", 
                        accessor: "status",
                        render: (val) => <div className="text-[10px] font-bold text-emerald-600 uppercase">{val}</div>
                      }
                    ]}
                  />
                </div>

                {/* Loans Summary */}
                <div className="space-y-4">
                   <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                    <Text.H2 className="text-sm">Riwayat Pinjaman Aktif</Text.H2>
                  </div>
                  <NestedDetailTable 
                    title="Pinjaman Berjalan"
                    data={mockLoans}
                    columns={[
                      { header: "No. Kontrak", accessor: "kontrak" },
                      { header: "Tenor", accessor: "tenor" },
                      { 
                        header: "Sisa Pinjaman", 
                        accessor: "sisa",
                        render: (val) => <Text.Amount className="text-xs text-blue-600">{formatRupiah(val)}</Text.Amount>
                      }
                    ]}
                  />
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <PieChart className="h-5 w-5 text-purple-500" />
                      <div>
                        <Text.Caption className="not-italic">Estimasi SHU Berjalan</Text.Caption>
                        <Text.Amount className="text-sm text-purple-600">{formatRupiah(getTotalSHU(anggota.id))}</Text.Amount>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-[11px] font-bold text-slate-400" onClick={() => onViewDetail(anggota.id)}>
                      Lihat Semua Laporan
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
