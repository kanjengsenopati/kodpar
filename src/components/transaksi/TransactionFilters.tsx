
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

interface TransactionFiltersProps {
  searchQuery: string;
  filterStatus: "all" | "sukses" | "dibatalkan";
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterStatusChange: (value: string) => void;
}

export function TransactionFilters({
  searchQuery,
  filterStatus,
  onSearchChange,
  onFilterStatusChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          placeholder="Cari transaksi..."
          value={searchQuery}
          onChange={onSearchChange}
          className="pl-10"
        />
      </div>
      <Select onValueChange={onFilterStatusChange} defaultValue={filterStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="sukses">Sukses</SelectItem>
          <SelectItem value="dibatalkan">Dibatalkan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
