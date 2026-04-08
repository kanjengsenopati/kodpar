
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BookOpen, Search, Calendar, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { BukuBesar, ChartOfAccount } from "@/types/akuntansi";
import { formatCurrency } from "@/utils/formatters";
import { getAllBukuBesar, getBukuBesarByAccountType } from "@/services/akuntansi/bukuBesarService";
import { getAllChartOfAccounts } from "@/services/akuntansi/coaService";

export default function BukuBesarPage() {
  const navigate = useNavigate();
  const [bukuBesarData, setBukuBesarData] = useState<BukuBesar[]>([]);
  const [accounts, setAccounts] = useState<ChartOfAccount[]>([]);
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
    loadAccounts();
  }, []);

  useEffect(() => {
    loadBukuBesar();
  }, [selectedPeriod, selectedAccountType]);

  const loadAccounts = () => {
    const data = getAllChartOfAccounts();
    setAccounts(data);
  };

  const loadBukuBesar = () => {
    setIsLoading(true);
    try {
      let data: BukuBesar[];
      
      if (selectedAccountType === "ALL") {
        data = getAllBukuBesar(selectedPeriod);
      } else {
        data = getBukuBesarByAccountType(selectedAccountType as any, selectedPeriod);
      }
      
      setBukuBesarData(data);
      console.log(`Loaded ${data.length} Buku Besar entries for period ${selectedPeriod}`);
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
      'ASET': 'bg-blue-100 text-blue-800',
      'KEWAJIBAN': 'bg-red-100 text-red-800',
      'MODAL': 'bg-green-100 text-green-800',
      'PENDAPATAN': 'bg-purple-100 text-purple-800',
      'BEBAN': 'bg-orange-100 text-orange-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Layout pageTitle="Buku Besar">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/akuntansi')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Buku Besar</h1>
              <p className="text-muted-foreground">
                General Ledger untuk periode {getPeriodLabel(selectedPeriod)}
              </p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari berdasarkan nama atau kode akun..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-48">
                    <Calendar className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => {
                      const now = new Date();
                      const year = now.getFullYear();
                      const month = String(now.getMonth() - i + 1).padStart(2, '0');
                      const period = `${year}-${month}`;
                      return (
                        <SelectItem key={period} value={period}>
                          {getPeriodLabel(period)}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                
                <Select value={selectedAccountType} onValueChange={setSelectedAccountType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Jenis</SelectItem>
                    <SelectItem value="ASET">Aset</SelectItem>
                    <SelectItem value="KEWAJIBAN">Kewajiban</SelectItem>
                    <SelectItem value="MODAL">Modal</SelectItem>
                    <SelectItem value="PENDAPATAN">Pendapatan</SelectItem>
                    <SelectItem value="BEBAN">Beban</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Buku Besar Data */}
        <div className="space-y-4">
          {isLoading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 animate-pulse mx-auto mb-4" />
                  <p>Memuat data Buku Besar...</p>
                </div>
              </CardContent>
            </Card>
          ) : filteredData.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tidak ada data Buku Besar</h3>
                <p className="text-muted-foreground text-center">
                  Tidak ada transaksi untuk periode dan filter yang dipilih
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredData.map((bukuBesar) => (
              <Card key={bukuBesar.coaId} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {bukuBesar.coa.kode} - {bukuBesar.coa.nama}
                        <Badge className={getAccountTypeColor(bukuBesar.coa.jenis)}>
                          {bukuBesar.coa.jenis}
                        </Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Saldo Normal: {bukuBesar.coa.saldoNormal}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {formatCurrency(bukuBesar.saldoAkhir)}
                      </div>
                      <p className="text-xs text-muted-foreground">Saldo Akhir</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-blue-600">
                        {formatCurrency(bukuBesar.totalDebit)}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Debit</p>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-red-600">
                        {formatCurrency(bukuBesar.totalKredit)}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Kredit</p>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {bukuBesar.transaksi.length} transaksi
                      </div>
                      <p className="text-xs text-muted-foreground">Jumlah Transaksi</p>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <div className="grid grid-cols-6 gap-4 text-xs font-medium text-gray-600">
                        <div className="col-span-1">Tanggal</div>
                        <div className="col-span-1">No. Jurnal</div>
                        <div className="col-span-2">Keterangan</div>
                        <div className="col-span-1 text-right">Debit</div>
                        <div className="col-span-1 text-right">Kredit</div>
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {bukuBesar.transaksi.map((transaksi, index) => (
                        <div key={index} className="px-4 py-2 border-b last:border-b-0 hover:bg-gray-50">
                          <div className="grid grid-cols-6 gap-4 text-sm">
                            <div className="col-span-1">
                              {format(new Date(transaksi.tanggal), "dd/MM", { locale: id })}
                            </div>
                            <div className="col-span-1 font-medium">
                              {transaksi.nomorJurnal}
                            </div>
                            <div className="col-span-2 text-gray-700">
                              {transaksi.keterangan}
                            </div>
                            <div className="col-span-1 text-right font-medium text-blue-600">
                              {transaksi.debit > 0 ? formatCurrency(transaksi.debit) : '-'}
                            </div>
                            <div className="col-span-1 text-right font-medium text-red-600">
                              {transaksi.kredit > 0 ? formatCurrency(transaksi.kredit) : '-'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
