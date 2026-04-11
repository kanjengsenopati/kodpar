
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getAllJenis } from "@/services/jenisService";
import { getPengaturan } from "@/services/pengaturanService";

interface KategoriFieldProps {
  jenis: "Simpan" | "Pinjam" | "Penarikan";
  value: string;
  onChange: (value: string) => void;
}

export function KategoriField({ jenis, value, onChange }: KategoriFieldProps) {
  const pengaturan = getPengaturan();
  
  // Get types based on transaction group
  const mapGroup = (j: "Simpan" | "Pinjam" | "Penarikan"): string => {
    if (j === "Simpan") return "Simpanan";
    if (j === "Pinjam") return "Pinjaman";
    return "Pengajuan";
  };
  
  const allJenis = getAllJenis();
  const filteredJenis = allJenis.filter(j => j.jenisTransaksi === mapGroup(jenis) && j.isActive);
  
  // Helper function to get interest rate for loan category
  const getInterestRateForCategory = (id: string): number => {
    const j = allJenis.find(item => item.id === id);
    return (j as any)?.bungaPersen || pengaturan?.sukuBunga?.pinjaman || 1.5;
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
          {filteredJenis.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {jenis === "Pinjam" && 'bungaPersen' in item
                ? `${item.nama} - ${item.bungaPersen}% per bulan`
                : item.nama
              }
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
