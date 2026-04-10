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
  ChevronRight,
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
  Search,
  Layers,
  ClipboardList,
  Truck,
  BarChart3,
  Cpu,
  FlaskConical,
  Boxes,
  CassetteTape,
  ScanLine
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/services/authService";
import { toast } from "sonner";
import NotificationBadge from "./NotificationBadge";
import * as Text from "@/components/ui/text";

// ─── Retail & Manufaktur sub-menus ───────────────────────────────────────────

const retailItems = [
  { title: "Pos Kasir",        path: "/pos/kasir",          icon: ScanLine,      description: "Transaksi kasir real-time" },
  { title: "Produk",           path: "/pos/stok",           icon: Package,       description: "Daftar dan harga produk" },
  { title: "Purchasing",       path: "/pos/pembelian",      icon: Truck,         description: "Order pembelian dari pemasok" },
  { title: "Stock Inventory",  path: "/pos/inventori",      icon: Boxes,         description: "Kelola stok & gudang retail" },
  { title: "Riwayat",          path: "/pos/riwayat",        icon: History,       description: "Histori transaksi penjualan" },
  { title: "Laporan",          path: "/pos/laporan-jual-beli", icon: BarChart3,  description: "Laporan laba rugi retail" },
];

const manufakturItems = [
  { title: "BoM",                 path: "/manufaktur/bom",                icon: Layers,       description: "Bill of Materials" },
  { title: "Work Order",          path: "/manufaktur/work-orders",        icon: ClipboardList, description: "Perintah kerja produksi" },
  { title: "Stock Inventory",     path: "/manufaktur/inventory",          icon: Boxes,        description: "Stok bahan baku & WIP" },
  { title: "Purchasing",          path: "/pos/pembelian",                 icon: Truck,        description: "Pembelian bahan baku" },
  { title: "Production Planning", path: "/manufaktur/production-plans",   icon: Cpu,          description: "Jadwal & rencana produksi" },
  { title: "Report",              path: "/manufaktur",                    icon: BarChart3,    description: "Dashboard & laporan produksi" },
];

// ─── Generic menu groups (non-Unit Usaha) ─────────────────────────────────────

const menuGroups = [
  {
    title: "Data Master",
    icon: List,
    items: [
      { title: "Unit Kerja",    path: "/master/unit-kerja", icon: Package, description: "Manajemen unit kerja koperasi" },
      { title: "Data Anggota", path: "/master/anggota",    icon: Users,   description: "Manajemen data anggota aktif" },
      { title: "Impor Anggota",path: "/import/anggota",    icon: Upload,  description: "Unggah data anggota massal" },
    ]
  },
  {
    title: "Simpan",
    icon: PiggyBank,
    items: [
      { title: "Transaksi Simpan", path: "/transaksi/simpan",     icon: FileText,       description: "Input transaksi simpanan" },
      { title: "Penarikan",        path: "/transaksi/penarikan",  icon: ArrowUpFromLine,description: "Input transaksi penarikan dana" },
      { title: "Pengajuan",        path: "/transaksi/pengajuan",  icon: FileText,       description: "Daftar pengajuan simpan/tarik" },
      { title: "Jenis Simpanan",   path: "/transaksi/jenis",      icon: List,           description: "Konfigurasi jenis simpanan" },
    ]
  },
  {
    title: "Pinjam",
    icon: CreditCard,
    items: [
      { title: "Transaksi Pinjam",path: "/transaksi/pinjam",   icon: FileText, description: "Input transaksi pinjaman baru" },
      { title: "Angsuran",        path: "/transaksi/angsuran", icon: History,  description: "Input pembayaran angsuran" },
      { title: "Pengajuan Pinjam",path: "/transaksi/pengajuan",icon: FileText, description: "Daftar pengajuan pinjaman" },
    ]
  },
  {
    title: "Pembukuan",
    icon: Calculator,
    items: [
      { title: "Jurnal Umum",     path: "/akuntansi/jurnal-umum",         icon: Receipt,   description: "Input jurnal akuntansi" },
      { title: "Buku Besar",      path: "/akuntansi/buku-besar",          icon: BookOpen,  description: "Laporan buku besar per akun" },
      { title: "Chart of Accounts",path: "/akuntansi/chart-of-accounts",  icon: Book,      description: "Daftar kode perkiraan" },
      { title: "Transaksi Kas",   path: "/keuangan/transaksi",            icon: TrendingUp,description: "Arus kas operasional" },
    ]
  },
  {
    title: "Laporan",
    icon: FileBarChart,
    items: [
      { title: "Lap. Keuangan",path: "/akuntansi/laporan-keuangan", icon: FileBarChart, description: "Neraca dan Rugi Laba" },
      { title: "Lap. Arus Kas",path: "/keuangan/laporan",           icon: TrendingUp,   description: "Analisis arus kas berkala" },
      { title: "Lap. Koperasi",path: "/laporan",                    icon: FileText,     description: "Statistik simpan pinjam" },
      { title: "Audit Trail",  path: "/pengaturan/audit-trail",     icon: Shield,       description: "Log aktivitas sistem" },
    ]
  },
  {
    title: "Pengaturan",
    icon: Settings,
    items: [
      { title: "Koperasi",   path: "/pengaturan",                   icon: Settings,   description: "Profil dan parameter koperasi" },
      { title: "Pengguna",   path: "/pengaturan/pengguna-peran",    icon: Users,      description: "Hak akses dan otorisasi" },
      { title: "Rumus SHU",  path: "/pengaturan/algoritma",         icon: Calculator, description: "Algoritma pembagian hasil" },
      { title: "Reset Data", path: "/pengaturan/reset-data",        icon: History,    description: "Pembersihan database" },
    ]
  }
];

