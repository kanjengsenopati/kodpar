
import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileBarChart, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { PeriodFilter } from "@/components/akuntansi/laporan/PeriodFilter";
import { NeracaReport } from "@/components/akuntansi/laporan/NeracaReport";
import { LabaRugiReport } from "@/components/akuntansi/laporan/LabaRugiReport";
import { ArusKasReport } from "@/components/akuntansi/laporan/ArusKasReport";
import { PerubahanModalReport } from "@/components/akuntansi/laporan/PerubahanModalReport";

import {
  generateNeraca,
  generateLabaRugi,
  generateArusKas,
  generatePerubahanModal
} from "@/services/akuntansi/laporanService";

export default function LaporanKeuangan() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  });

  const [neracaData, setNeracaData] = useState(null);
  const [labaRugiData, setLabaRugiData] = useState(null);
  const [arusKasData, setArusKasData] = useState(null);
  const [perubahanModalData, setPerubahanModalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadReports();
  }, [selectedPeriod]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      console.log("Loading reports for period:", selectedPeriod);
      
      const neraca = generateNeraca(selectedPeriod);
      const labaRugi = generateLabaRugi(selectedPeriod);
      const arusKas = generateArusKas(selectedPeriod);
      const perubahanModal = generatePerubahanModal(selectedPeriod);

      setNeracaData(neraca);
      setLabaRugiData(labaRugi);
      setArusKasData(arusKas);
      setPerubahanModalData(perubahanModal);
      
      console.log("Reports loaded successfully");
    } catch (error) {
      console.error("Error loading reports:", error);
      toast.error("Gagal memuat laporan keuangan");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    toast.info("Fitur export akan segera hadir");
  };

  const handlePrint = () => {
    window.print();
  };

  const getPeriodLabel = (period: string) => {
    const [year, month] = period.split('-');
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };

  return (
    <Layout pageTitle="Laporan Keuangan">
      <div className="container mx-auto py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/akuntansi')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h1>
              <p className="text-muted-foreground">Laporan keuangan komprehensif untuk periode {getPeriodLabel(selectedPeriod)}</p>
            </div>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Semua
          </Button>
        </div>

        {/* Period Filter */}
        <PeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
          onExport={handleExport}
          onPrint={handlePrint}
        />

        {/* Summary Cards */}
        {neracaData && labaRugiData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  Rp {neracaData.totalAset.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">Total Aset</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">
                  Rp {neracaData.totalKewajiban.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">Total Kewajiban</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  Rp {neracaData.totalModal.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">Total Modal</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className={`text-2xl font-bold ${labaRugiData.labaBersih >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Rp {labaRugiData.labaBersih.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">Laba Bersih</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Reports Tabs */}
        <Card>
          <CardContent className="pt-6">
            <Tabs defaultValue="neraca" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="neraca">Neraca</TabsTrigger>
                <TabsTrigger value="laba-rugi">Laba Rugi</TabsTrigger>
                <TabsTrigger value="arus-kas">Arus Kas</TabsTrigger>
                <TabsTrigger value="perubahan-modal">Perubahan Modal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="neraca" className="mt-6">
                {neracaData ? (
                  <NeracaReport data={neracaData} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Memuat laporan neraca...</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="laba-rugi" className="mt-6">
                {labaRugiData ? (
                  <LabaRugiReport data={labaRugiData} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Memuat laporan laba rugi...</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="arus-kas" className="mt-6">
                {arusKasData ? (
                  <ArusKasReport data={arusKasData} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Memuat laporan arus kas...</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="perubahan-modal" className="mt-6">
                {perubahanModalData ? (
                  <PerubahanModalReport data={perubahanModalData} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Memuat laporan perubahan modal...</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
