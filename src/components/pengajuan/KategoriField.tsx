
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getSimpananCategories, getPinjamanCategories } from "@/services/transaksi/categories";
import { getPengaturan } from "@/services/pengaturanService";

interface KategoriFieldProps {
  jenis: "Simpan" | "Pinjam" | "Penarikan";
  value: string;
  onChange: (value: string) => void;
}

export function KategoriField({ jenis, value, onChange }: KategoriFieldProps) {
  const pengaturan = getPengaturan();
  
  // Get categories based on type
  let categories: string[] = [];
  if (jenis === "Simpan") {
    categories = getSimpananCategories();
  } else if (jenis === "Pinjam") {
    categories = getPinjamanCategories();
  } else if (jenis === "Penarikan") {
    categories = ["Reguler", "Darurat"];
  }
  
  // Helper function to get interest rate for loan category
  const getInterestRateForCategory = (category: string): number => {
    if (jenis === "Pinjam" && pengaturan?.sukuBunga?.pinjamanByCategory && 
        category in pengaturan.sukuBunga.pinjamanByCategory) {
      return pengaturan.sukuBunga.pinjamanByCategory[category];
    }
    return pengaturan?.sukuBunga?.pinjaman || 1.5;
  };

  const getJenisLabel = () => {
    switch (jenis) {
      case "Simpan": return "Simpanan";
      case "Pinjam": return "Pinjaman";
      case "Penarikan": return "Penarikan";
      default: return "Transaksi";
    }
  };

  return (
    <div>
      <Label htmlFor="kategori" className="required">
        Kategori {getJenisLabel()}
      </Label>
      <Select 
        value={value}
        onValueChange={onChange}
        required
      >
        <SelectTrigger id="kategori">
          <SelectValue placeholder={`Pilih kategori ${getJenisLabel().toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {jenis === "Pinjam" 
                ? `${category} - ${getInterestRateForCategory(category)}% per bulan`
                : category
              }
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
