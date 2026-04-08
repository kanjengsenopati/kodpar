
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertCircle, 
  HelpCircle, 
  Calculator, 
  Variable, 
  Plus, 
  Minus, 
  Divide, 
  X as Multiply, 
  Percent
} from "lucide-react";

interface FormulaGuidanceProps {
  errorMessage: string | null;
}

export function FormulaGuidance({ errorMessage }: FormulaGuidanceProps) {
  return (
    <div className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Formula</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Cara Penggunaan Formula
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Calculator className="h-4 w-4" />
              Contoh Formula
            </h4>
            <code className="bg-muted p-2 rounded-md block">
              simpanan_wajib * 0.05 + simpanan_khusus * 0.03
            </code>
            <p className="mt-2 text-muted-foreground">
              Formula di atas akan menghitung SHU sebesar 5% dari simpanan wajib ditambah 3% dari simpanan khusus.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Variable className="h-4 w-4" />
              Variabel yang Tersedia
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><code>simpanan_pokok</code> - Nilai simpanan pokok anggota</li>
              <li><code>simpanan_wajib</code> - Nilai simpanan wajib anggota</li>
              <li><code>simpanan_khusus</code> - Nilai simpanan khusus anggota</li>
              <li><code>totalSimpanan</code> - Total seluruh simpanan anggota</li>
              <li><code>pinjaman</code> - Total pinjaman anggota</li>
              <li><code>jasa</code> - Nilai jasa dari bunga pinjaman</li>
              <li><code>pendapatan</code> - Pendapatan yang dihasilkan anggota</li>
              <li><code>lama_keanggotaan</code> - Lama keanggotaan dalam tahun</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium flex items-center gap-2 mb-2">
              <Plus className="h-4 w-4" />
              <Minus className="h-4 w-4" />
              <Multiply className="h-4 w-4" />
              <Divide className="h-4 w-4" />
              Operator yang Didukung
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li><code>+</code> - Penjumlahan (contoh: <code>a + b</code>)</li>
              <li><code>-</code> - Pengurangan (contoh: <code>a - b</code>)</li>
              <li><code>*</code> - Perkalian (contoh: <code>a * 0.05</code>)</li>
              <li><code>/</code> - Pembagian (contoh: <code>a / 2</code>)</li>
              <li><code>%</code> - Modulo/Sisa (contoh: <code>a % 2</code>)</li>
              <li><code>()</code> - Kurung untuk prioritas (contoh: <code>(a + b) * c</code>)</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
            <h4 className="font-medium flex items-center gap-2 text-blue-800">
              <Percent className="h-4 w-4" />
              Tips Formula
            </h4>
            <p className="text-blue-700 mt-1">
              Untuk menghitung persentase, kalikan nilai dengan desimal. 
              Contoh: 5% dari <code>simpanan_wajib</code> ditulis sebagai <code>simpanan_wajib * 0.05</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
