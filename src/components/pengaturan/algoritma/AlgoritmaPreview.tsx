
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calculator, Users, RefreshCw, TrendingUp } from "lucide-react";
import { Pengaturan } from "@/types";
import { evaluateFormulaWithVariables } from "@/services/keuangan/formulaEvaluatorService";
import { getAnggotaList } from "@/services/anggotaService";

interface AlgoritmaPreviewProps {
  settings: Pengaturan;
  algorithmType: 'shu' | 'thr';
}

export function AlgoritmaPreview({ settings, algorithmType }: AlgoritmaPreviewProps) {
  const [previewResults, setPreviewResults] = useState<Array<{
    id: string;
    name: string;
    result: number;
    variables: Record<string, number>;
  }>>([]);

  const formula = algorithmType === 'shu' 
    ? (settings.shu?.formula || "")
    : (settings.shu?.thrFormula || "");

  // Sample variables for preview
  const sampleVariables = {
    simpanan_pokok: 500000,
    simpanan_wajib: 2600000,
    simpanan_khusus: 1000000,
    pinjaman: 15000000,
    jasa: 750000,
    pendapatan: 8000000,
    lama_keanggotaan: 3,
    transaksi_amount: 25000000,
    angsuran: 5000000
  };

  // Add custom variables
  const customVariables = settings.shu?.customVariables || [];
  customVariables.forEach(v => {
    sampleVariables[v.id] = v.value;
  });

  const calculatePreview = () => {
    if (!formula.trim()) {
      setPreviewResults([]);
      return;
    }

    // Get real anggota data or use sample data
    const anggotaList = getAnggotaList();
    const sampleData = anggotaList.length > 0 
      ? anggotaList.slice(0, 5) // Take first 5 members
      : [
          { id: 'sample1', nama: 'Sample Anggota 1' },
          { id: 'sample2', nama: 'Sample Anggota 2' },
          { id: 'sample3', nama: 'Sample Anggota 3' }
        ];

    const results = sampleData.map(anggota => {
      // Create slight variations for each member
      const memberVariables = { ...sampleVariables };
      const multiplier = 0.8 + (Math.random() * 0.4); // 0.8 to 1.2
      
      Object.keys(memberVariables).forEach(key => {
        if (key !== 'lama_keanggotaan') { // Don't vary membership duration
          memberVariables[key] = Math.round(memberVariables[key] * multiplier);
        }
      });

      const result = evaluateFormulaWithVariables(formula, memberVariables);
      
      return {
        id: anggota.id,
        name: anggota.nama,
        result: result || 0,
        variables: memberVariables
      };
    });

    setPreviewResults(results);
  };

  useEffect(() => {
    calculatePreview();
  }, [formula, settings.shu?.customVariables]);

  const totalResult = previewResults.reduce((sum, r) => sum + r.result, 0);
  const averageResult = previewResults.length > 0 ? totalResult / previewResults.length : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Preview Algoritma {algorithmType.toUpperCase()}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Simulasi perhitungan dengan data sampel anggota
            </p>
          </div>
          <Button onClick={calculatePreview} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="results" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="results">Hasil Perhitungan</TabsTrigger>
            <TabsTrigger value="summary">Ringkasan</TabsTrigger>
          </TabsList>

          <TabsContent value="results" className="space-y-4">
            {!formula.trim() ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calculator className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Formula belum diatur</p>
                <p className="text-sm">Buat formula untuk melihat preview perhitungan</p>
              </div>
            ) : previewResults.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Menghitung preview...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {previewResults.map(result => (
                  <div key={result.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{result.name}</div>
                      <div className="text-sm text-muted-foreground">ID: {result.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-lg font-semibold text-primary">
                        Rp {result.result.toLocaleString('id-ID')}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {algorithmType.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="summary" className="space-y-4">
            {previewResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <div className="text-2xl font-bold">{previewResults.length}</div>
                      <div className="text-sm text-muted-foreground">Anggota Sampel</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <div className="text-2xl font-bold">
                        Rp {averageResult.toLocaleString('id-ID')}
                      </div>
                      <div className="text-sm text-muted-foreground">Rata-rata</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Calculator className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <div className="text-2xl font-bold">
                        Rp {totalResult.toLocaleString('id-ID')}
                      </div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {formula && (
              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-2">Formula yang Digunakan:</h4>
                  <code className="block p-3 bg-white rounded border font-mono text-sm">
                    {formula}
                  </code>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
