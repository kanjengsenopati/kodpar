import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, BookOpen, Search, Calendar, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { BukuBesar, ChartOfAccount } from "@/types/akuntansi";
import { formatCurrency } from "@/utils/formatters";
import { getAllBukuBesar, getBukuBesarByAccountType } from "@/services/akuntansi/bukuBesarService";
import { getAllChartOfAccounts } from "@/services/akuntansi/coaService";
import * as Text from "@/components/ui/text";
import { cn } from "@/lib/utils";

export default function BukuBesarPage() {
  const navigate = useNavigate();
  const [bukuBesarData, setBukuBesarData] = useState<BukuBesar[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });
  const [selectedAccountType, setSelectedAccountType] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBukuBesar();
  }, [selectedPeriod, selectedAccountType]);

  const loadBukuBesar = async () => {
    setIsLoading(true);
    try {
      let data: BukuBesar[];
      
      if (selectedAccountType === "ALL") {
        data = await getAllBukuBesar(selectedPeriod);
      } else {
        data = await getBukuBesarByAccountType(selectedAccountType as any, selectedPeriod);
      }
      
      setBukuBesarData(data);
    } catch (error) {
      console.error("Error loading Buku Besar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = bukuBesarData.filter(bukuBesar => {
    if (!searchTerm.trim()) return true;
    const query = searchTerm.toLowerCase();
    return (
      bukuBesar.coa.nama.toLowerCase().includes(query) ||
      bukuBesar.coa.kode.toLowerCase().includes(query)
    );
  });

  const getPeriodLabel = (period: string) => {
    const [year, month] = period.split('-');
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  const getAccountTypeColor = (type: string) => {
    const colors = {
      'ASET': 'bg-blue-50 text-blue-600',
      'KEWAJIBAN': 'bg-red-50 text-red-600',
      'MODAL': 'bg-emerald-50 text-emerald-600',
      'PENDAPATAN': 'bg-indigo-50 text-indigo-600',
      'BEBAN': 'bg-orange-50 text-orange-600'
    };
    return colors[type as keyof typeof colors] || 'bg-slate-50 text-slate-400';
  };

  return (
    <Layout pageTitle="Buku Besar">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/akuntansi')} className="rounded-full hover:bg-slate-50 text-slate-400 gap-2">
            <ArrowLeft className="h-4 w-4" /> <Text.Label>Kembali</Text.Label>
          </Button>
          <Button variant="outline" className="rounded-full shadow-sm">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>

        <Card className="rounded-[24px] border-none shadow-sm overflow-hidden bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Cari nama atau kode akun..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-11 rounded-xl border-slate-100"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl border-slate-100">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-xl border-none">
                    {Array.from({ length: 12 }, (_, i) => {
                      const now = new Date();
                      const year = now.getFullYear();
                      const month = String(now.getMonth() - i + 1).padStart(2, '0');
                      const period = `${year}-${month}`;
                      return (
                        <SelectItem key={period} value={period} className="rounded-lg">
                          {getPeriodLabel(period)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                
                <Select value={selectedAccountType} onValueChange={setSelectedAccountType}>
                  <SelectTrigger className="w-full sm:w-48 h-11 rounded-xl border-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl shadow-xl border-none">
                    <SelectItem value="ALL" className="rounded-lg font-bold">Semua Jenis</SelectItem>
                    <SelectItem value="ASET" className="rounded-lg">Aset</SelectItem>
                    <SelectItem value="KEWAJIBAN" className="rounded-lg">Kewajiban</SelectItem>
                    <SelectItem value="MODAL" className="rounded-lg">Modal</SelectItem>
                    <SelectItem value="PENDAPATAN" className="rounded-lg">Pendapatan</SelectItem>
                    <SelectItem value="BEBAN" className="rounded-lg">Beban</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center bg-slate-50/50 rounded-[24px]">
              <BookOpen className="h-8 w-8 animate-pulse text-blue-600 mb-4" />
              <Text.Body>Memuat data Buku Besar...</Text.Body>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center bg-slate-50/50 rounded-[24px] border-dashed border-2">
              <BookOpen className="h-12 w-12 text-slate-200 mb-4" />
              <Text.H2 className="text-slate-400">Tidak ada data Buku Besar</Text.H2>
            </div>
          ) : (
            filteredData.map((bukuBesar) => (
              <Card key={bukuBesar.coaId} className="rounded-[24px] overflow-hidden border-none shadow-sm hover:shadow-md transition-all">
                <div className="p-6 bg-slate-50/10">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-start gap-4">
                      <div className={cn("p-3 rounded-2xl", getAccountTypeColor(bukuBesar.coa.jenis))}>
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <Text.H2 className="text-base mb-1">{bukuBesar.coa.kode} - {bukuBesar.coa.nama}</Text.H2>
                        <div className="flex items-center gap-2">
                          <div className={cn("px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider", getAccountTypeColor(bukuBesar.coa.jenis))}>
                            {bukuBesar.coa.jenis}
                          </div>
                          <Text.Caption className="not-italic text-slate-400">Normal: {bukuBesar.coa.saldoNormal}</Text.Caption>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Text.Amount className="text-lg block">{formatCurrency(bukuBesar.saldoAkhir)}</Text.Amount>
                      <Text.Caption className="not-italic text-slate-400 font-bold uppercase tracking-widest text-[9px]">Saldo Akhir</Text.Caption>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 mb-8 border-y border-slate-50 py-4">
                    <div className="text-center group">
                      <Text.Amount className="text-base text-blue-600 block">{formatCurrency(bukuBesar.totalDebit)}</Text.Amount>
                      <Text.Label className="text-slate-300 group-hover:text-blue-600/50 transition-colors">Total Debit</Text.Label>
                    </div>
                    <div className="text-center group">
                      <Text.Amount className="text-base text-red-600 block">{formatCurrency(bukuBesar.totalKredit)}</Text.Amount>
                      <Text.Label className="text-slate-300 group-hover:text-red-600/50 transition-colors">Total Kredit</Text.Label>
                    </div>
                    <div className="text-center group">
                      <Text.H2 className="text-base block">{bukuBesar.transaksi.length}</Text.H2>
                      <Text.Label className="text-slate-300 group-hover:text-slate-900/50 transition-colors">Transaksi</Text.Label>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-50 overflow-hidden bg-white">
                    <div className="bg-slate-50/50 px-4 py-3 border-b border-slate-50">
                      <div className="grid grid-cols-6 gap-4">
                        <Text.Label className="col-span-1">Tanggal</Text.Label>
                        <Text.Label className="col-span-1">No. Jurnal</Text.Label>
                        <Text.Label className="col-span-2">Keterangan</Text.Label>
                        <Text.Label className="col-span-1 text-right">Debit</Text.Label>
                        <Text.Label className="col-span-1 text-right">Kredit</Text.Label>
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {bukuBesar.transaksi.length === 0 ? (
                        <div className="p-8 text-center"><Text.Caption>Belum ada rincian transaksi</Text.Caption></div>
                      ) : (
                        bukuBesar.transaksi.map((transaksi, index) => (
                          <div key={index} className="px-4 py-3 border-b last:border-b-0 hover:bg-slate-50/30 transition-colors">
                            <div className="grid grid-cols-6 gap-4 items-center">
                              <Text.Caption className="col-span-1 not-italic font-bold">
                                 {transaksi.tanggal ? format(new Date(transaksi.tanggal), "dd/MM", { locale: id }) : '-'}
                              </Text.Caption>
                              <Text.Caption className="col-span-1 not-italic font-mono text-slate-400">
                                {transaksi.nomorJurnal}
                              </Text.Caption>
                              <Text.Body className="col-span-2 text-xs text-slate-500 line-clamp-1">
                                {transaksi.keterangan}
                              </Text.Body>
                              <Text.Amount className="col-span-1 text-right text-xs text-blue-600">
                                {transaksi.debit > 0 ? formatCurrency(transaksi.debit) : '-'}
                              </Text.Amount>
                              <Text.Amount className="col-span-1 text-right text-xs text-red-600">
                                {transaksi.kredit > 0 ? formatCurrency(transaksi.kredit) : '-'}
                              </Text.Amount>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
