
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <Search className="h-5 w-5 text-gray-400" />
      <Input
        placeholder="Cari pemasok..."
        value={value}
        onChange={onChange}
        className="max-w-sm"
      />
    </div>
  );
}
