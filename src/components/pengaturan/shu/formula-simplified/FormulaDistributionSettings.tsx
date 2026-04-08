
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { SHUDistribution, Pengaturan } from "@/types";
import { toast } from "sonner";
import { Save } from "lucide-react";

interface FormulaDistributionSettingsProps {
  settings: Pengaturan;
  setSettings: (settings: Pengaturan) => void;
}

export function FormulaDistributionSettings({ 
  settings, 
  setSettings 
}: FormulaDistributionSettingsProps) {
  // Initialize state with current distribution or default values
  const [distribution, setDistribution] = useState<SHUDistribution>(
    settings.shu?.distribution || {
      rekening_penyimpan: 25,
      rekening_berjasa: 25,
      pengurus: 10,
      dana_karyawan: 5,
      dana_pendidikan: 10,
      dana_pembangunan_daerah: 2.5,
      dana_sosial: 2.5,
      cadangan: 20
    }
  );
  
  // For validating total = 100%
  const [isValid, setIsValid] = useState(true);
  const [total, setTotal] = useState(0);
  
  // State for chart data
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Update total when distribution changes
  useEffect(() => {
    const sum = Object.values(distribution).reduce((acc, val) => acc + val, 0);
    setTotal(sum);
    setIsValid(Math.abs(sum - 100) < 0.01); // Allow small rounding errors
    
    // Update chart data
    const data = Object.entries(distribution).map(([key, value]) => ({
      name: formatDistributionName(key),
      value,
    }));
    setChartData(data);
  }, [distribution]);
  
  // Handle input change
  const handleDistributionChange = (key: keyof SHUDistribution, value: string) => {
    const numValue = parseFloat(value) || 0;
    setDistribution({
      ...distribution,
      [key]: numValue
    });
  };
  
  // Save distribution changes
  const handleSave = () => {
    if (!isValid) {
      toast.error("Total distribusi harus 100%");
      return;
    }
    
    // Update settings
    setSettings({
      ...settings,
      shu: {
        ...(settings.shu || {}),
        distribution
      }
    });
    
    toast.success("Pengaturan distribusi SHU berhasil disimpan");
  };
  
  // Format distribution name for display
  const formatDistributionName = (key: string): string => {
    const nameMap: Record<string, string> = {
      rekening_penyimpan: "Rekening Penyimpan",
      rekening_berjasa: "Rekening Berjasa",
      pengurus: "Pengurus",
      dana_karyawan: "Dana Karyawan",
      dana_pendidikan: "Dana Pendidikan",
      dana_pembangunan_daerah: "Dana Pembangunan",
      dana_sosial: "Dana Sosial",
      cadangan: "Cadangan"
    };
    
    return nameMap[key] || key;
  };
  
  // Chart colors
  const COLORS = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', 
    '#0088fe', '#00C49F', '#FFBB28', '#FF8042'
  ];

  // Render
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Distribusi SHU</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Atur persentase distribusi SHU untuk setiap kategori. 
              Total distribusi harus mencapai 100%.
            </p>
            
            {Object.entries(distribution).map(([key, value]) => (
              <div key={key} className="grid grid-cols-2 gap-4 items-center">
                <Label htmlFor={key}>{formatDistributionName(key)}</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id={key}
                    type="number"
                    value={value}
                    onChange={(e) => handleDistributionChange(key as keyof SHUDistribution, e.target.value)}
                    step="0.1"
                    min="0"
                    max="100"
                    className="w-24"
                  />
                  <span>%</span>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4 border-t">
              <div>
                <span className="font-medium">Total:</span>{" "}
                <span className={!isValid ? "text-red-500 font-bold" : ""}>
                  {total.toFixed(1)}%
                </span>
                {!isValid && (
                  <p className="text-red-500 text-xs mt-1">
                    Total harus 100%
                  </p>
                )}
              </div>
              
              <Button 
                onClick={handleSave}
                disabled={!isValid}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Simpan
              </Button>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
