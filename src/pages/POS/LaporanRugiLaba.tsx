import React, { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tab } from "@headlessui/react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { BarChart as BarChartIcon, LineChart as LineChartIcon, Calendar, Download } from "lucide-react";
import { getAllPenjualan } from "@/services/penjualan";
import { getAllProdukItems } from "@/services/produk";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { DateRange } from "react-day-picker";
import { format, subDays, startOfMonth, endOfMonth, isSameDay, isSameMonth, parseISO } from "date-fns";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProfitData {
  date: string;
  revenue: number;
  cost: number;
  profit: number;
}

interface ProductProfitData {
  id: string;
  name: string;
  revenue: number;
  cost: number;
  profit: number;
  margin: number;
}

interface SummaryData {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  averageDailyProfit: number;
}

export default function LaporanRugiLaba() {
  const [penjualanList, setPenjualanList] = useState([]);
  const [products, setProducts] = useState([]);
  const [profitData, setProfitData] = useState([]);
  const [productProfitData, setProductProfitData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalRevenue: 0,
    totalCost: 0,
    totalProfit: 0,
    profitMargin: 0,
    averageDailyProfit: 0
  });
  const [filterPeriod, setFilterPeriod] = useState<"7days" | "30days" | "month" | "custom">("30days");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [groupBy, setGroupBy] = useState<"daily" | "monthly">("daily");

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Process data when date range changes
  useEffect(() => {
    processData();
  }, [penjualanList, products, dateRange, groupBy]);

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

  const handleGroupByChange = (value: string) => {
    setGroupBy(value as "daily" | "monthly");
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
    
    // Process profit data by date
    const dataMap: Record<string, ProfitData> = {};
    const productsMap: Record<string, ProductProfitData> = {};
    
    // Initialize summary data
    let totalRevenue = 0;
    let totalCost = 0;
    
    filteredPenjualan.forEach(penjualan => {
      const date = new Date(penjualan.tanggal);
      const dateKey = groupBy === "daily" 
        ? format(date, "yyyy-MM-dd")
        : format(date, "yyyy-MM");
      
      if (!dataMap[dateKey]) {
        dataMap[dateKey] = {
          date: dateKey,
          revenue: 0,
          cost: 0,
          profit: 0
        };
      }
      
      penjualan.items.forEach(item => {
        const product = products.find(p => p.id === item.produkId);
        if (product) {
          const itemRevenue = item.total;
          const itemCost = product.hargaBeli * item.jumlah;
          
          // Add to date data
          dataMap[dateKey].revenue += itemRevenue;
          dataMap[dateKey].cost += itemCost;
          
          // Add to product data
          if (!productsMap[product.id]) {
            productsMap[product.id] = {
              id: product.id,
              name: product.nama,
              revenue: 0,
              cost: 0,
              profit: 0,
              margin: 0
            };
          }
          
          productsMap[product.id].revenue += itemRevenue;
          productsMap[product.id].cost += itemCost;
          
          // Add to totals
          totalRevenue += itemRevenue;
          totalCost += itemCost;
        }
      });
    });
    
    // Calculate profits
    Object.values(dataMap).forEach(data => {
      data.profit = data.revenue - data.cost;
    });
    
    Object.values(productsMap).forEach(product => {
      product.profit = product.revenue - product.cost;
      product.margin = product.revenue > 0 
        ? (product.profit / product.revenue) * 100 
        : 0;
    });
    
    // Sort data by date
    const sortedData = Object.values(dataMap).sort((a, b) => a.date.localeCompare(b.date));
    setProfitData(sortedData);
    
    // Sort product data by profit
    const sortedProductData = Object.values(productsMap).sort((a, b) => b.profit - a.profit);
    setProductProfitData(sortedProductData);
    
    // Calculate summary
    const totalProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
    
    // Calculate average daily profit
    const uniqueDates = new Set();
    filteredPenjualan.forEach(penjualan => {
      const date = format(new Date(penjualan.tanggal), "yyyy-MM-dd");
      uniqueDates.add(date);
    });
    const days = uniqueDates.size || 1; // Avoid division by zero
    const averageDailyProfit = totalProfit / days;
    
    setSummaryData({
      totalRevenue,
      totalCost,
      totalProfit,
      profitMargin,
      averageDailyProfit
    });
  };
  
  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (groupBy === "monthly") {
      const [year, month] = dateString.split('-');
      return `${month}/${year}`;
    } else {
      const [year, month, day] = dateString.split('-');
      return `${day}/${month}`;
    }
  };
  
  // Export data as CSV
  const handleExport = () => {
    // Generate profit CSV
    let csv = 'Tanggal,Pendapatan,Modal,Laba\n';
    
    profitData.forEach(data => {
      csv += `${data.date},${data.revenue},${data.cost},${data.profit}\n`;
    });
    
    csv += '\n\nProduk,Pendapatan,Modal,Laba,Margin\n';
    
    productProfitData.forEach(product => {
      csv += `"${product.name}",${product.revenue},${product.cost},${product.profit},${product.margin.toFixed(2)}%\n`;
    });
    
    // Create a download link
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `laporan-rugi-laba-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Layout pageTitle="Laporan Rugi Laba">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Laporan Rugi Laba</h2>
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
                <DateRangePicker value={dateRange} onValueChange={handleDateRangeChange} />
              </div>
              
              <Select onValueChange={handleGroupByChange} defaultValue={groupBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Kelompokkan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRupiah(summaryData.totalRevenue)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Modal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRupiah(summaryData.totalCost)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Laba</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatRupiah(summaryData.totalProfit)}</div>
              <p className="text-xs text-muted-foreground">
                Margin: {summaryData.profitMargin.toFixed(2)}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Rata-rata Laba</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatRupiah(summaryData.averageDailyProfit)}
              </div>
              <p className="text-xs text-muted-foreground">
                per hari
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Profit Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LineChartIcon className="h-5 w-5 text-primary" />
              <CardTitle>Grafik Rugi Laba {groupBy === "monthly" ? "Bulanan" : "Harian"}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {profitData.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Tidak ada data untuk periode ini</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={profitData}
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
                    labelFormatter={(label: string) => {
                      if (groupBy === "monthly") {
                        const [year, month] = label.split('-');
                        return `${month}/${year}`;
                      } else {
                        return format(new Date(label), 'dd MMM yyyy');
                      }
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" name="Pendapatan" stroke="#8884d8" />
                  <Line type="monotone" dataKey="cost" name="Modal" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="profit" name="Laba" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        {/* Product Profit Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-primary" />
              <CardTitle>Laba Per Produk (Top 10)</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {productProfitData.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Tidak ada data untuk periode ini</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={productProfitData.slice(0, 10)}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatRupiah(value)}
                  />
                  <Legend />
                  <Bar dataKey="profit" name="Laba" fill="#ff7300" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        {/* Product Profit Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChartIcon className="h-5 w-5 text-primary" />
              <CardTitle>Detail Laba Per Produk</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {productProfitData.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">Tidak ada data untuk periode ini</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead className="text-right">Pendapatan</TableHead>
                    <TableHead className="text-right">Modal</TableHead>
                    <TableHead className="text-right">Laba</TableHead>
                    <TableHead className="text-right">Margin</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productProfitData.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="text-right">{formatRupiah(product.revenue)}</TableCell>
                      <TableCell className="text-right">{formatRupiah(product.cost)}</TableCell>
                      <TableCell className="text-right">{formatRupiah(product.profit)}</TableCell>
                      <TableCell className="text-right">{product.margin.toFixed(2)}%</TableCell>
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
