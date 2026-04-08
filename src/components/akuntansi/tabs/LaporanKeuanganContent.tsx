
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  FileBarChart, 
  TrendingUp, 
  TrendingDown,
  Building,
  DollarSign,
  Download,
  RefreshCw,
  Calendar
} from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { useToast } from "@/components/ui/use-toast";
import { Neraca, LabaRugi } from "@/types/akuntansi";
import { 
  generateNeraca, 
  generateLabaRugi 
} from "@/services/akuntansi/laporanService";

export default function LaporanKeuanganContent() {
  const { toast } = useToast();
  const [periode, setPeriode] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [neraca, setNeraca] = useState<Neraca | null>(null);
  const [labaRugi, setLabaRugi] = useState<LabaRugi | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load financial reports
  const loadReports = () => {
    setIsLoading(true);
    try {
      const neracaData = generateNeraca(periode);
      const labaRugiData = generateLabaRugi(periode);
      
      setNeraca(neracaData);
      setLabaRugi(labaRugiData);
      
      toast({
        title: "Laporan berhasil dimuat",
        description: `Data laporan keuangan periode ${periode} telah diperbarui`,
      });
    } catch (error) {
      console.error("Error loading reports:", error);
      toast({
        title: "Gagal memuat laporan",
        description: "Terjadi kesalahan saat memuat laporan keuangan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    loadReports();
  }, [periode]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <FileBarChart className="h-5 w-5" />
            Laporan Keuangan
          </h3>
          <p className="text-muted-foreground">
            Laporan neraca dan laba rugi koperasi
          </p>
        </div>
        
        <div className="flex gap-2">
          <input
            type="month"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          />
          
          <Button variant="outline" size="sm" onClick={loadReports} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {neraca && labaRugi && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Aset</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatCurrency(neraca.totalAset)}
                  </p>
                </div>
                <Building className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Kewajiban</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(neraca.totalKewajiban)}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Modal</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(neraca.totalModal)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Laba Bersih</p>
                  <p className={`text-xl font-bold ${labaRugi.labaBersih >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(labaRugi.labaBersih)}
                  </p>
                </div>
                <TrendingUp className={`h-8 w-8 ${labaRugi.labaBersih >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reports Tabs */}
      <Tabs defaultValue="neraca" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="neraca" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Neraca
          </TabsTrigger>
          <TabsTrigger value="laba-rugi" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Laba Rugi
          </TabsTrigger>
        </TabsList>

        {/* Neraca Tab */}
        <TabsContent value="neraca">
          {neraca ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Neraca per {new Date(periode + '-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                  </div>
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    {periode}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Aset */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      ASET
                    </h4>
                    <Table>
                      <TableBody>
                        {neraca.aset.map((item) => (
                          <TableRow key={item.coaId}>
                            <TableCell className={item.isGroup ? "font-semibold" : ""}>
                              {item.namaAkun}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.jumlah)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-t-2 border-gray-300 bg-muted/50">
                          <TableCell className="font-bold">TOTAL ASET</TableCell>
                          <TableCell className="text-right font-bold text-lg">
                            {formatCurrency(neraca.totalAset)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Kewajiban & Modal */}
                  <div>
                    <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <TrendingDown className="h-4 w-4" />
                      KEWAJIBAN & MODAL
                    </h4>
                    <Table>
                      <TableBody>
                        {/* Kewajiban */}
                        <TableRow className="bg-muted/30">
                          <TableCell className="font-semibold">KEWAJIBAN</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        {neraca.kewajiban.map((item) => (
                          <TableRow key={item.coaId}>
                            <TableCell className={item.isGroup ? "font-semibold" : "pl-4"}>
                              {item.namaAkun}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.jumlah)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-b">
                          <TableCell className="font-semibold">Total Kewajiban</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(neraca.totalKewajiban)}
                          </TableCell>
                        </TableRow>

                        {/* Modal */}
                        <TableRow className="bg-muted/30">
                          <TableCell className="font-semibold">MODAL</TableCell>
                          <TableCell></TableCell>
                        </TableRow>
                        {neraca.modal.map((item) => (
                          <TableRow key={item.coaId}>
                            <TableCell className={item.isGroup ? "font-semibold" : "pl-4"}>
                              {item.namaAkun}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(item.jumlah)}
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow className="border-b">
                          <TableCell className="font-semibold">Total Modal</TableCell>
                          <TableCell className="text-right font-semibold">
                            {formatCurrency(neraca.totalModal)}
                          </TableCell>
                        </TableRow>

                        <TableRow className="border-t-2 border-gray-300 bg-muted/50">
                          <TableCell className="font-bold">TOTAL KEWAJIBAN & MODAL</TableCell>
                          <TableCell className="text-right font-bold text-lg">
                            {formatCurrency(neraca.totalKewajiban + neraca.totalModal)}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Memuat Neraca...</h3>
                  <p className="text-muted-foreground">
                    Sedang memproses data neraca keuangan
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Laba Rugi Tab */}
        <TabsContent value="laba-rugi">
          {labaRugi ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Laporan Laba Rugi untuk {new Date(periode + '-01').toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })}
                  </div>
                  <Badge variant="outline">
                    <Calendar className="h-3 w-3 mr-1" />
                    {periode}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {/* Pendapatan */}
                    <TableRow className="bg-green-50">
                      <TableCell className="font-bold text-green-800">PENDAPATAN</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    {labaRugi.pendapatan.map((item) => (
                      <TableRow key={item.coaId}>
                        <TableCell className={item.isGroup ? "font-semibold" : "pl-4"}>
                          {item.namaAkun}
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {formatCurrency(item.jumlah)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-b-2 border-green-200">
                      <TableCell className="font-bold">TOTAL PENDAPATAN</TableCell>
                      <TableCell className="text-right font-bold text-green-600 text-lg">
                        {formatCurrency(labaRugi.totalPendapatan)}
                      </TableCell>
                    </TableRow>

                    {/* Spacer */}
                    <TableRow>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>

                    {/* Beban */}
                    <TableRow className="bg-red-50">
                      <TableCell className="font-bold text-red-800">BEBAN</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    {labaRugi.beban.map((item) => (
                      <TableRow key={item.coaId}>
                        <TableCell className={item.isGroup ? "font-semibold" : "pl-4"}>
                          {item.namaAkun}
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          {formatCurrency(item.jumlah)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="border-b-2 border-red-200">
                      <TableCell className="font-bold">TOTAL BEBAN</TableCell>
                      <TableCell className="text-right font-bold text-red-600 text-lg">
                        {formatCurrency(labaRugi.totalBeban)}
                      </TableCell>
                    </TableRow>

                    {/* Spacer */}
                    <TableRow>
                      <TableCell colSpan={2}></TableCell>
                    </TableRow>

                    {/* Laba/Rugi */}
                    <TableRow className="border-t-4 border-gray-400 bg-muted/50">
                      <TableCell className="font-bold text-lg">LABA/RUGI BERSIH</TableCell>
                      <TableCell className={`text-right font-bold text-xl ${labaRugi.labaBersih >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(labaRugi.labaBersih)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-16">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Memuat Laba Rugi...</h3>
                  <p className="text-muted-foreground">
                    Sedang memproses data laporan laba rugi
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
