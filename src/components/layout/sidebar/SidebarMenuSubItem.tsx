
import React from "react";
import { Link } from "react-router-dom";
import { 
  SidebarMenuSubItem as ShadcnSidebarMenuSubItem, 
  SidebarMenuSubButton 
} from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type SidebarMenuSubItemProps = {
  path: string;
  icon: React.ElementType;
  title: string;
  isActive: boolean;
};

export function SidebarMenuSubItem({ path, icon: Icon, title, isActive }: SidebarMenuSubItemProps) {
  // Handle sub-item click - prevent scroll behavior
  const handleSubItemClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <TooltipProvider>
      <ShadcnSidebarMenuSubItem>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarMenuSubButton 
              asChild 
              isActive={isActive} 
              className={`rounded-lg transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm border mb-1 px-3 py-2.5 min-h-[44px] ${
                isActive 
                  ? 'bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white shadow-lg border-koperasi-green/30' 
                  : 'hover:bg-gradient-to-r hover:from-koperasi-light hover:to-gray-100 text-koperasi-dark hover:text-koperasi-dark border-gray-200 hover:border-koperasi-green/30'
              }`}
            >
              <Link 
                to={path} 
                className="w-full flex items-center gap-3"
                onClick={handleSubItemClick}
              >
                <div className={`w-6 h-6 rounded-md flex items-center justify-center shadow-sm flex-shrink-0 ${
                  isActive ? 'bg-white/20' : 'bg-koperasi-green'
                }`}>
                  <Icon className="h-3.5 w-3.5 text-white" />
                </div>
                <span className={`font-medium text-sm leading-tight flex-1 min-w-0 truncate ${
                  isActive ? 'text-white' : ''
                }`}>
                  {title}
                </span>
              </Link>
            </SidebarMenuSubButton>
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
            <p className="font-medium text-sm">{title}</p>
          </TooltipContent>
        </Tooltip>
      </ShadcnSidebarMenuSubItem>
    </TooltipProvider>
  );
}
