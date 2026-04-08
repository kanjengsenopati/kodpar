
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface PembelianHeaderProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddNew: () => void;
}

export function PembelianHeader({ searchQuery, onSearchChange, onAddNew }: PembelianHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pembelian Barang</h1>
        <Button onClick={onAddNew} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Tambah Pembelian
        </Button>
      </div>
      
      <div className="mb-6">
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
