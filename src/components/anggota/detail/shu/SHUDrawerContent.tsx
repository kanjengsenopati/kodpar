
import { RefreshCw, Info, Calculator, PieChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { BadgeDollarSign } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormulaVisualizer } from './FormulaVisualizer';
import { SHUDistribution } from './SHUDistribution';
import { calculateTotalSavings } from "@/utils/shuUtils";
import { SHUTotalCard } from "./SHUTotalCard";

interface SHUDrawerContentProps {
  totalSHU: number;
  shuFormula: string;
  onUpdateSHU: () => void;
}

export function SHUDrawerContent({ totalSHU, shuFormula, onUpdateSHU }: SHUDrawerContentProps) {
  // Get example values for visualization
  const totalSimpanan = calculateTotalSavings('all');
  const simpanan_khusus = calculateTotalSavings('simpanan_khusus');
  const simpanan_wajib = calculateTotalSavings('simpanan_wajib');
  const pendapatan = totalSHU * 0.5; // Example: 50% of SHU is from income
  
  return (
    <>
      <DrawerHeader>
        <DrawerTitle className="text-xl font-bold flex items-center gap-2">
          <BadgeDollarSign className="h-5 w-5" /> 
          Sisa Hasil Usaha (SHU)
        </DrawerTitle>
        <DrawerDescription>
          Informasi perhitungan dan distribusi SHU untuk anggota
        </DrawerDescription>
      </DrawerHeader>
        
      <div className="p-4 overflow-y-auto">
        <SHUTotalCard totalSHU={totalSHU} />
        
        <div className="space-y-4">
          <Tabs defaultValue="components">
            <TabsList className="w-full grid grid-cols-2 mb-4">
              <TabsTrigger value="components">Komponen SHU</TabsTrigger>
              <TabsTrigger value="distribution">
                <div className="flex items-center gap-2">
                  <PieChart className="h-4 w-4" />
                  <span>Distribusi SHU</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="components">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Calculator className="h-4 w-4" />
                    Komponen SHU
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Visualisasi Komponen</h4>
                    <FormulaVisualizer 
                      formula={shuFormula}
                      variables={[
                        { name: "simpanan_khusus", value: simpanan_khusus },
                        { name: "simpanan_wajib", value: simpanan_wajib },
                        { name: "pendapatan", value: pendapatan }
                      ]}
                      totalSHU={totalSHU}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="distribution">
              <SHUDistribution totalSHU={totalSHU} />
            </TabsContent>
          </Tabs>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Info className="h-4 w-4" />
                Informasi Tambahan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                SHU adalah pembagian keuntungan koperasi yang dibagikan kepada anggota berdasarkan partisipasi
                dan kontribusinya pada koperasi.
              </p>
              <p className="text-sm">
                Formula yang digunakan: <code className="bg-gray-100 px-1 py-0.5 rounded">{shuFormula}</code>
              </p>
              <p className="text-sm">
                Perhitungan SHU diperbarui setiap kali formula diubah di pengaturan SHU.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <DrawerFooter>
        <Button onClick={onUpdateSHU} variant="secondary" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Perbarui Nilai SHU
        </Button>
        <DrawerClose asChild>
          <Button variant="outline">Tutup</Button>
        </DrawerClose>
      </DrawerFooter>
    </>
  );
}
