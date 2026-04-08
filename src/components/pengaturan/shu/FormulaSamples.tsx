
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface FormulaSamplesProps {
  onUseFormula: (formula: string) => void;
}

export function FormulaSamples({ onUseFormula }: FormulaSamplesProps) {
  const formulaSamples = [
    {
      name: "Formula Simpanan Dasar",
      formula: "simpanan_khusus * 0.03 + simpanan_wajib * 0.05",
      description: "Formula berdasarkan simpanan khusus dan wajib"
    },
    {
      name: "Formula Pendapatan",
      formula: "pendapatan * 0.02",
      description: "Formula sederhana berdasarkan pendapatan"
    },
    {
      name: "Formula Komprehensif",
      formula: "simpanan_khusus * 0.03 + simpanan_wajib * 0.05 + pendapatan * 0.02",
      description: "Formula lengkap dengan semua faktor"
    },
    {
      name: "Formula Rekening Berjasa",
      formula: "rekening_berjasa * 0.05 + rekening_penyimpan * 0.03",
      description: "Formula berdasarkan rekening berjasa dan penyimpan"
    }
  ];

  return (
    <div className="space-y-2">
      {formulaSamples.map((sample, index) => (
        <Card key={index} className="p-3 bg-card">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{sample.name}</h4>
              <p className="text-sm text-muted-foreground">{sample.description}</p>
              <div className="mt-1 bg-muted rounded px-2 py-1 text-xs font-mono inline-block">
                {sample.formula}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onUseFormula(sample.formula)}
            >
              Gunakan
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
