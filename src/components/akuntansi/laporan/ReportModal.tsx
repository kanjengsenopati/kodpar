
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Printer, X } from "lucide-react";
import { PeriodFilter } from "./PeriodFilter";
import { NeracaReport } from "./NeracaReport";
import { LabaRugiReport } from "./LabaRugiReport";
import { ArusKasReport } from "./ArusKasReport";
import { PerubahanModalReport } from "./PerubahanModalReport";
import {
  generateNeraca,
  generateLabaRugi,
  generateArusKas,
  generatePerubahanModal
} from "@/services/akuntansi/laporanService";
import { toast } from "sonner";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: string;
}

export function ReportModal({ isOpen, onClose, defaultTab = "neraca" }: ReportModalProps) {
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
    if (isOpen) {
      loadReports();
    }
  }, [selectedPeriod, isOpen]);

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <DialogTitle className="text-2xl font-bold">
            Laporan Keuangan - {getPeriodLabel(selectedPeriod)}
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">
                  Rp {neracaData.totalAset.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">Total Aset</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">
                  Rp {neracaData.totalKewajiban.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">Total Kewajiban</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">
                  Rp {neracaData.totalModal.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">Total Modal</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className={`text-2xl font-bold ${labaRugiData.labaBersih >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  Rp {labaRugiData.labaBersih.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">Laba Bersih</p>
              </div>
            </div>
          )}

          {/* Reports Tabs */}
          <Tabs defaultValue={defaultTab} className="w-full">
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
