
import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Store, Package, Archive, User, History, Receipt,
  BarChart as BarChartIcon, LineChart as LineChartIcon, Truck, ShoppingCart,
  TrendingUp, TrendingDown, DollarSign, AlertTriangle
} from "lucide-react";
import { getAllPenjualan } from "@/services/penjualan";
import { getAllProdukItems } from "@/services/produk";
import { getAllPembelian } from "@/services/pembelianService";
import { getAllPemasok } from "@/services/pemasokService";
import { getAllKasir } from "@/services/kasirService";
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const CHART_COLORS = [
  "hsl(217, 91%, 60%)", "hsl(217, 91%, 45%)", "hsl(217, 91%, 75%)",
  "hsl(199, 89%, 48%)", "hsl(210, 40%, 50%)", "hsl(230, 60%, 55%)"
];

const posNavigation = [
  { title: "Penjualan Kasir", icon: Store, description: "Transaksi penjualan produk", path: "/pos/penjualan", color: "bg-blue-100 text-blue-800" },
  { title: "Pemasok", icon: Truck, description: "Kelola data pemasok/supplier", path: "/pos/pemasok", color: "bg-indigo-100 text-indigo-800" },
  { title: "Pembelian", icon: ShoppingCart, description: "Transaksi pembelian produk", path: "/pos/pembelian", color: "bg-blue-100 text-blue-800" },
  { title: "Daftar Penjualan", icon: History, description: "Lihat semua transaksi penjualan", path: "/pos/penjualan-list", color: "bg-indigo-100 text-indigo-800" },
  { title: "Stok Barang", icon: Package, description: "Kelola stok dan produk", path: "/pos/stok", color: "bg-blue-100 text-blue-800" },
  { title: "Inventori", icon: Archive, description: "Kelola inventaris barang", path: "/pos/inventori", color: "bg-indigo-100 text-indigo-800" },
  { title: "Kasir", icon: User, description: "Kelola data kasir", path: "/pos/kasir", color: "bg-blue-100 text-blue-800" },
  { title: "Kuitansi", icon: Receipt, description: "Cetak kuitansi pembayaran", path: "/pos/kuitansi", color: "bg-indigo-100 text-indigo-800" },
  { title: "Laporan Jual Beli", icon: BarChartIcon, description: "Laporan penjualan dan pembelian", path: "/pos/laporan-jual-beli", color: "bg-blue-100 text-blue-800" },
  { title: "Laporan Rugi Laba", icon: LineChartIcon, description: "Laporan keuangan rugi laba", path: "/pos/laporan-rugi-laba", color: "bg-indigo-100 text-indigo-800" },
];

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value);
};

