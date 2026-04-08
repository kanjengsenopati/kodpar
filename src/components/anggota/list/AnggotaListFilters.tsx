
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, LayoutList, LayoutGrid } from "lucide-react";
import { TableColumnToggle } from "@/components/ui/table-column-toggle";

interface AnggotaListFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  viewMode: "table" | "grid";
  setViewMode: (mode: "table" | "grid") => void;
  columns: { id: string; label: string; isVisible: boolean }[];
  onToggleColumn: (columnId: string) => void;
}

export function AnggotaListFilters({
  searchQuery,
  setSearchQuery,
  viewMode,
  setViewMode,
  columns,
  onToggleColumn,
}: AnggotaListFiltersProps) {
  return (
    <div className="p-6 border-b flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Cari berdasarkan nama, ID, atau NIP..." 
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === "table" ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => setViewMode("table")}
          title="Tampilan Tabel"
        >
          <LayoutList className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === "grid" ? "default" : "outline"}
          size="icon"
          className="h-8 w-8"
          onClick={() => setViewMode("grid")}
          title="Tampilan Grid"
        >
          <LayoutGrid className="h-4 w-4" />
        </Button>
        
        {viewMode === "table" && (
          <TableColumnToggle columns={columns} onToggleColumn={onToggleColumn} />
        )}
      </div>
    </div>
  );
}
