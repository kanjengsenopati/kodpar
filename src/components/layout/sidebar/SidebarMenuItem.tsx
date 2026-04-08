
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import {
  SidebarMenuItem as ShadcnSidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SidebarMenuSubItem } from "./SidebarMenuSubItem";
import { MenuItemType } from "./menuData";

type SidebarMenuItemProps = {
  item: MenuItemType;
  isActive: boolean;
  locationPath: string;
};

export function SidebarMenuItem({ item, isActive, locationPath }: SidebarMenuItemProps) {
  const hasSubItems = !!item.subItems && item.subItems.length > 0;
  
  // Check if any sub-item is active
  const hasActiveSubItem = hasSubItems && item.subItems?.some(subItem => locationPath === subItem.path);
  
  // State for collapsible - default closed, but open if has active sub-item
  const [isOpen, setIsOpen] = useState(hasActiveSubItem || false);

  // Update isOpen when location changes and there's an active sub-item
  useEffect(() => {
    if (hasActiveSubItem) {
      setIsOpen(true);
    }
  }, [hasActiveSubItem]);

  // Handle collapsible toggle - prevent default action
  const handleToggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(!isOpen);
  };

  if (hasSubItems) {
    return (
      <TooltipProvider>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <ShadcnSidebarMenuItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive}
                    onClick={handleToggle}
                    className={`font-medium w-full rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm border px-4 py-3 min-h-[52px] ${
                      isActive 
                        ? 'bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white shadow-lg border-koperasi-green/30' 
                        : 'hover:bg-gradient-to-r hover:from-koperasi-light hover:to-gray-100 text-koperasi-dark hover:text-koperasi-dark border-gray-200 hover:border-koperasi-green/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md flex-shrink-0 ${
                        isActive ? 'bg-white/20' : 'bg-koperasi-green'
                      }`}>
                        <item.icon className="h-4 w-4 text-white" />
                      </div>
                      <span className={`font-semibold text-sm leading-tight flex-1 min-w-0 text-left truncate ${
                        isActive ? 'text-white' : 'text-koperasi-dark group-hover:text-koperasi-dark'
                      }`}>
                        {item.title}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      } ${isActive ? 'text-white' : 'text-koperasi-gray'}`} />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </TooltipTrigger>
              <TooltipContent 
                side="right" 
                align="center"
                className="bg-koperasi-dark text-white border-gray-600 shadow-xl max-w-xs z-[999999]"
                sideOffset={25}
                avoidCollisions={true}
                collisionPadding={20}
                sticky="always"
              >
                <p className="font-medium text-sm">{item.title}</p>
              </TooltipContent>
            </Tooltip>
            <CollapsibleContent>
              <SidebarMenuSub className="border-l-2 border-koperasi-green/30 ml-4 pl-3 mt-2 space-y-1">
                {item.subItems?.map((subItem, subIndex) => (
                  <SidebarMenuSubItem
                    key={subIndex}
                    path={subItem.path}
                    icon={subItem.icon}
                    title={subItem.title}
                    isActive={locationPath === subItem.path}
                  />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </ShadcnSidebarMenuItem>
        </Collapsible>
      </TooltipProvider>
    );
  }

  // Handle single menu item click - prevent default scroll behavior
  const handleItemClick = (event: React.MouseEvent) => {
    // Allow normal Link navigation, but prevent any scroll behavior
    event.stopPropagation();
  };

  return (
    <TooltipProvider>
      <ShadcnSidebarMenuItem>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              isActive={locationPath === item.path}
              className={`font-medium rounded-xl transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm border px-4 py-3 min-h-[52px] ${
                isActive 
                  ? 'bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white shadow-lg border-koperasi-green/30' 
                  : 'hover:bg-gradient-to-r hover:from-koperasi-light hover:to-gray-100 text-koperasi-dark hover:text-koperasi-dark border-gray-200 hover:border-koperasi-green/30'
              }`}
            >
              <Link 
                to={item.path} 
                className="flex items-center gap-3 w-full"
                onClick={handleItemClick}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md flex-shrink-0 ${
                  isActive ? 'bg-white/20' : 'bg-koperasi-green'
                }`}>
                  <item.icon className="h-4 w-4 text-white" />
                </div>
                <span className={`font-semibold text-sm leading-tight flex-1 min-w-0 text-left truncate ${
                  isActive ? 'text-white' : 'text-koperasi-dark'
                }`}>
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </TooltipTrigger>
          <TooltipContent 
            side="right" 
            align="center"
            className="bg-koperasi-dark text-white border-gray-600 shadow-xl max-w-xs z-[999999]"
            sideOffset={25}
            avoidCollisions={true}
            collisionPadding={20}
            sticky="always"
          >
            <p className="font-medium text-sm">{item.title}</p>
          </TooltipContent>
        </Tooltip>
      </ShadcnSidebarMenuItem>
    </TooltipProvider>
  );
}
