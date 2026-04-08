
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Lightbulb } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function FormulaGuidance() {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-blue-700">
          <Lightbulb className="h-4 w-4" />
          Panduan Penggunaan Formula
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Alert className="bg-blue-100 border-blue-300">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-700 text-sm">
            <div className="space-y-2">
              <p><strong>Cara membuat formula:</strong></p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Pilih variabel dari daftar yang tersedia</li>
                <li>Gunakan operator matematika (+, -, *, /, (), %)</li>
                <li>Kombinasikan variabel dengan konstanta angka</li>
                <li>Preview untuk melihat hasil perhitungan</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div>
            <h4 className="font-semibold text-blue-700 mb-1">Contoh Formula SHU:</h4>
            <code className="block bg-white p-2 rounded border text-blue-800">
              simpanan_wajib * 0.05 + simpanan_khusus * 0.03 + jasa * 0.02
            </code>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-1">Contoh Formula THR:</h4>
            <code className="block bg-white p-2 rounded border text-blue-800">
              lama_keanggotaan * 100000 + simpanan_pokok * 0.01
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
