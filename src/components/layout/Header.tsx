
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User, Menu, PiggyBank, Store, Factory } from "lucide-react";
import NotificationBadge from "./NotificationBadge";
import { useSidebar } from "@/components/ui/sidebar";
import { useBusinessTab, BusinessTab } from "@/contexts/BusinessTabContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type HeaderProps = {
  pageTitle: string;
};

const businessTabs: { id: BusinessTab; label: string; icon: React.ElementType }[] = [
  { id: 'koperasi', label: 'Koperasi', icon: PiggyBank },
  { id: 'retail', label: 'Retail', icon: Store },
  { id: 'manufaktur', label: 'Manufaktur', icon: Factory },
];

export default function Header({ pageTitle }: HeaderProps) {
  const { toggleSidebar } = useSidebar();
  const { activeTab, setActiveTab } = useBusinessTab();
  const navigate = useNavigate();

  const handleTabClick = (tabId: BusinessTab) => {
    setActiveTab(tabId);
    if (tabId === 'retail') {
      navigate('/pos');
    } else if (tabId === 'koperasi') {
      navigate('/dashboard');
    } else if (tabId === 'manufaktur') {
      navigate('/manufaktur');
    }
  };

  return (
    <header className="bg-white border-b flex-shrink-0">
      {/* Top row: page title + actions */}
      <div className="py-2 sm:py-3 px-3 sm:px-4 md:px-6 flex items-center justify-between min-h-[48px]">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2 h-8 w-8"
            onClick={toggleSidebar}
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <h1 className="text-base sm:text-lg md:text-xl font-semibold text-koperasi-dark truncate pr-2 sm:pr-4 min-w-0">
            {pageTitle}
          </h1>
        </div>
        
        <div className="flex items-center gap-1 sm:gap-2 md:gap-4 flex-shrink-0">
          <NotificationBadge />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 h-8 sm:h-9 md:h-10 text-xs sm:text-sm">
                <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 sm:w-48 md:w-56">
              <DropdownMenuLabel className="text-sm">Akun Saya</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm">Profil</DropdownMenuItem>
              <DropdownMenuItem className="text-sm">Pengaturan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-sm">Keluar</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Business module tabs */}
      <div className="px-3 sm:px-4 md:px-6 flex items-center gap-1 border-t bg-gradient-to-r from-gray-50 to-white">
        {businessTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 sm:px-4 py-2.5 text-xs sm:text-sm font-medium transition-all duration-200 border-b-2 -mb-[1px]",
                isActive
                  ? "border-koperasi-green text-koperasi-green"
                  : "border-transparent text-muted-foreground hover:text-koperasi-dark hover:border-gray-300"
              )}
            >
              <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
}
