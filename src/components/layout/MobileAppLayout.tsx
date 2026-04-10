
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Home, CreditCard, Users, Settings, PlusCircle, PiggyBank, User } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { logoutUser } from "@/services/authService";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/auth/sessionManagement";
import * as Text from "@/components/ui/text";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

type LayoutProps = {
  children: ReactNode;
  pageTitle: string;
};

/**
 * Premium Fintech Super-App layout for Mobile
 */
export default function MobileAppLayout({ children, pageTitle }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const user = getCurrentUser();
  const isAnggota = user?.roleId === "role_anggota" || user?.roleId === "anggota";

  const navItems = isAnggota ? [
    { label: "Beranda", icon: Home, path: "/" },
    { label: "Tabungan", icon: PiggyBank, path: "/transaksi/simpan" },
    { label: "Aksi", icon: PlusCircle, path: "/dashboard", primary: true },
    { label: "Pinjaman", icon: CreditCard, path: "/transaksi/pinjam" },
    { label: "Profil", icon: User, path: "/master/anggota/" + (user?.anggotaId || "") },
  ] : [
    { label: "Beranda", icon: Home, path: "/" },
    { label: "Transaksi", icon: CreditCard, path: "/transaksi" },
    { label: "Aksi", icon: PlusCircle, path: "/transaksi/tambah", primary: true },
    { label: "Anggota", icon: Users, path: "/anggota" },
    { label: "Menu", icon: Settings, path: "/pengaturan" },
  ];

  const userInitial = user?.nama ? user.nama.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden pb-20">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between">
        <div>
          <Text.H1 className="text-xl">{pageTitle}</Text.H1>
          <Text.Label className="text-[10px] leading-tight opacity-70">
            Koperasi Pintar Multi Usaha
          </Text.Label>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 font-bold active:scale-95 transition-transform cursor-pointer">
              {userInitial}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-2xl p-2 border-none shadow-xl">
            <DropdownMenuLabel className="font-bold text-slate-900">{user?.nama || "User"}</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem className="rounded-xl py-3 text-sm font-medium focus:bg-slate-50 transition-colors">
              Profil Saya
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl py-3 text-sm font-medium focus:bg-slate-50 transition-colors">
              Pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-100" />
            <DropdownMenuItem 
              className="rounded-xl py-3 text-sm font-bold text-red-600 focus:bg-red-50 focus:text-red-700 transition-colors cursor-pointer"
              onClick={() => {
                logoutUser();
                toast.success("Berhasil keluar");
                navigate("/login");
              }}
            >
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto px-5 py-4">
        {children}
      </main>

      {/* Premium Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-4 py-2 flex items-center justify-between pb-safe">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          if (item.primary) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center -mt-8"
              >
                <div className="w-14 h-14 rounded-full bg-blue-600 shadow-lg shadow-blue-200 flex items-center justify-center text-white mb-1">
                  <item.icon size={28} strokeWidth={2.5} />
                </div>
                <Text.Label className="text-[10px] text-blue-600 normal-case tracking-normal">{item.label}</Text.Label>
              </Link>
            );
          }
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200",
                isActive ? "text-blue-600 bg-blue-50/50" : "text-slate-400"
              )}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <Text.Label className={cn(
                "text-[10px] mt-1 normal-case tracking-normal",
                isActive ? "text-blue-600" : "text-slate-400"
              )}>
                {item.label}
              </Text.Label>
            </Link>
          );
        })}
      </nav>

      <Toaster />
    </div>
  );
}
