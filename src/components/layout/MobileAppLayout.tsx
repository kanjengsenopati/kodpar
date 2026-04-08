
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Home, CreditCard, Users, Settings, PlusCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: ReactNode;
  pageTitle: string;
};

/**
 * Premium Fintech Super-App layout for Mobile
 */
export default function MobileAppLayout({ children, pageTitle }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { label: "Beranda", icon: Home, path: "/" },
    { label: "Transaksi", icon: CreditCard, path: "/transaksi" },
    { label: "Aksi", icon: PlusCircle, path: "/transaksi/baru", primary: true },
    { label: "Anggota", icon: Users, path: "/anggota" },
    { label: "Menu", icon: Settings, path: "/pengaturan" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 overflow-hidden pb-20">
      {/* Dynamic Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{pageTitle}</h1>
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Koperasi Digital</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-600 font-bold">
          JD
        </div>
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
                <span className="text-[10px] font-bold text-blue-600">{item.label}</span>
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
              <span className={cn(
                "text-[10px] mt-1 font-medium",
                isActive ? "font-bold" : "text-slate-400"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <Toaster />
    </div>
  );
}
