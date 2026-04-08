
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calculator, Gift, Settings, TrendingUp } from "lucide-react";
import { Pengaturan } from "@/types";
import { getPengaturan, savePengaturan } from "@/services/pengaturanService";
import { AlgoritmaEditor } from "@/components/pengaturan/algoritma/AlgoritmaEditor";
import { VariableManager } from "@/components/pengaturan/algoritma/VariableManager";
import { AlgoritmaPreview } from "@/components/pengaturan/algoritma/AlgoritmaPreview";
import { AlgoritmaDistribution } from "@/components/pengaturan/algoritma/AlgoritmaDistribution";
import Layout from "@/components/layout/Layout";

export default function AlgoritmaPage() {
  const [settings, setSettings] = useState<Pengaturan>(getPengaturan());

  const handleSaveSettings = (updatedSettings: Pengaturan) => {
    setSettings(updatedSettings);
    savePengaturan(updatedSettings);
  };

  return (
    <Layout pageTitle="Algoritma SHU & THR">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Calculator className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Algoritma SHU & THR</h1>
        </div>

        <div className="text-center py-4">
          <p className="text-muted-foreground">
            Kelola algoritma perhitungan SHU (Sisa Hasil Usaha) dan THR (Tunjangan Hari Raya) untuk anggota dan pengurus koperasi
          </p>
        </div>

        <Tabs defaultValue="shu-algorithm" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="shu-algorithm" className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              Algoritma SHU
            </TabsTrigger>
            <TabsTrigger value="thr-algorithm" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Algoritma THR
            </TabsTrigger>
            <TabsTrigger value="variables" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Variabel
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Distribusi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shu-algorithm" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Editor Algoritma SHU
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlgoritmaEditor
                  settings={settings}
                  setSettings={handleSaveSettings}
                  algorithmType="shu"
                />
              </CardContent>
            </Card>

            <AlgoritmaPreview
              settings={settings}
              algorithmType="shu"
            />
          </TabsContent>

          <TabsContent value="thr-algorithm" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Editor Algoritma THR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AlgoritmaEditor
                  settings={settings}
                  setSettings={handleSaveSettings}
                  algorithmType="thr"
                />
              </CardContent>
            </Card>

            <AlgoritmaPreview
              settings={settings}
              algorithmType="thr"
            />
          </TabsContent>

          <TabsContent value="variables" className="space-y-6">
            <VariableManager
              settings={settings}
              setSettings={handleSaveSettings}
            />
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <AlgoritmaDistribution
              settings={settings}
              setSettings={handleSaveSettings}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
