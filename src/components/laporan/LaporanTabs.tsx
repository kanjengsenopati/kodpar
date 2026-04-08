
import { useState } from "react";
import { AlertTriangle, Clock, CreditCard, FileCheck, Receipt, User, Wallet, ArrowUpFromLine, Download } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { AnggotaTabContent } from "./AnggotaTabContent";
import { PengajuanTabContent } from "./PengajuanTabContent";
import { SimpananTabContent } from "./SimpananTabContent";
import { PinjamanTabContent } from "./PinjamanTabContent";
import { AngsuranTabContent } from "./AngsuranTabContent";
import { JatuhTempoTabContent } from "./JatuhTempoTabContent";
import { TunggakanTabContent } from "./TunggakanTabContent";
import { PenarikanTabContent } from "./PenarikanTabContent";
import { ExportDialog } from "@/components/common/ExportDialog";
import { 
  getAnggotaFields, 
  getTransaksiFields, 
  getPengajuanFields 
} from "@/services/exportService";
import { Anggota, Pengajuan, Transaksi } from "@/types";

// Define proper chart data interfaces
interface ChartDataItem {
  name: string;
  [key: string]: number | string;
}

interface LaporanChartData {
  simpanan: Array<ChartDataItem & { simpanan: number }>;
  pinjaman: Array<ChartDataItem & { pinjaman: number }>;
  angsuran: Array<ChartDataItem & { angsuran: number }>;
  penarikan: Array<ChartDataItem & { penarikan: number }>;
  pengajuan: any[]; // This one is different as it's for PieChart
  anggota: Array<ChartDataItem & { anggota: number }>;
}

interface LaporanTabsProps {
  anggotaList: Anggota[];
  transaksiList: Transaksi[];
  pengajuanList: Pengajuan[];
  chartData: LaporanChartData;
  stats: {
    totalAnggota: number;
    totalSimpanan: number;
    totalPinjaman: number;
    totalAngsuran: number;
    totalPenarikan: number;
    totalPengajuan: number;
    totalTunggakan: number;
    totalJatuhTempo: number;
  };
  chartColors: {
    simpanan: string;
    pinjaman: string;
    angsuran: string;
    penarikan: string;
    tunggakan: string;
    pengajuan: string;
    anggota: string;
    jatuhTempo: string;
  };
  pieColors: string[];
  filterDateStart: Date;
  filterDateEnd: Date;
  overdueLoans: any[];
  upcomingDueLoans: any[];
}

