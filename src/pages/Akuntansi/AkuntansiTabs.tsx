
import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Receipt, BookOpen, FileBarChart } from "lucide-react";

// Import the individual components
import ChartOfAccountsContent from "@/components/akuntansi/tabs/ChartOfAccountsContent";
import JurnalUmumContent from "@/components/akuntansi/tabs/JurnalUmumContent";
import BukuBesarContent from "@/components/akuntansi/tabs/BukuBesarContent";
import LaporanKeuanganContent from "@/components/akuntansi/tabs/LaporanKeuanganContent";
import AkuntansiStatsCards from "@/components/akuntansi/AkuntansiStatsCards";

export default function AkuntansiTabs() {
  const [activeTab, setActiveTab] = useState("chart-of-accounts");

  return (
    <Layout pageTitle="Manajemen Akuntansi">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Manajemen Akuntansi KPRI
          </h1>
          <p className="text-muted-foreground">
            Kelola seluruh proses akuntansi dalam satu interface terpadu
          </p>
        </div>

        {/* Stats Cards Section */}
        <AkuntansiStatsCards />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="chart-of-accounts" className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              Chart of Accounts
            </TabsTrigger>
            <TabsTrigger value="jurnal-umum" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Jurnal Umum
            </TabsTrigger>
            <TabsTrigger value="buku-besar" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Buku Besar
            </TabsTrigger>
            <TabsTrigger value="laporan" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              Laporan Keuangan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chart-of-accounts">
            <ChartOfAccountsContent />
          </TabsContent>

          <TabsContent value="jurnal-umum">
            <JurnalUmumContent />
          </TabsContent>

          <TabsContent value="buku-besar">
            <BukuBesarContent />
          </TabsContent>

          <TabsContent value="laporan">
            <LaporanKeuanganContent />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
