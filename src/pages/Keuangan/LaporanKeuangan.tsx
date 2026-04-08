
import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import html2canvas from 'html2canvas';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { PemasukanPengeluaran, KategoriTransaksi } from '@/types';
import {
  getAllPemasukanPengeluaran,
  getPemasukanPengeluaranByJenis,
  getPemasukanPengeluaranByPeriod,
  getAllKategoriTransaksi,
  generateNeracaKeuangan
} from '@/services/keuanganService';

import LaporanHeader from '@/components/keuangan/laporan/LaporanHeader';
import LaporanFilters from '@/components/keuangan/laporan/LaporanFilters';
import TransaksiChart from '@/components/keuangan/laporan/TransaksiChart';
import KategoriPieChart from '@/components/keuangan/laporan/KategoriPieChart';
import TransaksiTable from '@/components/keuangan/TransaksiTable';
import NeracaTable from '@/components/keuangan/laporan/NeracaTable';
import { useNavigate } from 'react-router-dom';

export default function LaporanKeuangan() {
  const navigate = useNavigate();
  const reportRef = useRef<HTMLDivElement>(null);
  
  // State for filters
  const [startDate, setStartDate] = useState<Date>(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [activePeriod, setActivePeriod] = useState<string>('current-month');
  
  // State for report data
  const [transactions, setTransactions] = useState<PemasukanPengeluaran[]>([]);
  const [pemasukanData, setPemasukanData] = useState<PemasukanPengeluaran[]>([]);
  const [pengeluaranData, setPengeluaranData] = useState<PemasukanPengeluaran[]>([]);
  const [totalPemasukan, setTotalPemasukan] = useState<number>(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [pemasukanByCategory, setPemasukanByCategory] = useState<any[]>([]);
  const [pengeluaranByCategory, setPengeluaranByCategory] = useState<any[]>([]);
  
  // Neraca data
  const [neracaData, setNeracaData] = useState<any>({
    assets: [],
    liabilities: [],
    totalAssets: 0,
    totalLiabilities: 0,
    saldoAwal: 0,
    saldoAkhir: 0
  });
  
  // Active tab state
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  // Load data on component mount
  useEffect(() => {
    loadReportData();
  }, []);
  
  // Load report data based on date range
  const loadReportData = () => {
    try {
      // Format dates for filtering
      const start = format(startDate, 'yyyy-MM-dd');
      const end = format(endDate, 'yyyy-MM-dd');
      
      // Get filtered transactions
      const filteredTransactions = getPemasukanPengeluaranByPeriod(start, end);
      
      // Sort by date
      filteredTransactions.sort((a, b) => 
        new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
      );
      
      setTransactions(filteredTransactions);
      
      // Process data for pemasukan and pengeluaran
      const pemasukan = filteredTransactions.filter(t => t.jenis === 'Pemasukan');
      const pengeluaran = filteredTransactions.filter(t => t.jenis === 'Pengeluaran');
      
      setPemasukanData(pemasukan);
      setPengeluaranData(pengeluaran);
      
      // Calculate totals
      const totalPemasukan = pemasukan.reduce((sum, item) => sum + item.jumlah, 0);
      const totalPengeluaran = pengeluaran.reduce((sum, item) => sum + item.jumlah, 0);
      
      setTotalPemasukan(totalPemasukan);
      setTotalPengeluaran(totalPengeluaran);
      
      // Create data for charts
      const monthsMap = new Map();
      const startMonth = startDate.getMonth();
      const startYear = startDate.getFullYear();
      const endMonth = endDate.getMonth();
      const endYear = endDate.getFullYear();
      
      // Initialize month data
      let currentMonth = startMonth;
      let currentYear = startYear;
      
      while (
        currentYear < endYear || 
        (currentYear === endYear && currentMonth <= endMonth)
      ) {
        const monthKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        const monthName = format(new Date(currentYear, currentMonth, 1), 'MMM yyyy');
        
        monthsMap.set(monthKey, { 
          name: monthName, 
          pemasukan: 0, 
          pengeluaran: 0 
        });
        
        currentMonth++;
        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }
      }
      
      // Fill with data
      filteredTransactions.forEach(transaction => {
        const transactionDate = new Date(transaction.tanggal);
        const monthKey = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (monthsMap.has(monthKey)) {
          const monthData = monthsMap.get(monthKey);
          if (transaction.jenis === 'Pemasukan') {
            monthData.pemasukan += transaction.jumlah;
          } else {
            monthData.pengeluaran += transaction.jumlah;
          }
        }
      });
      
      // Convert map to array for chart
      setChartData(Array.from(monthsMap.values()));
      
      // Process by category
      const pemasukanCategoryMap = new Map();
      const pengeluaranCategoryMap = new Map();
      
      pemasukan.forEach(transaction => {
        const category = transaction.kategori;
        const currentSum = pemasukanCategoryMap.get(category) || 0;
        pemasukanCategoryMap.set(category, currentSum + transaction.jumlah);
      });
      
      pengeluaran.forEach(transaction => {
        const category = transaction.kategori;
        const currentSum = pengeluaranCategoryMap.get(category) || 0;
        pengeluaranCategoryMap.set(category, currentSum + transaction.jumlah);
      });
      
      // Convert to arrays for pie charts
      const pemasukanCategoryArray = Array.from(pemasukanCategoryMap).map(([name, value]) => ({
        name,
        value
      }));
      
      const pengeluaranCategoryArray = Array.from(pengeluaranCategoryMap).map(([name, value]) => ({
        name,
        value
      }));
      
      setPemasukanByCategory(pemasukanCategoryArray);
      setPengeluaranByCategory(pengeluaranCategoryArray);
      
      // Process neraca data
      const monthStart = new Date(startDate).getMonth() + 1;
      const yearStart = new Date(startDate).getFullYear();
      
      const neraca = generateNeracaKeuangan(monthStart, yearStart);
      
      setNeracaData({
        assets: [
          { label: 'Kas', amount: neraca.saldoAwal + totalPemasukan, indented: true },
          { label: 'Total Aktiva', amount: neraca.saldoAwal + totalPemasukan, isTotal: true }
        ],
        liabilities: [
          { label: 'Pengeluaran', amount: totalPengeluaran, indented: true },
          { label: 'Total Pasiva', amount: totalPengeluaran, isTotal: true }
        ],
        totalAssets: neraca.saldoAwal + totalPemasukan,
        totalLiabilities: totalPengeluaran,
        saldoAwal: neraca.saldoAwal,
        saldoAkhir: neraca.saldoAkhir
      });
      
    } catch (error) {
      console.error('Error loading report data:', error);
      toast.error('Gagal memuat data laporan');
    }
  };
  
  // Handle export to image
  const handleExport = async () => {
    if (!reportRef.current) return;
    
    try {
      const canvas = await html2canvas(reportRef.current);
      const dataUrl = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `laporan-keuangan-${format(startDate, 'yyyyMMdd')}-${format(endDate, 'yyyyMMdd')}.png`;
      link.click();
      
      toast.success('Laporan berhasil diexport');
    } catch (error) {
      console.error('Error exporting report:', error);
      toast.error('Gagal mengexport laporan');
    }
  };
  
  // Handle print
  const handlePrint = () => {
    window.print();
  };
  
  return (
    <Layout pageTitle="Laporan Keuangan">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/keuangan/transaksi')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h1>
          </div>
        </div>
        
        {/* Filters */}
        <LaporanFilters
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onFilterApply={loadReportData}
          onPeriodChange={setActivePeriod}
          onExport={handleExport}
          onPrint={handlePrint}
        />
        
        {/* Report Content */}
        <div ref={reportRef} className="space-y-6">
          {/* Header Stats */}
          <LaporanHeader
            totalPemasukan={totalPemasukan}
            totalPengeluaran={totalPengeluaran}
            saldo={totalPemasukan - totalPengeluaran}
            periode={`${format(startDate, 'dd MMM yyyy', { locale: id })} - ${format(endDate, 'dd MMM yyyy', { locale: id })}`}
          />
          
          {/* Tabs */}
          <Card>
            <CardContent className="pt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Ringkasan</TabsTrigger>
                  <TabsTrigger value="pemasukan">Pemasukan</TabsTrigger>
                  <TabsTrigger value="pengeluaran">Pengeluaran</TabsTrigger>
                  <TabsTrigger value="neraca">Neraca</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-6">
                  {/* Time series chart */}
                  <TransaksiChart 
                    data={chartData} 
                    title="Pemasukan & Pengeluaran per Bulan" 
                    chartType="line"
                    height={350}
                  />
                  
                  {/* Categories breakdown */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <KategoriPieChart 
                      data={pemasukanByCategory} 
                      title="Pemasukan per Kategori"
                      colors={['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe']}
                    />
                    <KategoriPieChart 
                      data={pengeluaranByCategory} 
                      title="Pengeluaran per Kategori"
                      colors={['#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2']}
                    />
                  </div>
                </TabsContent>
                
                {/* Pemasukan Tab */}
                <TabsContent value="pemasukan" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <TransaksiTable data={pemasukanData} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Pengeluaran Tab */}
                <TabsContent value="pengeluaran" className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <TransaksiTable data={pengeluaranData} />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Neraca Tab */}
                <TabsContent value="neraca" className="space-y-6">
                  <NeracaTable 
                    title="Neraca Keuangan"
                    items={neracaData}
                    totalAssets={neracaData.totalAssets}
                    totalLiabilities={neracaData.totalLiabilities}
                    saldoAwal={neracaData.saldoAwal}
                    saldoAkhir={neracaData.saldoAkhir}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
