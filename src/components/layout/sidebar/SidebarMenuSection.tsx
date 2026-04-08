
import React from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu
} from "@/components/ui/sidebar";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { MenuSectionType } from "./menuData";

type SidebarMenuSectionProps = {
  section: MenuSectionType;
  locationPath: string;
};

export function SidebarMenuSection({ section, locationPath }: SidebarMenuSectionProps) {
  // Check if a path is active or one of its subpaths is active
  const isPathActive = (path: string, subItems?: { path: string }[]): boolean => {
    const isMainPathActive = locationPath === path;
    const isSubPathActive = subItems?.some(item => locationPath === item.path) || false;
    
    return isMainPathActive || isSubPathActive;
  };

  return (
    <SidebarGroup className="mb-2">
      <SidebarGroupLabel className="flex items-center text-xs uppercase tracking-wider font-bold text-koperasi-dark bg-gradient-to-r from-koperasi-light to-gray-100 px-3 py-2 rounded-xl mb-2 shadow-md backdrop-blur-sm border border-gray-200">
        <div className="w-6 h-6 bg-koperasi-green rounded-lg flex items-center justify-center mr-2 shadow-md">
          <section.icon className="h-3 w-3 text-white" />
        </div>
        {section.title}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {section.items.map((item, itemIndex) => (
            <SidebarMenuItem
              key={itemIndex}
              item={item}
              isActive={isPathActive(item.path, item.subItems)}
              locationPath={locationPath}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
