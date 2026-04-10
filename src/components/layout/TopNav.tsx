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
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mr-6">
          <div className="w-10 h-10 bg-gradient-to-br from-koperasi-blue to-koperasi-green rounded-xl flex items-center justify-center shadow-md">
            <PiggyBank className="text-white h-6 w-6" />
          </div>
          <div className="hidden lg:block">
            <h1 className="text-lg font-bold text-slate-900 leading-tight">Koperasi ERP</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Backoffice System</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <NavigationMenu className="hidden md:flex flex-1 max-w-none justify-start px-4">
          <NavigationMenuList className="gap-1">
            {menuGroups.map((group) => (
              <NavigationMenuItem key={group.title}>
                <NavigationMenuTrigger className="px-3 h-10 bg-transparent hover:bg-slate-50 data-[state=open]:bg-slate-50">
                  <div className="flex items-center gap-2">
                    <group.icon className="h-4 w-4 text-slate-500" />
                    <span className="font-semibold text-slate-700">{group.title}</span>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {group.items.map((item) => (
                      <ListItem
                        key={item.title}
                        title={item.title}
                        onClick={() => navigate(item.path)}
                        className="cursor-pointer"
                        icon={<item.icon className="h-4 w-4" />}
                      >
                        {item.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Action Section */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex mr-2">
             <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <input 
                  type="search" 
                  placeholder="Cari fitur..." 
                  className="pl-9 h-9 w-40 lg:w-60 rounded-full bg-slate-100 border-none text-sm focus:ring-2 focus:ring-koperasi-blue transition-all"
                />
             </div>
          </div>
          
          <NotificationBadge />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-slate-100 hover:border-koperasi-blue transition-all">
                <div className="h-full w-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-600" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Super Admin</p>
                  <p className="text-xs leading-none text-muted-foreground">admin@koperasi.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                Dashboard Utama
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/pengaturan')}>
                Profil Koperasi
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Keluar</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { title: string; icon?: React.ReactNode }
>(({ className, title, children, icon, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <div
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-accent-foreground focus:bg-slate-100 focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex items-center gap-2 text-sm font-bold leading-none text-slate-900">
            {icon && <span className="text-koperasi-blue">{icon}</span>}
            {title}
          </div>
          <p className="line-clamp-2 text-xs leading-snug text-slate-500 mt-1">
            {children}
          </p>
        </div>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