export function RetailDashboard() {
  const data = useMemo(() => {
    const penjualan = getAllPenjualan();
    const pembelian = getAllPembelian();
    const produk = getAllProdukItems();
    const pemasok = getAllPemasok();
    const kasir = getAllKasir();

    const now = new Date();
    const thisMonth = { start: startOfMonth(now), end: endOfMonth(now) };
    const lastMonth = { start: startOfMonth(subMonths(now, 1)), end: endOfMonth(subMonths(now, 1)) };

    const inRange = (dateStr: string, range: { start: Date; end: Date }) => {
      try { return isWithinInterval(parseISO(dateStr), range); } catch { return false; }
    };

    const penjualanBulanIni = penjualan.filter(p => inRange(p.tanggal, thisMonth));
    const penjualanBulanLalu = penjualan.filter(p => inRange(p.tanggal, lastMonth));
    const pembelianBulanIni = pembelian.filter(p => inRange(p.tanggal, thisMonth));

    const totalPenjualanBulanIni = penjualanBulanIni.reduce((s, p) => s + p.total, 0);
    const totalPenjualanBulanLalu = penjualanBulanLalu.reduce((s, p) => s + p.total, 0);
    const totalPembelianBulanIni = pembelianBulanIni.reduce((s, p) => s + p.total, 0);

    const lowStockItems = produk.filter(p => p.stok <= 5);
    const totalStokValue = produk.reduce((s, p) => s + (p.hargaBeli * p.stok), 0);

    const penjualanGrowth = totalPenjualanBulanLalu > 0
      ? ((totalPenjualanBulanIni - totalPenjualanBulanLalu) / totalPenjualanBulanLalu * 100)
      : totalPenjualanBulanIni > 0 ? 100 : 0;

    // Monthly trend (last 6 months)
    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const month = subMonths(now, 5 - i);
      const range = { start: startOfMonth(month), end: endOfMonth(month) };
      const sales = penjualan.filter(p => inRange(p.tanggal, range)).reduce((s, p) => s + p.total, 0);
      const purchases = pembelian.filter(p => inRange(p.tanggal, range)).reduce((s, p) => s + p.total, 0);
      return {
        bulan: format(month, "MMM", { locale: idLocale }),
        penjualan: sales,
        pembelian: purchases,
        laba: sales - purchases,
      };
    });

    // Category distribution
    const categoryMap = new Map<string, number>();
    produk.forEach(p => categoryMap.set(p.kategori, (categoryMap.get(p.kategori) || 0) + 1));
    const categoryData = Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));

    // Payment method distribution
    const paymentMap = new Map<string, number>();
    penjualan.forEach(p => {
      const label = p.metodePembayaran.toUpperCase();
      paymentMap.set(label, (paymentMap.get(label) || 0) + 1);
    });
    const paymentData = Array.from(paymentMap.entries()).map(([name, value]) => ({ name, value }));

    return {
      totalPenjualanBulanIni, totalPembelianBulanIni, totalStokValue,
      penjualanGrowth, lowStockCount: lowStockItems.length,
      totalProduk: produk.length, totalPemasok: pemasok.length, totalKasir: kasir.length,
      trxCount: penjualanBulanIni.length,
      monthlyTrend, categoryData, paymentData,
    };
  }, []);

  const summaryCards = [
    {
      title: "Penjualan Bulan Ini",
      value: formatRupiah(data.totalPenjualanBulanIni),
      icon: TrendingUp,
      change: `${data.penjualanGrowth >= 0 ? '+' : ''}${data.penjualanGrowth.toFixed(1)}%`,
      positive: data.penjualanGrowth >= 0,
      sub: `${data.trxCount} transaksi`,
    },
    {
      title: "Pembelian Bulan Ini",
      value: formatRupiah(data.totalPembelianBulanIni),
      icon: ShoppingCart,
      change: `${data.totalPemasok} pemasok`,
      positive: true,
      sub: "Total pembelian",
    },
    {
      title: "Nilai Stok",
      value: formatRupiah(data.totalStokValue),
      icon: Package,
      change: `${data.totalProduk} produk`,
      positive: true,
      sub: "Total inventory",
    },
    {
      title: "Stok Rendah",
      value: `${data.lowStockCount} item`,
      icon: AlertTriangle,
      change: data.lowStockCount > 0 ? "Perlu restock" : "Stok aman",
      positive: data.lowStockCount === 0,
      sub: "Stok ≤ 5 unit",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Point of Sales & Retail</h2>
        <p className="text-sm text-muted-foreground">Kelola penjualan, stok, dan operasional retail Anda</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <Card key={i} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <card.icon className="h-5 w-5 text-primary" />
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${card.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {card.change}
                </span>
              </div>
              <p className="text-lg font-bold text-foreground">{card.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{card.title} · {card.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Trend */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Tren Penjualan & Pembelian (6 Bulan)</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => formatRupiah(v)} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="penjualan" name="Penjualan" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
                <Bar dataKey="pembelian" name="Pembelian" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Pie */}
        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Kategori Produk</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            {data.categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {data.categoryData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Belum ada data produk</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Profit Trend + Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Tren Laba Kotor (6 Bulan)</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => formatRupiah(v)} />
                <Line type="monotone" dataKey="laba" name="Laba Kotor" stroke={CHART_COLORS[0]} strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Metode Pembayaran</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            {data.paymentData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.paymentData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={75} label={({ name, value }) => `${name}: ${value}`}>
                    {data.paymentData.map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">Belum ada transaksi</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Navigation */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-3">Menu Retail</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {posNavigation.map((item, index) => (
            <Link key={index} to={item.path}>
              <Card className="hover:shadow-md transition-all h-full border-border hover:border-primary/40">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center`}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h4 className="text-xs font-semibold text-foreground">{item.title}</h4>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