// ─── Shared menu item renderer ────────────────────────────────────────────────

function MenuItem({ item, onClick }: { item: { title: string; path: string; icon: any; description: string }; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="group flex items-start gap-2.5 select-none rounded-lg px-2.5 py-2 leading-none no-underline outline-none transition-colors hover:bg-slate-50 cursor-pointer"
    >
      <item.icon size={14} className="mt-0.5 shrink-0 text-blue-500/70" />
      <div>
        <div className="text-[12.5px] font-semibold leading-tight text-slate-800">{item.title}</div>
        <p className="line-clamp-1 text-[10px] leading-tight text-slate-400 mt-0.5">{item.description}</p>
      </div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TopNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    toast.success("Berhasil keluar");
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mr-6">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
            <PiggyBank className="text-white h-5 w-5" />
          </div>
          <div className="hidden lg:flex flex-col min-w-max">
            <Text.H1 className="leading-none mb-0.5 tracking-tight">KOPIMU</Text.H1>
            <Text.Label className="text-[9px] text-slate-400 font-bold whitespace-nowrap">
              Koperasi Pintar Multi Usaha
            </Text.Label>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex flex-1 max-w-none justify-start px-2 gap-1">

          {/* Generic menu groups */}
          {menuGroups.slice(0, 3).map((group) => (
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
              <DropdownMenuContent align="start" className="w-[240px] p-1 bg-white shadow-2xl border border-slate-200 rounded-xl mt-1">
                <div className="flex flex-col gap-0">
                  {group.items.map((item) => (
                    <MenuItem key={item.title} item={item} onClick={() => navigate(item.path)} />
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ))}

          {/* ── Unit Usaha — Mega Dropdown ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="px-2.5 h-9 bg-transparent hover:bg-slate-50 data-[state=open]:bg-slate-50 text-[13px] font-semibold text-slate-700 flex items-center gap-1.5 focus-visible:ring-0"
              >
                <Store className="h-3.5 w-3.5 text-slate-400" />
                <span>Unit Usaha</span>
                <ChevronDown className="h-3 w-3 text-slate-400 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[480px] p-3 bg-white shadow-2xl border border-slate-200 rounded-xl mt-1"
            >
              <div className="grid grid-cols-2 gap-3">
                {/* Retail Column */}
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1">
                    <div className="w-5 h-5 rounded-lg bg-blue-50 flex items-center justify-center">
                      <ShoppingCart size={11} className="text-blue-600" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">Retail</span>
                  </div>
                  <div className="flex flex-col gap-0">
                    {retailItems.map((item) => (
                      <MenuItem key={item.title} item={item} onClick={() => navigate(item.path)} />
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="border-l border-slate-100 pl-3">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1">
                    <div className="w-5 h-5 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Factory size={11} className="text-orange-500" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-orange-500">Manufaktur</span>
                  </div>
                  <div className="flex flex-col gap-0">
                    {manufakturItems.map((item) => (
                      <MenuItem key={item.title} item={item} onClick={() => navigate(item.path)} />
                    ))}
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Remaining generic menu groups */}
          {menuGroups.slice(3).map((group) => (
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
              <DropdownMenuContent align="start" className="w-[240px] p-1 bg-white shadow-2xl border border-slate-200 rounded-xl mt-1">
                <div className="flex flex-col gap-0">
                  {group.items.map((item) => (
                    <MenuItem key={item.title} item={item} onClick={() => navigate(item.path)} />
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
              <div className="px-3 py-2">
                <div className="flex flex-col space-y-0.5">
                  <Text.H2 className="text-xs leading-none">Super Admin</Text.H2>
                  <Text.Caption className="text-[10px] leading-none">admin@koperasi.com</Text.Caption>
                </div>
              </div>
              <div className="border-t border-slate-100 my-1" />
              <div
                onClick={() => navigate('/dashboard')}
                className="px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                Dashboard Utama
              </div>
              <div
                onClick={() => navigate('/pengaturan')}
                className="px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                Profil Koperasi
              </div>
              <div className="border-t border-slate-100 my-1" />
              <div
                onClick={handleLogout}
                className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer flex items-center gap-2"
              >
                <LogOut className="h-3.5 w-3.5" />
                Keluar
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}