export function LaporanTabs({
  anggotaList,
  transaksiList,
  pengajuanList,
  chartData,
  stats,
  chartColors,
  pieColors,
  filterDateStart,
  filterDateEnd,
  overdueLoans,
  upcomingDueLoans,
}: LaporanTabsProps) {
  const [exportDialog, setExportDialog] = useState<{
    isOpen: boolean;
    title: string;
    data: any[];
    fields: any[];
    filename: string;
  }>({
    isOpen: false,
    title: '',
    data: [],
    fields: [],
    filename: ''
  });

  const handleExport = (
    title: string, 
    data: any[], 
    fields: any[], 
    filename: string
  ) => {
    setExportDialog({
      isOpen: true,
      title,
      data,
      fields,
      filename
    });
  };

  const closeExportDialog = () => {
    setExportDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Filter data by date range
  const filteredTransaksiList = transaksiList.filter(t => {
    const transaksiDate = new Date(t.tanggal);
    return transaksiDate >= filterDateStart && transaksiDate <= filterDateEnd;
  });

  return (
    <div className="space-y-4">
      <Tabs defaultValue="anggota" className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-8">
            <TabsTrigger value="anggota">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Anggota</span>
            </TabsTrigger>
            <TabsTrigger value="pengajuan">
              <FileCheck className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Pengajuan</span>
            </TabsTrigger>
            <TabsTrigger value="simpanan">
              <Wallet className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Simpanan</span>
            </TabsTrigger>
            <TabsTrigger value="pinjaman">
              <CreditCard className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Pinjaman</span>
            </TabsTrigger>
            <TabsTrigger value="penarikan">
              <ArrowUpFromLine className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Penarikan</span>
            </TabsTrigger>
            <TabsTrigger value="angsuran">
              <Receipt className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Angsuran</span>
            </TabsTrigger>
            <TabsTrigger value="jatuhtempo">
              <Clock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Jatuh Tempo</span>
            </TabsTrigger>
            <TabsTrigger value="tunggakan">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Tunggakan</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Tab Anggota */}
        <TabsContent value="anggota">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Data Anggota</h3>
            <Button
              onClick={() => handleExport(
                'Laporan Data Anggota',
                anggotaList,
                getAnggotaFields(),
                `anggota-${new Date().toISOString().split('T')[0]}`
              )}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <AnggotaTabContent 
            anggotaList={anggotaList}
            chartData={chartData}
            totalAnggota={stats.totalAnggota}
            chartColors={chartColors}
          />
        </TabsContent>
        
        {/* Tab Pengajuan */}
        <TabsContent value="pengajuan">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Data Pengajuan</h3>
            <Button
              onClick={() => handleExport(
                'Laporan Data Pengajuan',
                pengajuanList,
                getPengajuanFields(),
                `pengajuan-${new Date().toISOString().split('T')[0]}`
              )}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <PengajuanTabContent
            pengajuanList={pengajuanList}
            chartData={chartData}
            pieColors={pieColors}
          />
        </TabsContent>
        
        {/* Tab Simpanan */}
        <TabsContent value="simpanan">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Data Simpanan</h3>
            <Button
              onClick={() => handleExport(
                'Laporan Data Simpanan',
                filteredTransaksiList.filter(t => t.jenis === 'Simpan'),
                getTransaksiFields(),
                `simpanan-${new Date().toISOString().split('T')[0]}`
              )}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <SimpananTabContent
            transaksiList={transaksiList}
            totalSimpanan={stats.totalSimpanan}
            chartData={chartData}
            chartColors={chartColors}
            filterDateStart={filterDateStart}
            filterDateEnd={filterDateEnd}
          />
        </TabsContent>
        
        {/* Tab Pinjaman */}
        <TabsContent value="pinjaman">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Data Pinjaman</h3>
            <Button
              onClick={() => handleExport(
                'Laporan Data Pinjaman',
                filteredTransaksiList.filter(t => t.jenis === 'Pinjam'),
                getTransaksiFields(),
                `pinjaman-${new Date().toISOString().split('T')[0]}`
              )}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <PinjamanTabContent
            transaksiList={transaksiList}
            totalPinjaman={stats.totalPinjaman}
            chartData={chartData}
            chartColors={chartColors}
            filterDateStart={filterDateStart}
            filterDateEnd={filterDateEnd}
          />
        </TabsContent>
        
        {/* Tab Penarikan */}
        <TabsContent value="penarikan">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Data Penarikan</h3>
            <Button
              onClick={() => handleExport(
                'Laporan Data Penarikan',
                filteredTransaksiList.filter(t => t.jenis === 'Penarikan'),
                getTransaksiFields(),
                `penarikan-${new Date().toISOString().split('T')[0]}`
              )}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <PenarikanTabContent
            transaksiList={transaksiList}
            totalPenarikan={stats.totalPenarikan}
            chartData={chartData}
            chartColors={chartColors}
            filterDateStart={filterDateStart}
            filterDateEnd={filterDateEnd}
          />
        </TabsContent>
        
        {/* Tab Angsuran */}
        <TabsContent value="angsuran">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Data Angsuran</h3>
            <Button
              onClick={() => handleExport(
                'Laporan Data Angsuran',
                filteredTransaksiList.filter(t => t.jenis === 'Angsuran'),
                getTransaksiFields(),
                `angsuran-${new Date().toISOString().split('T')[0]}`
              )}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <AngsuranTabContent
            transaksiList={transaksiList}
            totalAngsuran={stats.totalAngsuran}
            chartData={chartData}
            chartColors={chartColors}
            filterDateStart={filterDateStart}
            filterDateEnd={filterDateEnd}
          />
        </TabsContent>
        
        {/* Tab Jatuh Tempo */}
        <TabsContent value="jatuhtempo">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Data Jatuh Tempo</h3>
            <Button
              onClick={() => handleExport(
                'Laporan Jatuh Tempo',
                upcomingDueLoans,
                [
                  { key: 'transaksi.id', label: 'ID Transaksi', selected: true },
                  { key: 'transaksi.anggotaNama', label: 'Nama Anggota', selected: true },
                  { key: 'transaksi.jumlah', label: 'Jumlah Pinjaman', selected: true },
                  { key: 'jatuhTempo', label: 'Tanggal Jatuh Tempo', selected: true },
                  { key: 'daysUntilDue', label: 'Hari Tersisa', selected: true }
                ],
                `jatuh-tempo-${new Date().toISOString().split('T')[0]}`
              )}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <JatuhTempoTabContent
            upcomingDueLoans={upcomingDueLoans}
            chartColors={chartColors}
          />
        </TabsContent>
        
        {/* Tab Tunggakan */}
        <TabsContent value="tunggakan">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Data Tunggakan</h3>
            <Button
              onClick={() => handleExport(
                'Laporan Tunggakan',
                overdueLoans,
                [
                  { key: 'transaksi.id', label: 'ID Transaksi', selected: true },
                  { key: 'transaksi.anggotaNama', label: 'Nama Anggota', selected: true },
                  { key: 'transaksi.jumlah', label: 'Jumlah Pinjaman', selected: true },
                  { key: 'jatuhTempo', label: 'Tanggal Jatuh Tempo', selected: true },
                  { key: 'daysOverdue', label: 'Hari Terlambat', selected: true },
                  { key: 'penalty', label: 'Denda', selected: true }
                ],
                `tunggakan-${new Date().toISOString().split('T')[0]}`
              )}
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
          <TunggakanTabContent
            overdueLoans={overdueLoans}
            chartColors={chartColors}
          />
        </TabsContent>
      </Tabs>

      <ExportDialog
        isOpen={exportDialog.isOpen}
        onClose={closeExportDialog}
        title={exportDialog.title}
        data={exportDialog.data}
        fields={exportDialog.fields}
        filename={exportDialog.filename}
      />
    </div>
  );
}
