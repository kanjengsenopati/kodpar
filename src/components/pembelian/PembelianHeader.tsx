
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface PembelianHeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PembelianHeader({ searchQuery, onSearchChange }: PembelianHeaderProps) {
  return (
    <>
      <div className="mb-6 mt-2">
        <Input
          placeholder="Cari berdasarkan nomor, pemasok, atau status..."
          value={searchQuery}
          onChange={onSearchChange}
          className="max-w-md"
        />
      </div>
    </>
  );
}
