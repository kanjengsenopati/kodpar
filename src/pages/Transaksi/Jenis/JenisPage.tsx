
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { JenisPengajuanTab } from "./tabs/JenisPengajuanTab";
import { JenisSimpananTab } from "./tabs/JenisSimpananTab";
import { JenisPinjamanTab } from "./tabs/JenisPinjamanTab";

export default function JenisPage() {
  const [activeTab, setActiveTab] = useState("pengajuan");

  // Reset any open forms when switching tabs
  useEffect(() => {
    // Any cleanup or form reset logic could be added here
  }, [activeTab]);

  return (
    <Layout pageTitle="Jenis Transaksi">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Jenis Transaksi</h2>
          <p className="text-muted-foreground">
            Kelola berbagai jenis pengajuan, simpanan, dan pinjaman yang tersedia untuk anggota koperasi.
          </p>
        </div>

        <Tabs
          defaultValue="pengajuan"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="pengajuan">Jenis Pengajuan</TabsTrigger>
            <TabsTrigger value="simpanan">Jenis Simpanan</TabsTrigger>
            <TabsTrigger value="pinjaman">Jenis Pinjaman</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pengajuan" className="mt-0">
            <JenisPengajuanTab />
          </TabsContent>
          
          <TabsContent value="simpanan" className="mt-0">
            <JenisSimpananTab />
          </TabsContent>
          
          <TabsContent value="pinjaman" className="mt-0">
            <JenisPinjamanTab />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
