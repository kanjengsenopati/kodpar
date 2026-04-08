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
  gradient: string;
  items: QuickAccessItem[];
}

const quickAccessModules: QuickAccessModule[] = [
  {
    id: "master-data",
    title: "Master Data",
    description: "Kelola data utama sistem",
    icon: Database,
    color: "bg-blue-500",
    gradient: "from-blue-500 to-blue-600",
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
    color: "bg-blue-500",
    gradient: "from-blue-500 to-indigo-600",
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
    gradient: "from-purple-500 to-violet-600",
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
    gradient: "from-orange-500 to-amber-600",
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
    gradient: "from-slate-500 to-gray-600",
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
    gradient: "from-yellow-500 to-orange-500",
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

export function QuickAccessCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {quickAccessModules.map((module) => (
        <Dialog key={module.id}>
          <DialogTrigger asChild>
            <Card className="group cursor-pointer overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-white/90 backdrop-blur-sm">
              <div className={`h-2 bg-gradient-to-r ${module.gradient}`}></div>
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${module.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <module.icon className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                      {module.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-slate-600 leading-relaxed">
                      {module.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500 font-medium">
                    {module.items.length} sub-module tersedia
                  </p>
                  <div className="flex items-center text-slate-400 group-hover:text-slate-600 transition-colors">
                    <span className="text-xs font-medium mr-1">Klik untuk buka</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          
          <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <DialogHeader className="border-b border-slate-200 pb-6">
              <DialogTitle className="flex items-center gap-4 text-2xl font-bold text-slate-800">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${module.gradient} text-white shadow-lg`}>
                  <module.icon className="h-7 w-7" />
                </div>
                <div>
                  <div>{module.title}</div>
                  <p className="text-sm font-normal text-slate-600 mt-1">{module.description}</p>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <div className="overflow-y-auto max-h-[calc(85vh-140px)] py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-1">
                {module.items.map((item, index) => (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white/80 backdrop-blur-sm overflow-hidden">
                    <div className={`h-1 bg-gradient-to-r ${module.gradient}`}></div>
                    <CardHeader className="pb-3">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 group-hover:from-blue-50 group-hover:to-indigo-50 transition-all duration-300">
                          <item.icon className={`h-6 w-6 ${item.color} group-hover:scale-110 transition-transform duration-300`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base font-bold text-slate-800 leading-tight group-hover:text-slate-900 transition-colors">
                            {item.title}
                          </CardTitle>
                          <CardDescription className="text-sm mt-2 text-slate-600 leading-relaxed">
                            {item.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button asChild className={`w-full bg-gradient-to-r ${module.gradient} hover:shadow-lg transition-all duration-300 border-0`} size="sm">
                        <Link to={item.path} className="flex items-center justify-center gap-2">
                          <span>Buka Module</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
