import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2, Calendar, DollarSign, Clock, Loader2, User, ExternalLink } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDate, formatCurrency } from "@/utils/formatters";
import { Transaksi, JadwalAngsuran } from "@/types";
import { Link } from "react-router-dom";
import * as Text from "@/components/ui/text";
import { NestedDetailTable } from "@/components/ui/NestedDetailTable";
import { cn } from "@/lib/utils";
import { getScheduleByLoanId } from "@/services/transaksi/installmentScheduleService";
import { MemberName } from "@/components/anggota/MemberName";
import { getCategoryNameSync } from "@/hooks/useCategoryLookup";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMemberLookup } from "@/hooks/useMemberLookup";

interface ExpandableTransaksiRowProps {
  transaksi: Transaksi;
  type: "simpan" | "pinjam" | "angsuran" | "penarikan";
  onDelete: (id: string) => void;
  colSpan: number;
  index?: number;
}

export function ExpandableTransaksiRow({ transaksi, type, onDelete, colSpan, index }: ExpandableTransaksiRowProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [schedule, setSchedule] = useState<JadwalAngsuran[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && type === "pinjam") {
      const loadSchedule = async () => {
        setIsLoading(true);
        try {
          const data = await getScheduleByLoanId(transaksi.id);
          setSchedule(data);
        } catch (error) {
          console.error("Failed to load schedule:", error);
        } finally {
          setIsLoading(false);
        }
      };
      loadSchedule();
    }
  }, [isOpen, transaksi.id, type]);

  const { memberNo, memberName } = useMemberLookup(transaksi.anggotaId);

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

  const getInstallmentStatusCls = (status: string) => {
    switch (status) {
      case "DIBAYAR": return "text-emerald-600";
      case "TERLAMBAT": return "text-red-600";
      default: return "text-amber-500";
    }
  };

  const getBreakdownData = () => {
    const categoryName = getCategoryNameSync(transaksi.kategori);
    
    if (type === "angsuran") {
      const data = [];
      if (transaksi.nominalPokok) {
        data.push({ tipe: "Pokok Pinjaman", jumlah: transaksi.nominalPokok, catatan: "Membayar pokok pinjaman" });
      }
      if (transaksi.nominalJasa) {
        data.push({ tipe: "Jasa Pinjaman", jumlah: transaksi.nominalJasa, catatan: "Membayar jasa bulanan" });
      }
      // Fallback if not structurally separated
      if (data.length === 0) {
        data.push({ tipe: "Angsuran Total", jumlah: transaksi.jumlah, catatan: `Ref. Pinjaman: ${transaksi.referensiPinjamanId || '-'}` });
      }
      return data;
    }
    
    if (type === "simpan") {
      return [
        { tipe: `Simpanan ${categoryName}`, jumlah: transaksi.jumlah, catatan: "Setoran masuk" }
      ];
    }
    
    if (type === "penarikan") {
      return [
        { tipe: `Penarikan ${categoryName}`, jumlah: transaksi.jumlah, catatan: "Penarikan dana" }
      ];
    }

    return [];
  };

  const kategoriName = getCategoryNameSync(transaksi.kategori);

  return (
    <>
      <TableRow
        className="group cursor-pointer border-slate-50 hover:bg-slate-50/50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <TableCell className="text-center font-bold text-slate-300 text-[11px] w-10">
          {index !== undefined ? index : "-"}
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 shrink-0">
              {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </span>
            <Text.Caption className="not-italic font-bold text-slate-500 whitespace-nowrap">
              {transaksi.nomorTransaksi || (transaksi.id.length > 10 ? transaksi.id.substring(0,8) + "..." : transaksi.id)}
            </Text.Caption>
          </div>
        </TableCell>
        <TableCell><Text.Body className="text-xs">{formatDate(transaksi.tanggal)}</Text.Body></TableCell>
        <TableCell>
          <MemberName memberId={transaksi.anggotaId} className="font-bold text-slate-800" showId={true} />
        </TableCell>
        <TableCell>
          <Badge variant="secondary" className="bg-slate-100 text-slate-500 rounded px-1.5 py-0.5 text-[10px] border-none font-bold uppercase">
            {kategoriName}
          </Badge>
        </TableCell>
        <TableCell>
          <Text.Amount className="text-sm">
            {formatCurrency(transaksi.jumlah)}
          </Text.Amount>
        </TableCell>
        <TableCell>{getStatusBadge(transaksi.status)}</TableCell>
        <TableCell onClick={(e) => e.stopPropagation()} className="text-right">
          <div className="flex justify-end gap-1.5 transition-opacity">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50">
              <Link to={`/transaksi/${type}/detail/${transaksi.id}`}>
                <ExternalLink className="h-4 w-4" />
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
          <TableCell colSpan={colSpan + 2} className="p-0 border-none">
            <div className="px-10 py-6 border-l-4 border-slate-100 bg-white/40 backdrop-blur-sm animate-in slide-in-from-top-1 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Basic Info Summary */}
                <div className="md:col-span-4 space-y-4">
                  <div className="bg-slate-50/50 rounded-[24px] p-5 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <Text.Label className="text-slate-800 font-bold">Rincian Transaksi</Text.Label>
                      <Badge variant="outline" className="text-[9px] font-mono border-slate-200 text-slate-400 bg-white">
                        REF-ID: {transaksi.id.substring(0, 8)}
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-[11px] overflow-hidden">
                        <span className="shrink-0 mr-2 font-bold text-slate-700 uppercase tracking-wider">No. Transaksi</span>
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-bold">
                          {transaksi.nomorTransaksi || (transaksi.id.substring(0, 18) + "...")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center border-t border-slate-100 pt-3 text-[11px]">
                        <Text.Caption className="not-italic text-slate-700 font-bold uppercase tracking-wider">No. Anggota</Text.Caption>
                        <Text.Body className="font-bold text-xs bg-blue-50 text-blue-800 px-2 py-0.5 rounded-lg border border-blue-100/50">
                          {memberNo || (transaksi.anggotaId.substring(0, 15) + "...")}
                        </Text.Body>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <Text.Caption className="not-italic text-slate-700 font-bold uppercase tracking-wider">Dicek Pada</Text.Caption>
                        <Text.Body className="text-[10px] font-semibold text-slate-900">{formatDate(transaksi.createdAt)}</Text.Body>
                      </div>
                      <div className="pt-3 border-t border-slate-100">
                        <Text.Caption className="not-italic mb-1.5 block text-slate-700 font-bold uppercase tracking-wider text-[11px]">Keterangan</Text.Caption>
                        <Text.Body className="text-[13px] italic text-slate-800 leading-snug">
                          {transaksi.keterangan || "Tidak ada rincian keterangan tambahan."}
                        </Text.Body>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Nested Table Section */}
                <div className="md:col-span-8">
                  {type === "pinjam" ? (
                    isLoading ? (
                      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-100 rounded-[24px] bg-slate-50/50">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-3" />
                        <Text.Body className="text-slate-400">Memuat jadwal angsuran...</Text.Body>
                      </div>
                    ) : (
                      <NestedDetailTable 
                        title="Jadwal Angsuran & Tagihan"
                        data={schedule}
                        emptyMessage="Jadwal angsuran belum digenerate atau tidak ditemukan."
                        columns={[
                          { header: "Periode", accessor: "periode" },
                          { 
                            header: "Rencana Bayar", 
                            accessor: "tanggalJatuhTempo",
                            render: (val) => <Text.Body className="text-xs">{formatDate(val)}</Text.Body>
                          },
                          { 
                            header: "Besaran", 
                            accessor: "totalTagihan",
                            render: (val) => <Text.Amount className="text-xs">{formatCurrency(val)}</Text.Amount>
                          },
                          { 
                            header: "Status", 
                            accessor: "status",
                            render: (val) => (
                              <div className={cn("text-[10px] font-bold uppercase", getInstallmentStatusCls(val))}>
                                {val === "BELUM_BAYAR" ? "MENUNGGU" : val}
                              </div>
                            )
                          }
                        ]}
                      />
                    )
                  ) : (
                    <NestedDetailTable 
                      title={type === "angsuran" ? "Rincian Pembayaran Angsuran" : "Breakdown Alokasi Dana"}
                      data={getBreakdownData()}
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
