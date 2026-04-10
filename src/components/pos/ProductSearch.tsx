
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";

export function ProductSearch({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories
}: ProductSearchProps) {
  return (
    <div className="p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Text.H2>Daftar Produk</Text.H2>
        <Text.Caption className="not-italic text-slate-400 font-medium">
          {categories.length} Kategori
        </Text.Caption>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} strokeWidth={2} />
          <Input 
            placeholder="Cari produk..." 
            className="pl-10 h-11 bg-slate-50 border-none rounded-xl focus-visible:ring-blue-600/20 transition-all font-medium text-sm"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger className="h-11 bg-slate-50 border-none rounded-xl focus:ring-blue-600/20 font-medium text-sm">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-xl">
              <SelectItem value="all">Semua Kategori</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
