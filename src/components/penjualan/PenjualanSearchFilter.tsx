
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PenjualanSearchFilterProps {
  searchQuery: string;
  filterStatus: "all" | "sukses" | "dibatalkan";
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterChange: (value: "all" | "sukses" | "dibatalkan") => void;
}

export function PenjualanSearchFilter({
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterChange
}: PenjualanSearchFilterProps) {
  return (
    <div className="p-6 border-b flex flex-wrap items-center gap-4">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Cari berdasarkan nomor transaksi..." 
          className="pl-10"
          value={searchQuery}
          onChange={onSearchChange}
        />
      </div>
      
      <div className="w-40">
        <Select value={filterStatus} onValueChange={(value: "all" | "sukses" | "dibatalkan") => onFilterChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="sukses">Sukses</SelectItem>
            <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
