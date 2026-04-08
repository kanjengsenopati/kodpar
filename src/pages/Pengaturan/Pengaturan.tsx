
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { 
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { 
  Clock, 
  Percent, 
  AlertTriangle,
  Beaker,
  Building2
} from "lucide-react";
import { getPengaturan } from "@/services/pengaturanService";
import { Pengaturan as PengaturanType } from "@/types";
import { TenorSettings } from "@/components/pengaturan/TenorSettings";
import { SukuBungaSettings } from "@/components/pengaturan/SukuBungaSettings";
import { DendaSettings } from "@/components/pengaturan/DendaSettings";
import { SHUSettings } from "@/components/pengaturan/SHUSettings";
import { ProfilKoperasiSettings } from "@/components/pengaturan/ProfilKoperasiSettings";

export default function Pengaturan() {
  const [settings, setSettings] = useState<PengaturanType>(getPengaturan());
  
  return (
    <Layout pageTitle="Pengaturan">
      <h1 className="page-title">Pengaturan Koperasi</h1>
      
      <Tabs defaultValue="profil" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-6">
          <TabsTrigger value="profil" className="gap-2">
            <Building2 size={16} /> Profil
          </TabsTrigger>
          <TabsTrigger value="tenor" className="gap-2">
            <Clock size={16} /> Tenor
          </TabsTrigger>
          <TabsTrigger value="bunga" className="gap-2">
            <Percent size={16} /> Suku Bunga
          </TabsTrigger>
          <TabsTrigger value="denda" className="gap-2">
            <AlertTriangle size={16} /> Denda
          </TabsTrigger>
          <TabsTrigger value="pusat-rumus" className="gap-2">
            <Beaker size={16} /> Pusat Rumus
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profil">
          <ProfilKoperasiSettings settings={settings} setSettings={setSettings} />
        </TabsContent>
        
        <TabsContent value="tenor">
          <TenorSettings settings={settings} setSettings={setSettings} />
        </TabsContent>
        
        <TabsContent value="bunga">
          <SukuBungaSettings settings={settings} setSettings={setSettings} />
        </TabsContent>
        
        <TabsContent value="denda">
          <DendaSettings settings={settings} setSettings={setSettings} />
        </TabsContent>
        
        <TabsContent value="pusat-rumus">
          <SHUSettings settings={settings} setSettings={setSettings} />
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
