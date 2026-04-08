
import { useState } from "react";
import { 
  Users, 
  Package, 
  CreditCard, 
  Store, 
  Calculator, 
  Settings, 
  Zap,
  Database,
  List,
  FileText,
  ShoppingCart,
  ShoppingBag,
  Archive,
  BarChart,
  Cog
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";

interface QuickAccessItem {
  title: string;
  description: string;
  icon: React.ElementType;
  path: string;
  color: string;
}

interface QuickAccessModule {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  items: QuickAccessItem[];
}

const quickAccessModules: QuickAccessModule[] = [
  {
    id: "master-data",
    title: "Master Data",
    description: "Kelola data utama sistem",
    icon: Database,
    color: "bg-blue-500",
    items: [
      {
        title: "Data Anggota",
        description: "Kelola informasi anggota koperasi",
        icon: Users,
        path: "/master/anggota",
        color: "text-blue-600"
      },
      {
        title: "Kategori Barang",
        description: "Atur kategori produk",
        icon: List,
        path: "/pos/kategori",
        color: "text-green-600"
      },
      {
        title: "Data Barang",
        description: "Kelola inventori produk",
        icon: Package,
        path: "/pos/produk",
        color: "text-purple-600"
      },
      {
        title: "Data Pengguna",
        description: "Manajemen user sistem",
        icon: Users,
        path: "/pengaturan",
        color: "text-orange-600"
      }
    ]
  },
  {
    id: "simpan-pinjam",
    title: "Simpan Pinjam",
    description: "Layanan keuangan koperasi",
    icon: CreditCard,
    color: "bg-green-500",
    items: [
      {
        title: "Jenis Transaksi",
        description: "Kelola jenis simpan pinjam",
        icon: List,
        path: "/transaksi/jenis",
        color: "text-blue-600"
      },
      {
        title: "Simpanan",
        description: "Transaksi simpanan anggota",
        icon: FileText,
        path: "/transaksi/simpan",
        color: "text-green-600"
      },
      {
        title: "Pengajuan",
        description: "Proses pengajuan pinjaman",
        icon: FileText,
        path: "/transaksi/pengajuan",
        color: "text-yellow-600"
      },
      {
        title: "Pinjaman",
        description: "Kelola pinjaman anggota",
        icon: FileText,
        path: "/transaksi/pinjam",
        color: "text-red-600"
      },
      {
        title: "Angsuran",
        description: "Pembayaran cicilan",
        icon: FileText,
        path: "/transaksi/angsuran",
        color: "text-purple-600"
      },
      {
        title: "Penarikan",
        description: "Proses penarikan dana",
        icon: FileText,
        path: "/transaksi/penarikan",
        color: "text-indigo-600"
      },
      {
        title: "Laporan",
        description: "Laporan simpan pinjam",
        icon: BarChart,
        path: "/laporan",
        color: "text-gray-600"
      }
    ]
  },
  {
    id: "kpri-mart",
    title: "KPRI Mart",
    description: "Sistem point of sale",
    icon: Store,
    color: "bg-purple-500",
    items: [
      {
        title: "Penjualan Kasir",
        description: "Transaksi penjualan",
        icon: ShoppingCart,
        path: "/pos/penjualan",
        color: "text-green-600"
      },
      {
        title: "Pembelian",
        description: "Pembelian dari supplier",
        icon: ShoppingBag,
        path: "/pos/pembelian",
        color: "text-blue-600"
      },
      {
        title: "Stok Inventory",
        description: "Kelola stok barang",
        icon: Archive,
        path: "/pos/inventori",
        color: "text-purple-600"
      },
      {
        title: "Laporan",
        description: "Laporan penjualan & stok",
        icon: BarChart,
        path: "/pos/laporan/penjualan",
        color: "text-orange-600"
      }
    ]
  },
  {
    id: "akuntansi",
    title: "Akuntansi",
    description: "Sistem pembukuan",
    icon: Calculator,
    color: "bg-orange-500",
    items: [
      {
        title: "Manajemen Akuntansi",
        description: "Sistem pembukuan lengkap",
        icon: Calculator,
        path: "/akuntansi",
        color: "text-blue-600"
      }
    ]
  },
  {
    id: "pengaturan",
    title: "Pengaturan",
    description: "Konfigurasi sistem",
    icon: Settings,
    color: "bg-gray-500",
    items: [
      {
        title: "Koperasi",
        description: "Konfigurasi umum sistem",
        icon: Cog,
        path: "/pengaturan",
        color: "text-gray-600"
      }
    ]
  },
  {
    id: "algoritma",
    title: "Algoritma",
    description: "Pengaturan rumus SHU",
    icon: Zap,
    color: "bg-yellow-500",
    items: [
      {
        title: "Rumus SHU",
        description: "Konfigurasi algoritma perhitungan",
        icon: Zap,
        path: "/pengaturan/algoritma",
        color: "text-yellow-600"
      }
    ]
  }
];

export function QuickAccessModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 h-auto p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:from-blue-100 hover:to-indigo-100"
        >
          <Zap className="h-5 w-5 text-blue-600" />
          <div className="text-left">
            <div className="font-medium text-blue-900">Akses Cepat</div>
            <div className="text-xs text-blue-600">Quick access ke semua module</div>
          </div>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Zap className="h-6 w-6 text-primary" />
            Akses Cepat Module
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="master-data" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-6 mb-4">
            {quickAccessModules.map((module) => (
              <TabsTrigger 
                key={module.id} 
                value={module.id}
                className="flex items-center gap-2 text-xs"
              >
                <module.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{module.title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {quickAccessModules.map((module) => (
            <TabsContent 
              key={module.id} 
              value={module.id} 
              className="overflow-y-auto max-h-[calc(90vh-180px)] mt-0"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-1">
                {module.items.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <item.icon className={`h-6 w-6 ${item.color}`} />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base leading-tight">{item.title}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {item.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button asChild className="w-full" size="sm">
                        <Link to={item.path}>
                          Buka Module
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
