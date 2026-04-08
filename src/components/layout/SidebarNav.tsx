
import { useLocation } from "react-router-dom";
import { LogOut, PiggyBank } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { menuSections } from "./sidebar/menuData";
import { SidebarMenuSection } from "./sidebar/SidebarMenuSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBusinessTab } from "@/contexts/BusinessTabContext";

export function SidebarNav() {
  const location = useLocation();
  const { activeTab } = useBusinessTab();

  // Filter menu sections by active business tab
  const visibleMenuSections = menuSections.filter(section => {
    if (section.hidden) return false;
    if (!section.tabs) return true;
    return section.tabs.includes(activeTab);
  });

  return (
    <Sidebar 
      variant="sidebar" 
      collapsible="icon" 
      className="border-r border-gray-200 hidden md:flex bg-gradient-to-b from-white to-gray-50 z-40"
    >
      <SidebarHeader className="border-b border-gray-200 bg-gradient-to-r from-koperasi-blue to-koperasi-green shadow-sm">
        <div className="flex items-center gap-2 px-3 py-3 relative">
          <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
          <div className="relative z-10 flex items-center gap-2 w-full">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
              <PiggyBank className="h-5 w-5 text-white flex-shrink-0" />
            </div>
            <h1 className="text-base font-bold text-white truncate group-data-[collapsible=icon]:hidden drop-shadow-sm">
              Koperasi-ERP
            </h1>
            <SidebarTrigger className="ml-auto h-7 w-7 flex-shrink-0 text-white hover:bg-white/20 hover:text-white rounded-lg transition-all duration-200" />
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-2 sm:p-3">
            <div className="space-y-2">
              {visibleMenuSections.map((section, index) => (
                <SidebarMenuSection 
                  key={index} 
                  section={section} 
                  locationPath={location.pathname}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-200">
        <div className="p-3">
          <SidebarMenuButton 
            variant="outline"
            tooltip="Keluar"
            className="w-full justify-start bg-gradient-to-r from-red-50 to-red-100 hover:from-red-100 hover:to-red-200 text-red-700 hover:text-red-800 border-2 border-red-200 hover:border-red-300 text-sm rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span className="group-data-[collapsible=icon]:hidden font-semibold">Keluar</span>
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
