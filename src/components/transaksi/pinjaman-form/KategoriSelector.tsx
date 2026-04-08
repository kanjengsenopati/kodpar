
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getPinjamanCategories } from "@/services/transaksi/categories";
import { KategoriSelectorProps } from "./types";
import { getPengaturan } from "@/services/pengaturanService";
import { getAvailableKategori } from "@/services/transaksiService";
import { useEffect, useState } from "react";

export function KategoriSelector({
  selectedKategori,
  onChange,
}: KategoriSelectorProps) {
  const [categories, setCategories] = useState<string[]>([]);
  const pengaturan = getPengaturan();

  // Load categories from the transaksi service
  useEffect(() => {
    try {
      // Get available categories from the service
      const availableCategories = getAvailableKategori("Pinjam");
      if (availableCategories && availableCategories.length > 0) {
        setCategories(availableCategories);
      } else {
        // Fallback to hardcoded categories if service returns empty
        setCategories(getPinjamanCategories());
      }
    } catch (error) {
      console.error("Error loading pinjaman categories:", error);
      // Fallback to hardcoded categories
      setCategories(getPinjamanCategories());
    }
  }, []);

  // Helper function to get interest rate for category
  const getBungaForCategory = (kategori: string): number => {
    if (
      pengaturan.sukuBunga?.pinjamanByCategory &&
      kategori in pengaturan.sukuBunga.pinjamanByCategory
    ) {
      return pengaturan.sukuBunga.pinjamanByCategory[kategori];
    }
    return pengaturan.sukuBunga?.pinjaman || 1;
  };

  return (
    <div className="grid w-full gap-2">
      <Label htmlFor="kategori" className="required">
        Kategori Pinjaman
      </Label>
      <Select value={selectedKategori} onValueChange={onChange} required>
        <SelectTrigger id="kategori">
          <SelectValue placeholder="Pilih kategori pinjaman" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category} ({getBungaForCategory(category)}% per bulan)
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground">
        Kategori pinjaman menentukan suku bunga dan persyaratan
      </p>
    </div>
  );
}
