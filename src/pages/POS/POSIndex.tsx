import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Store, 
  Package, 
  Archive, 
  User, 
  History, 
  Receipt,
  BarChart, 
  LineChart,
  Truck,
  ShoppingCart
} from "lucide-react";
import { Text } from "@/components/ui/text";

export default function POSIndex() {
  const posNavigation = [
    {
      title: "Penjualan Kasir",
      icon: Store,
      description: "Transaksi penjualan produk",
      path: "/pos/penjualan",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Pemasok",
      icon: Truck,
      description: "Kelola data pemasok/supplier",
      path: "/pos/pemasok",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Pembelian",
      icon: ShoppingCart,
      description: "Transaksi pembelian produk",
      path: "/pos/pembelian",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Daftar Penjualan",
      icon: History,
      description: "Lihat semua transaksi penjualan",
      path: "/pos/penjualan-list",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Stok Barang",
      icon: Package,
      description: "Kelola stok dan produk",
      path: "/pos/stok",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Inventori",
      icon: Archive,
      description: "Kelola inventaris barang",
      path: "/pos/inventori",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Kasir",
      icon: User,
      description: "Kelola data kasir",
      path: "/pos/kasir",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Kuitansi",
      icon: Receipt,
      description: "Cetak kuitansi pembayaran",
      path: "/pos/kuitansi",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Laporan Jual Beli",
      icon: BarChart,
      description: "Laporan penjualan dan pembelian",
      path: "/pos/laporan-jual-beli",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Laporan Rugi Laba",
      icon: LineChart,
      description: "Laporan keuangan rugi laba",
      path: "/pos/laporan-rugi-laba",
      color: "bg-indigo-50 text-indigo-600",
    },
  ];

  return (
    <Layout pageTitle="Point of Sales">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        {posNavigation.map((item, index) => (
          <Link key={index} to={item.path}>
            <Card className="rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none hover:shadow-lg transition-all h-full overflow-hidden">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-4 shadow-sm`}>
                  <item.icon size={24} strokeWidth={2} />
                </div>
                <Text.H2 className="mb-1">{item.title}</Text.H2>
                <Text.Body className="text-slate-400">{item.description}</Text.Body>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Layout>
  );
}
