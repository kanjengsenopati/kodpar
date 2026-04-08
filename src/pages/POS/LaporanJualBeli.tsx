import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Penjualan, ProdukItem } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart as BarChartIcon, Calendar, Download } from "lucide-react";
import { getAllPenjualan, initSamplePenjualanData } from "@/services/penjualan";
import { getAllProdukItems, initSampleProdukData } from "@/services/produk";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";

interface ProductSalesData {
  id: string;
  name: string;
  qty: number;
  revenue: number;
}

interface DailySalesData {
  date: string;
  sales: number;
  items: number;
}

export default function LaporanJualBeli() {
  const [penjualanList, setPenjualanList] = useState<Penjualan[]>([]);
  const [products, setProducts] = useState<ProdukItem[]>([]);
  const [productSales, setProductSales] = useState<ProductSalesData[]>([]);
  const [dailySales, setDailySales] = useState<DailySalesData[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [filterPeriod, setFilterPeriod] = useState<"7days" | "30days" | "month" | "custom">("30days");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Load data on component mount
  useEffect(() => {
    // Initialize sample data
    initSampleProdukData();
    initSamplePenjualanData();
    
    loadData();
  }, []);
  
  // Process data when date range changes
  useEffect(() => {
    processData();
  }, [penjualanList, products, dateRange]);

  const loadData = () => {
    const allPenjualan = getAllPenjualan();
    const allProducts = getAllProdukItems();
    
    setPenjualanList(allPenjualan);
    setProducts(allProducts);
  };

  const handlePeriodChange = (value: string) => {
    const today = new Date();
    
    if (value === "7days") {
      setDateRange({
        from: subDays(today, 7),
        to: today
      });
      setFilterPeriod("7days");
    } else if (value === "30days") {
      setDateRange({
        from: subDays(today, 30),
        to: today
      });
      setFilterPeriod("30days");
    } else if (value === "month") {
      setDateRange({
        from: startOfMonth(today),
        to: endOfMonth(today)
      });
      setFilterPeriod("month");
    } else {
      setFilterPeriod("custom");
    }
  };

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange(range);
      setFilterPeriod("custom");
    }
  };

  const processData = () => {
    if (!dateRange?.from || !dateRange?.to) return;
    
    // Filter penjualan by date range
    const fromDate = dateRange.from.setHours(0, 0, 0, 0);
    const toDate = dateRange.to.setHours(23, 59, 59, 999);
    
    const filteredPenjualan = penjualanList.filter(item => {
      const itemDate = new Date(item.tanggal).getTime();
      return itemDate >= fromDate && itemDate <= toDate && item.status === "sukses";
    });
    
    // Process product sales data
    const productMap: Record<string, ProductSalesData> = {};
    
    filteredPenjualan.forEach(penjualan => {
      penjualan.items.forEach(item => {
        if (!productMap[item.produkId]) {
          const product = products.find(p => p.id === item.produkId);
          productMap[item.produkId] = {
            id: item.produkId,
            name: product?.nama || item.produkId,
            qty: 0,
            revenue: 0
          };
        }
        
        productMap[item.produkId].qty += item.jumlah;
        productMap[item.produkId].revenue += item.total;
      });
    });
    
    // Convert to array and sort by revenue
    const productSalesArray = Object.values(productMap).sort((a, b) => b.revenue - a.revenue);
    setProductSales(productSalesArray);
    
    // Process daily sales data
    const dailyMap: Record<string, DailySalesData> = {};
    
    filteredPenjualan.forEach(penjualan => {
      const date = format(new Date(penjualan.tanggal), "yyyy-MM-dd");
      
      if (!dailyMap[date]) {
        dailyMap[date] = {
          date,
          sales: 0,
          items: 0
        };
      }
      
      dailyMap[date].sales += penjualan.total;
      penjualan.items.forEach(item => {
        dailyMap[date].items += item.jumlah;
      });
    });
    
    // Convert to array and sort by date
    const dailySalesArray = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
    setDailySales(dailySalesArray);
    
    // Calculate totals
    const total = filteredPenjualan.reduce((sum, item) => sum + item.total, 0);
    setTotalSales(total);
    
    const items = filteredPenjualan.reduce((sum, item) => {
      return sum + item.items.reduce((itemSum, i) => itemSum + i.jumlah, 0);
    }, 0);
    setTotalItems(items);
    
    setTotalTransactions(filteredPenjualan.length);
  };
  
  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}`;
  };
  
  // Export data as CSV
  const handleExport = () => {
    // Generate product sales CSV
    let csv = 'Nama Produk,Kuantitas,Pendapatan\n';
    
    productSales.forEach(product => {
      csv += `"${product.name}",${product.qty},${product.revenue}\n`;
    });
    
    // Create a download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `laporan-penjualan-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Layout pageTitle="Laporan Jual Beli">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Laporan Jual Beli</h2>
          <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
        </div>
        
        {/* Filter Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Periode Laporan</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              <Select onValueChange={handlePeriodChange} value={filterPeriod}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Pilih periode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 Hari Terakhir</SelectItem>
                  <SelectItem value="30days">30 Hari Terakhir</SelectItem>
                  <SelectItem value="month">Bulan Ini</SelectItem>
                  <SelectItem value="custom">Kustom</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Dari:</span>
                <DateRangePicker value={dateRange} onValueChange={handleDateRangeChange} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Penjualan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRupiah(totalSales)}</div>
              <p className="text-xs text-muted-foreground">
                {totalTransactions} transaksi
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Item Terjual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalItems}</div>
              <p className="text-xs text-muted-foreground">
                {productSales.length} produk berbeda
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Penjualan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalTransactions > 0
                  ? formatRupiah(totalSales / totalTransactions)
                  : formatRupiah(0)}
              </div>
              <p className="text-xs text-muted-foreground">
                per transaksi
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Daily Sales Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-primary" />
              <CardTitle>Grafik Penjualan Harian</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {dailySales.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Tidak ada data untuk periode ini</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={dailySales}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={formatDateForDisplay}
                  />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatRupiah(value)}
                    labelFormatter={(label: string) => format(new Date(label), 'dd MMM yyyy')}
                  />
                  <Legend />
                  <Bar dataKey="sales" name="Penjualan" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        {/* Product Sales Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-primary" />
              <CardTitle>Penjualan Per Produk</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {productSales.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Tidak ada data untuk periode ini</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead className="text-right">Kuantitas</TableHead>
                    <TableHead className="text-right">Pendapatan</TableHead>
                    <TableHead className="text-right">Persentase</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productSales.slice(0, 10).map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{product.qty}</TableCell>
                      <TableCell className="text-right">{formatRupiah(product.revenue)}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline">
                          {totalSales > 0 ? ((product.revenue / totalSales) * 100).toFixed(1) : 0}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
