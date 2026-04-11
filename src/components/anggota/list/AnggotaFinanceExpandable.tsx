
import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2, Wallet, CreditCard, PieChart, User, MapPin, Phone, Calendar, History } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatDate, formatRupiah } from "@/utils/formatters";
import * as Text from "@/components/ui/text";
import { NestedDetailTable } from "@/components/ui/NestedDetailTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getTransaksiByAnggotaId } from "@/services/transaksiService";
import { Transaksi } from "@/types";
import { getCategoryNameSync } from "@/hooks/useCategoryLookup";

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
  const [history, setHistory] = useState<Transaksi[]>([]);

  useEffect(() => {
    if (isOpen) {
      const loadHistory = async () => {
        try {
          const data = await getTransaksiByAnggotaId(anggota.id);
          // Only show last 5 transactions for the expandable summary
          setHistory((data || []).sort((a, b) => 
            new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
          ).slice(0, 5));
        } catch (error) {
          console.error("Error loading history for expandable:", error);
        }
      };
      loadHistory();
    }
  }, [isOpen, anggota.id]);

  // Mock data for finance tables (can be replaced by real breakdowns if available)
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
            {column.id === "id" && <Text.Caption className="not-italic font-bold text-slate-400">{anggota.noAnggota || anggota.id}</Text.Caption>}
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
            {column.id === "tanggalBergabung" && <Text.Body className="text-xs">{formatDate(anggota.tanggalBergabung)}</Text.Body>}
          </TableCell>
        ))}
        <TableCell className="text-right py-2.5" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-end gap-1.5 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
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
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                {/* Biodata Section */}
                <div className="md:col-span-3 space-y-6">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <Text.H2 className="text-sm">Biodata Anggota</Text.H2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-slate-50/50 rounded-2xl p-4 space-y-3 border border-slate-100/50">
                      <div className="flex flex-col">
                        <Text.Label className="text-slate-400 mb-0.5">ID Anggota (Clean)</Text.Label>
                        <Text.Body className="font-bold text-slate-800">{anggota.noAnggota || "-"}</Text.Body>
                        <Text.Caption className="not-italic text-[9px] text-slate-300 mt-1 uppercase tracking-tighter">ID Sistem (UUID): {anggota.id}</Text.Caption>
                      </div>
                      
                      <div className="flex flex-col">
                        <Text.Label className="text-slate-400 mb-0.5">Alamat Lengkap</Text.Label>
                        <div className="flex gap-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-300 shrink-0 mt-0.5" />
                          <Text.Body className="text-xs leading-relaxed">{anggota.alamat || "Alamat belum dilengkapi"}</Text.Body>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <Text.Label className="text-slate-400 mb-0.5">Kontak</Text.Label>
                        <div className="flex items-center gap-2 text-xs">
                          <Phone className="h-3.5 w-3.5 text-slate-300" />
                          <Text.Body className="text-xs">{anggota.noHp || "-"}</Text.Body>
                        </div>
                      </div>

                      <div className="flex flex-col">
                        <Text.Label className="text-slate-400 mb-0.5">Bergabung Sejak</Text.Label>
                        <div className="flex items-center gap-2 text-xs">
                          <Calendar className="h-3.5 w-3.5 text-slate-300" />
                          <Text.Body className="text-xs">{formatDate(anggota.tanggalBergabung)}</Text.Body>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-purple-50 rounded-2xl flex items-center gap-3">
                      <PieChart className="h-5 w-5 text-purple-500" />
                      <div>
                        <Text.Caption className="not-italic">Estimasi SHU Berjalan</Text.Caption>
                        <Text.Amount className="text-sm text-purple-600">{formatRupiah(getTotalSHU(anggota.id))}</Text.Amount>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Finance Summary Tabs */}
                <div className="md:col-span-9">
                  <Tabs defaultValue="simpanan" className="w-full">
                    <TabsList className="bg-slate-100/80 p-1.5 rounded-[20px] mb-6 flex w-full md:w-fit">
                      <TabsTrigger value="simpanan" className="rounded-[14px] px-5 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 transition-all text-xs font-bold gap-2">
                        <Wallet className="h-4 w-4" />
                        Ringkasan Simpanan
                      </TabsTrigger>
                      <TabsTrigger value="pinjaman" className="rounded-[14px] px-5 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all text-xs font-bold gap-2">
                        <CreditCard className="h-4 w-4" />
                        Riwayat Pinjaman Aktif
                      </TabsTrigger>
                      <TabsTrigger value="transaksi" className="rounded-[14px] px-5 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-800 transition-all text-xs font-bold gap-2">
                        <History className="h-4 w-4" />
                        5 Transaksi Aktif
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="simpanan" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                        <NestedDetailTable 
                          title="Daftar Rekening Simpanan"
                          data={mockSavings}
                          columns={[
                            { header: "Jenis Simpanan", accessor: "jenis", render: (val) => <Text.Body className="font-semibold text-slate-700">{val}</Text.Body> },
                            { 
                              header: "Saldo Terakhir", 
                              accessor: "nominal",
                              render: (val) => <Text.Amount className="text-sm font-bold">{formatRupiah(val)}</Text.Amount>
                            },
                            { 
                              header: "Status", 
                              accessor: "status",
                              render: (val) => (
                                <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-bold uppercase tracking-wider">
                                  {val}
                                </div>
                              )
                            }
                          ]}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="pinjaman" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                        <NestedDetailTable 
                          title="Pinjaman Berjalan (Outstanding)"
                          data={mockLoans}
                          emptyMessage="Tidak ada pinjaman aktif saat ini"
                          columns={[
                            { header: "No. Kontrak", accessor: "kontrak", render: (val) => <Text.Caption className="not-italic font-bold text-blue-600">{val}</Text.Caption> },
                            { header: "Tenor", accessor: "tenor" },
                            { 
                              header: "Sisa Pinjaman", 
                              accessor: "sisa",
                              render: (val) => <Text.Amount className="text-sm text-blue-600 font-bold">{formatRupiah(val)}</Text.Amount>
                            },
                            {
                              header: "Status",
                              accessor: "id",
                              render: () => <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 text-[9px] font-bold uppercase tracking-wider">BERJALAN</div>
                            }
                          ]}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="transaksi" className="animate-in fade-in-50 slide-in-from-bottom-2 duration-300">
                      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
                        <NestedDetailTable 
                          title="Log Aktivitas Keuangan (5 Terakhir)"
                          data={history}
                          emptyMessage="Belum ada riwayat transaksi"
                          columns={[
                            { header: "Tanggal", accessor: "tanggal", render: (val) => <Text.Body className="text-xs">{formatDate(val)}</Text.Body> },
                            { header: "No. Transaksi", accessor: "nomorTransaksi", render: (val, item: any) => <Text.Caption className="not-italic font-bold text-slate-400">{val || (item.id.length > 10 ? item.id.substring(0,8) : item.id)}</Text.Caption> },
                            { header: "Jenis", accessor: "jenis", render: (val) => (
                              <Badge variant="outline" className={cn(
                                "text-[9px] font-bold uppercase border-none",
                                val === "Simpan" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                              )}>
                                {val}
                              </Badge>
                            )},
                            { 
                              header: "Kategori", 
                              accessor: "kategori",
                              render: (val) => <Text.Body className="text-[12px] font-medium text-slate-600">{getCategoryNameSync(val)}</Text.Body>
                            },
                            { 
                              header: "Jumlah", 
                              accessor: "jumlah", 
                              render: (val) => <Text.Amount className="text-sm font-bold">{formatRupiah(val)}</Text.Amount>
                            },
                            { 
                              header: "Status", 
                              accessor: "status",
                              render: (val) => (
                                <div className={cn(
                                  "text-[10px] font-bold uppercase",
                                  val === "Sukses" ? "text-emerald-600" : "text-amber-500"
                                )}>
                                  {val}
                                </div>
                              )
                            }
                          ]}
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
