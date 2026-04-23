
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { formatCurrency } from "@/utils/formatters";
import { Transaksi, Jenis } from "@/types";
import { getJenisOptions } from "@/services/jenisService";
import { getCategoryNameSync } from "@/hooks/useCategoryLookup";
import { cn } from "@/lib/utils";
import * as Text from "@/components/ui/text";

interface SimpananTransactionTableProps {
  transaksi: Transaksi[];
}

export function SimpananTransactionTable({ transaksi }: SimpananTransactionTableProps) {
  const [selectedKategori, setSelectedKategori] = useState<string>("all");
  const [simpananCategories, setSimpananCategories] = useState<Jenis[]>([]);
  
  // Load available simpanan categories
  useEffect(() => {
    const loadCategories = async () => {
      const categories = await getJenisOptions("Simpanan");
      setSimpananCategories(categories);
    };
    loadCategories();
  }, []);
  
  // Filter transactions based on selected kategori
  const filteredTransaksi = useMemo(() => {
    if (selectedKategori === "all") {
      return transaksi;
    }
    return transaksi.filter(t => t.kategori === selectedKategori);
  }, [transaksi, selectedKategori]);
  
  // Calculate totals by category
  const totalsById = useMemo(() => {
    const totals: { [key: string]: { simpan: number; penarikan: number; net: number } } = {};
    
    // Initialize with all categories
    simpananCategories.forEach(kategori => {
      totals[kategori.nama] = { simpan: 0, penarikan: 0, net: 0 };
    });
    
    // Calculate totals
    transaksi.forEach(t => {
      const kategori = t.kategori ? getCategoryNameSync(t.kategori) : "Umum";
      if (!totals[kategori]) {
        totals[kategori] = { simpan: 0, penarikan: 0, net: 0 };
      }
      
      if (t.jenis === "Simpan") {
        totals[kategori].simpan += t.jumlah;
        totals[kategori].net += t.jumlah;
      } else if (t.jenis === "Penarikan") {
        totals[kategori].penarikan += t.jumlah;
        totals[kategori].net -= t.jumlah;
      }
    });
    
    return totals;
  }, [transaksi, simpananCategories]);
  
  // Calculate filtered totals
  const filteredTotals = useMemo(() => {
    let totalSimpan = 0;
    let totalPenarikan = 0;
    
    filteredTransaksi.forEach(t => {
      if (t.jenis === "Simpan") {
        totalSimpan += t.jumlah;
      } else if (t.jenis === "Penarikan") {
        totalPenarikan += t.jumlah;
      }
    });
    
    return {
      simpan: totalSimpan,
      penarikan: totalPenarikan,
      net: totalSimpan - totalPenarikan
    };
  }, [filteredTransaksi]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <Text.Label className="text-slate-400 mb-1.5 block">Filter Kategori Simpanan</Text.Label>
          <Select value={selectedKategori} onValueChange={setSelectedKategori}>
            <SelectTrigger id="kategoriFilter" className="rounded-xl border-slate-200 shadow-sm transition-all focus:ring-emerald-500/20">
              <SelectValue placeholder="Pilih kategori simpanan" />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-xl border-slate-100">
              <SelectItem value="all">Semua Kategori</SelectItem>
              {simpananCategories.map((kategori) => (
                <SelectItem key={kategori.id} value={kategori.id}>
                  {kategori.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-[24px] border-none bg-slate-50/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <CardContent className="pt-6">
            <div className="text-center">
              <Text.Label className="text-slate-400 block mb-1">Total Simpanan</Text.Label>
              <Text.Amount className="text-xl text-emerald-600 font-bold">{formatCurrency(filteredTotals.simpan)}</Text.Amount>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[24px] border-none bg-slate-50/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <CardContent className="pt-6">
            <div className="text-center">
              <Text.Label className="text-slate-400 block mb-1">Total Penarikan</Text.Label>
              <Text.Amount className="text-xl text-red-600 font-bold">{formatCurrency(filteredTotals.penarikan)}</Text.Amount>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-[24px] border-none bg-slate-50/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
          <CardContent className="pt-6">
            <div className="text-center">
              <Text.Label className="text-slate-400 block mb-1">Saldo Bersih</Text.Label>
              <Text.Amount className={cn("text-xl font-bold", filteredTotals.net >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                {formatCurrency(filteredTotals.net)}
              </Text.Amount>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown by Category (when showing all) */}
      {selectedKategori === "all" && (
        <Card className="rounded-[24px] border-none bg-slate-50/50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
          <CardHeader className="bg-white/40 pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-700">Breakdown per Kategori Simpanan</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {Object.entries(totalsById).map(([kategori, totals], idx) => (
                <div key={kategori} className={cn(
                  "flex justify-between items-center p-5 bg-transparent",
                  idx % 2 === 0 && "md:border-r border-slate-100",
                  idx > 1 && "border-t border-slate-100"
                )}>
                  <Text.Body className="font-bold text-slate-800">{kategori}</Text.Body>
                  <div className="text-right flex flex-col items-end">
                    <div className="flex gap-2 text-[10px] font-bold">
                      <span className="text-emerald-600">IN: {formatCurrency(totals.simpan)}</span>
                      <span className="text-red-400">OUT: {formatCurrency(totals.penarikan)}</span>
                    </div>
                    <Text.Amount className={cn("text-sm font-bold mt-0.5", totals.net >= 0 ? 'text-emerald-600' : 'text-red-600')}>
                      {formatCurrency(totals.net)}
                    </Text.Amount>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Transaction Table */}
      <Card className="rounded-[24px] border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-50">
                  <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tanggal</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Jenis</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Kategori</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Jumlah</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Keterangan</TableHead>
                  <TableHead className="py-4 px-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransaksi.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12">
                      <Text.Caption className="not-italic">
                        {selectedKategori === "all" 
                          ? "Tidak ada data transaksi simpanan yang ditemukan"
                          : `Tidak ada transaksi untuk kategori "${selectedKategori}"`
                        }
                      </Text.Caption>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransaksi.map((tr) => (
                    <TableRow key={tr.id} className="border-slate-50 hover:bg-slate-50/30 transition-colors">
                      <TableCell className="px-6 py-4">
                        <Text.Caption className="not-italic font-mono text-[9px] text-slate-400 opacity-60">
                          SYS: {tr.id.substring(0, 8)}...
                        </Text.Caption>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Text.Body className="text-xs text-nowrap">{formatDate(tr.tanggal)}</Text.Body>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <div className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          tr.jenis === "Simpan" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        )}>
                          {tr.jenis}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-slate-100 text-slate-500 bg-slate-50/50">
                          {getCategoryNameSync(tr.kategori)}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Text.Amount className={cn("text-xs font-bold", tr.jenis === "Simpan" ? "text-emerald-600" : "text-red-600")}>
                          {tr.jenis === "Simpan" ? "+" : "-"}{formatCurrency(tr.jumlah)}
                        </Text.Amount>
                      </TableCell>
                      <TableCell className="px-6 py-4 max-w-[200px]">
                        <Text.Caption className="not-italic text-slate-500 line-clamp-2 leading-relaxed">
                          {tr.keterangan || "-"}
                        </Text.Caption>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          tr.status === "Sukses" ? "bg-emerald-50 text-emerald-600" : 
                          tr.status === "Pending" ? "bg-yellow-50 text-yellow-600" : 
                          "bg-red-50 text-red-600"
                        )}>
                          {tr.status}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Sum Summary at bottom */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-blue-800">
              {selectedKategori === "all" ? "Total Keseluruhan" : `Total ${selectedKategori}`}:
            </span>
            <div className="flex gap-4 text-sm">
              <span className="text-green-600 font-semibold">
                Simpan: {formatCurrency(filteredTotals.simpan)}
              </span>
              <span className="text-red-600 font-semibold">
                Penarikan: {formatCurrency(filteredTotals.penarikan)}
              </span>
              <span className={`font-bold ${filteredTotals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                Saldo: {formatCurrency(filteredTotals.net)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
