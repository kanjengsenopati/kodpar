import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  PiggyBank, 
  Users, 
  CreditCard, 
  DollarSign, 
  Store, 
  Factory, 
  Calculator, 
  FileText, 
  Settings, 
  User, 
  LogOut,
  ChevronDown,
  Package,
  List,
  History,
  TrendingUp,
  FileBarChart,
  Shield,
  Upload,
  Book,
  Receipt,
  BookOpen,
  Layout,
  ShoppingCart,
  Database,
  ArrowUpFromLine,
  Search
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/services/authService";
import { toast } from "sonner";
import NotificationBadge from "./NotificationBadge";
import * as Text from "@/components/ui/text";

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    toast.success("Berhasil keluar");
    navigate("/login");
  };

  const menuGroups = [
    {
      title: "Data Master",
      icon: List,
      items: [
        { title: "Unit Kerja", path: "/master/unit-kerja", icon: Package, description: "Manajemen unit kerja koperasi" },
        { title: "Data Anggota", path: "/master/anggota", icon: Users, description: "Manajemen data anggota aktif" },
        { title: "Impor Anggota", path: "/import/anggota", icon: Upload, description: "Unggah data anggota massal" },
      ]
    },
    {
      title: "Simpan",
      icon: PiggyBank,
      items: [
        { title: "Transaksi Simpan", path: "/transaksi/simpan", icon: FileText, description: "Input transaksi simpanan" },
        { title: "Penarikan", path: "/transaksi/penarikan", icon: ArrowUpFromLine, description: "Input transaksi penarikan dana" },
        { title: "Pengajuan", path: "/transaksi/pengajuan", icon: FileText, description: "Daftar pengajuan simpan/tarik" },
        { title: "Jenis Simpanan", path: "/transaksi/jenis", icon: List, description: "Konfigurasi jenis simpanan" },
      ]
    },
    {
      title: "Pinjam",
      icon: CreditCard,
      items: [
        { title: "Transaksi Pinjam", path: "/transaksi/pinjam", icon: FileText, description: "Input transaksi pinjaman baru" },
        { title: "Angsuran", path: "/transaksi/angsuran", icon: History, description: "Input pembayaran angsuran" },
        { title: "Pengajuan Pinjam", path: "/transaksi/pengajuan", icon: FileText, description: "Daftar pengajuan pinjaman" },
      ]
    },
    {
      title: "Unit Usaha",
      icon: Store,
      items: [
        { title: "Dashboard POS", path: "/pos", icon: Layout, description: "Ringkasan penjualan retail" },
        { title: "Penjualan", path: "/pos/penjualan", icon: ShoppingCart, description: "Transaksi kasir / POS" },
        { title: "Stok Barang", path: "/pos/stok", icon: Package, description: "Manajemen inventori retail" },
        { title: "Manufaktur", path: "/manufaktur", icon: Factory, description: "Produksi dan Work Orders" },
      ]
    },
    {
      title: "Pembukuan",
      icon: Calculator,
      items: [
        { title: "Jurnal Umum", path: "/akuntansi/jurnal-umum", icon: Receipt, description: "Input jurnal akuntansi" },
        { title: "Buku Besar", path: "/akuntansi/buku-besar", icon: BookOpen, description: "Laporan buku besar per akun" },
        { title: "Chart of Accounts", path: "/akuntansi/chart-of-accounts", icon: Book, description: "Daftar kode perkiraan" },
        { title: "Transaksi Kas", path: "/keuangan/transaksi", icon: TrendingUp, description: "Arus kas operasional" },
      ]
    },
    {
      title: "Laporan",
      icon: FileBarChart,
      items: [
        { title: "Lap. Keuangan", path: "/akuntansi/laporan-keuangan", icon: FileBarChart, description: "Neraca dan Rugi Laba" },
        { title: "Lap. Arus Kas", path: "/keuangan/laporan", icon: TrendingUp, description: "Analisis arus kas berkala" },
        { title: "Lap. Koperasi", path: "/laporan", icon: FileText, description: "Statistik simpan pinjam" },
        { title: "Audit Trail", path: "/pengaturan/audit-trail", icon: Shield, description: "Log aktivitas sistem" },
      ]
    },
    {
      title: "Pengaturan",
      icon: Settings,
      items: [
        { title: "Koperasi", path: "/pengaturan", icon: Settings, description: "Profil dan parameter koperasi" },
        { title: "Pengguna", path: "/pengaturan/pengguna-peran", icon: Users, description: "Hak akses dan otorisasi" },
        { title: "Rumus SHU", path: "/pengaturan/algoritma", icon: Calculator, description: "Algoritma pembagian hasil" },
        { title: "Reset Data", path: "/pengaturan/reset-data", icon: History, description: "Pembersihan database" },
      ]
    }
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2.5 mr-6">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
            <PiggyBank className="text-white h-5 w-5" />
          </div>
          <div className="hidden lg:block">
            <Text.H1 className="leading-none mb-0.5">Koperasi ERP</Text.H1>
            <Text.Label>Backoffice System</Text.Label>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="hidden md:flex flex-1 max-w-none justify-start px-2 gap-1">
          {menuGroups.map((group) => (
            <DropdownMenu key={group.title}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="px-2.5 h-9 bg-transparent hover:bg-slate-50 data-[state=open]:bg-slate-50 text-[13px] font-semibold text-slate-700 flex items-center gap-1.5 focus-visible:ring-0"
                >
                  <group.icon className="h-3.5 w-3.5 text-slate-400" />
                  <span>{group.title}</span>
                  <ChevronDown className="h-3 w-3 text-slate-400 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[260px] p-1 bg-white shadow-2xl border border-slate-200 rounded-xl mt-1">
                <div className="flex flex-col gap-0">
                  {group.items.map((item) => (
                    <div
                      key={item.title}
                      onClick={() => navigate(item.path)}
                      className="group block select-none space-y-0.5 rounded-lg px-2.5 py-1.5 leading-none no-underline outline-none transition-colors hover:bg-slate-50 cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2 text-[13px] font-semibold leading-tight text-slate-900">
                        <item.icon size={14} className="text-blue-600/70 opacity-70" />
                        {item.title}
                      </div>
                      <p className="line-clamp-1 text-[10px] leading-tight text-slate-400 mb-0.5">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        {/* Action Section */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex mr-2">
             <div className="relative">
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
                <input 
                  type="search" 
                  placeholder="Cari fitur..." 
                  className="pl-8 h-8 w-40 lg:w-48 rounded-full bg-slate-100 border-none text-[12px] focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-400"
                />
             </div>
          </div>
          
          <NotificationBadge />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden border border-slate-100 hover:border-blue-400 transition-all">
                <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52 mt-2 rounded-xl">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-0.5">
                  <Text.H2 className="text-xs leading-none">Super Admin</Text.H2>
                  <Text.Caption className="text-[10px] leading-none">admin@koperasi.com</Text.Caption>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')} className="text-xs font-medium">
                Dashboard Utama
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/pengaturan')} className="text-xs font-medium">
                Profil Koperasi
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-xs font-semibold text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
