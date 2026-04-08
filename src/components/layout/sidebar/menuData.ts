
import {
  PiggyBank,
  Users,
  FileText, 
  Settings, 
  LogOut, 
  ShoppingCart, 
  Package,
  Archive, 
  User, 
  History, 
  Receipt, 
  BarChart, 
  LineChart, 
  Store, 
  ShoppingBag, 
  Shield, 
  Database,
  CreditCard, 
  Cog, 
  UserCheck,
  Truck,
  LayoutDashboard,
  Calculator,
  FileBarChart,
  TrendingUp,
  DollarSign,
  List,
  FileSpreadsheet,
  Upload,
  Book,
  BookOpen,
  Layout,
  ArrowUpFromLine,
  Boxes,
  ShoppingBasket,
  TrendingDown,
  UserCog,
  RotateCcw,
  Factory,
  ClipboardList,
  Wrench,
  CalendarRange,
  CheckSquare,
  Warehouse
} from "lucide-react";

export type MenuItemType = {
  title: string;
  path: string;
  icon: React.ElementType;
  subItems?: { title: string; path: string; icon: React.ElementType }[];
};

export type MenuSectionType = {
  title: string;
  icon: React.ElementType;
  items: MenuItemType[];
  hidden?: boolean;
  /** Which business tabs this section is visible in. Undefined = all tabs. */
  tabs?: ('koperasi' | 'retail' | 'manufaktur')[];
};

export const menuSections: MenuSectionType[] = [
  {
    title: "Master Data",
    icon: List,
    tabs: ['koperasi'],
    items: [
      { 
        title: "Unit Kerja", 
        path: "/master/unit-kerja", 
        icon: Package
      },
      { 
        title: "Data Anggota", 
        path: "/master/anggota", 
        icon: Users
      }
    ]
  },
  {
    title: "Koperasi",
    icon: PiggyBank,
    tabs: ['koperasi'],
    items: [
      { 
        title: "Transaksi", 
        path: "/transaksi", 
        icon: CreditCard, 
        subItems: [
          { title: "Jenis", path: "/transaksi/jenis", icon: List },
          { title: "Pengajuan", path: "/transaksi/pengajuan", icon: FileText },
          { title: "Simpan", path: "/transaksi/simpan", icon: FileText },
          { title: "Pinjam", path: "/transaksi/pinjam", icon: FileText },
          { title: "Penarikan", path: "/transaksi/penarikan", icon: ArrowUpFromLine },
          { title: "Angsuran", path: "/transaksi/angsuran", icon: FileText }
        ] 
      },
      { 
        title: "Arus Keuangan", 
        path: "/keuangan", 
        icon: DollarSign,
        subItems: [
          { title: "Kategori Transaksi", path: "/keuangan/kategori", icon: List },
          { title: "Transaksi Keuangan", path: "/keuangan/transaksi", icon: TrendingUp },
          { title: "Laporan Arus Kas", path: "/keuangan/laporan", icon: FileBarChart }
        ]
      },
      { title: "Laporan", path: "/laporan", icon: FileText }
    ]
  },
  {
    title: "Retail / POS",
    icon: Store,
    tabs: ['retail'],
    items: [
      { title: "Dashboard POS", path: "/pos", icon: LayoutDashboard },
      { 
        title: "Master Data", 
        path: "/pos/master", 
        icon: Database,
        subItems: [
          { title: "Stok Barang", path: "/pos/stok", icon: Package },
          { title: "Kategori", path: "/pos/kategori", icon: List },
          { title: "Pemasok", path: "/pos/pemasok", icon: Truck },
          { title: "Kasir", path: "/pos/kasir", icon: UserCog }
        ]
      },
      { 
        title: "Transaksi", 
        path: "/pos/transaksi", 
        icon: ShoppingCart,
        subItems: [
          { title: "Penjualan", path: "/pos/penjualan", icon: ShoppingBag },
          { title: "Pembelian", path: "/pos/pembelian", icon: ShoppingBasket },
          { title: "Retur", path: "/pos/retur", icon: TrendingDown }
        ]
      },
      { 
        title: "Laporan", 
        path: "/pos/laporan", 
        icon: FileBarChart,
        subItems: [
          { title: "Jual Beli", path: "/pos/laporan-jual-beli", icon: TrendingUp },
          { title: "Rugi Laba", path: "/pos/laporan-rugi-laba", icon: Calculator },
          { title: "Riwayat", path: "/pos/riwayat", icon: History }
        ]
      },
      { title: "Inventori", path: "/pos/inventori", icon: Archive }
    ]
  },
  {
    title: "Akuntansi",
    icon: Calculator,
    tabs: ['koperasi'],
    items: [
      { title: "Manajemen Akuntansi", path: "/akuntansi", icon: Layout },
      { title: "Chart of Accounts", path: "/akuntansi/chart-of-accounts", icon: Book },
      { title: "Jurnal Umum", path: "/akuntansi/jurnal-umum", icon: Receipt },
      { title: "Buku Besar", path: "/akuntansi/buku-besar", icon: BookOpen },
      { title: "Laporan Keuangan", path: "/akuntansi/laporan-keuangan", icon: FileBarChart }
    ]
  },
  {
    title: "Manufaktur",
    icon: Factory,
    tabs: ['manufaktur'],
    items: [
      { title: "Bill of Materials", path: "/manufaktur/bom", icon: ClipboardList },
      { title: "Work Orders", path: "/manufaktur/work-orders", icon: Wrench },
      { title: "Production Planning", path: "/manufaktur/production-plans", icon: CalendarRange },
      { title: "Quality Control", path: "/manufaktur/quality-control", icon: CheckSquare },
      { title: "Inventory", path: "/manufaktur/inventory", icon: Warehouse },
    ]
  },
  {
    title: "Pengaturan",
    icon: Settings,
    tabs: ['koperasi'],
    items: [
      { title: "Koperasi", path: "/pengaturan", icon: Cog },
      { title: "Pengguna", path: "/pengaturan/pengguna-peran", icon: Users },
      { title: "Rumus SHU", path: "/pengaturan/algoritma", icon: Calculator },
      { title: "Reset Data", path: "/pengaturan/reset-data", icon: RotateCcw },
      { title: "Audit Trail", path: "/pengaturan/audit-trail", icon: Shield }
    ]
  },
  {
    title: "Impor Data",
    icon: Upload,
    tabs: ['koperasi'],
    items: [
      { title: "Impor Anggota", path: "/import/anggota", icon: FileSpreadsheet },
      { title: "Impor Transaksi", path: "/import/transaksi", icon: FileSpreadsheet }
    ]
  }
];
