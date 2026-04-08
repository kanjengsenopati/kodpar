
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PieChart, Save, RotateCcw } from "lucide-react";
import { Pengaturan } from "@/types";
import { toast } from "sonner";

interface AlgoritmaDistributionProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
}

const defaultDistribution = {
  rekening_penyimpan: 25,
  rekening_berjasa: 25,
  pengurus: 10,
  dana_karyawan: 5,
  dana_pendidikan: 10,
  dana_pembangunan_daerah: 2.5,
  dana_sosial: 2.5,
  cadangan: 20
};

const distributionLabels = {
  rekening_penyimpan: "Rekening Penyimpan",
  rekening_berjasa: "Rekening Berjasa",
  pengurus: "Dana Pengurus",
  dana_karyawan: "Dana Karyawan",
  dana_pendidikan: "Dana Pendidikan",
  dana_pembangunan_daerah: "Dana Pembangunan Daerah",
  dana_sosial: "Dana Sosial",
  cadangan: "Cadangan"
};

export function AlgoritmaDistribution({ settings, setSettings }: AlgoritmaDistributionProps) {
  const distribution = settings.shu?.distribution || defaultDistribution;
  
  const totalPercentage = Object.values(distribution).reduce((sum, val) => sum + val, 0);
  const isValidDistribution = Math.abs(totalPercentage - 100) < 0.01; // Allow small floating point errors

  const handleDistributionChange = (key: string, value: number) => {
    const newDistribution = {
      ...distribution,
      [key]: value
    };

    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        distribution: newDistribution
      }
    });
  };

  const resetToDefault = () => {
    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        distribution: defaultDistribution
      }
    });
    toast.success("Distribusi SHU direset ke nilai default");
  };

  const saveDistribution = () => {
    if (!isValidDistribution) {
      toast.error("Total persentase harus sama dengan 100%");
      return;
    }
    
    toast.success("Pengaturan distribusi SHU berhasil disimpan");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5" />
          Distribusi SHU
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Atur persentase distribusi SHU sesuai dengan peraturan koperasi
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total percentage indicator */}
        <div className="p-4 border rounded-lg bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Total Distribusi</span>
            <span className={`text-lg font-bold ${isValidDistribution ? 'text-green-600' : 'text-red-600'}`}>
              {totalPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={totalPercentage} 
            className={`h-2 ${totalPercentage > 100 ? 'bg-red-100' : ''}`}
          />
          {!isValidDistribution && (
            <p className="text-xs text-red-600 mt-1">
              {totalPercentage > 100 ? 'Melebihi 100%' : 'Kurang dari 100%'}
            </p>
          )}
        </div>

        {/* Distribution inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(distributionLabels).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key} className="text-sm font-medium">
                {label}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id={key}
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={distribution[key as keyof typeof distribution]}
                  onChange={(e) => handleDistributionChange(key, Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Preview distribution */}
        <div className="border rounded-lg p-4 bg-blue-50">
          <h4 className="font-semibold mb-3 text-blue-800">Preview Distribusi</h4>
          <p className="text-sm text-blue-600 mb-3">
            Contoh distribusi untuk SHU sebesar Rp 100,000,000
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {Object.entries(distributionLabels).map(([key, label]) => {
              const amount = (100000000 * distribution[key as keyof typeof distribution]) / 100;
              return (
                <div key={key} className="flex justify-between items-center p-2 bg-white rounded">
                  <span>{label}</span>
                  <span className="font-mono font-semibold">
                    Rp {amount.toLocaleString('id-ID')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Default
          </Button>
          <Button 
            onClick={saveDistribution}
            disabled={!isValidDistribution}
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan Distribusi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
