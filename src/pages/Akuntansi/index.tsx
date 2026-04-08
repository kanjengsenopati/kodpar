
import React from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileText, 
  TrendingUp, 
  BarChart3, 
  Calculator,
  RefreshCw,
  Database,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RealTimeSyncStatus } from "@/components/common/RealTimeSyncStatus";

export default function Akuntansi() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Jurnal Umum",
      description: "Kelola jurnal entry dan transaksi akuntansi dengan SAK ETAP compliance",
      icon: <FileText className="h-8 w-8" />,
      href: "/akuntansi/jurnal",
      color: "bg-blue-500"
    },
    {
      title: "Buku Besar",
      description: "Lihat buku besar untuk setiap akun dengan detail transaksi",
      icon: <BookOpen className="h-8 w-8" />,
      href: "/akuntansi/buku-besar",
      color: "bg-green-500"
    },
    {
      title: "Laporan Keuangan",
      description: "Generate laporan keuangan: Neraca, Laba Rugi, Arus Kas",
      icon: <BarChart3 className="h-8 w-8" />,
      href: "/akuntansi/laporan",
      color: "bg-purple-500"
    }
  ];

  return (
    <Layout pageTitle="Manajemen Akuntansi">
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manajemen Akuntansi</h1>
            <p className="text-muted-foreground">
              Sistem akuntansi terintegrasi dengan sinkronisasi real-time dan SAK ETAP compliance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              <Zap className="h-4 w-4" />
              Real-time Sync Aktif
            </div>
          </div>
        </div>

        {/* Real-time Sync Status */}
        <RealTimeSyncStatus />

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6 flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <RefreshCw className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Auto-Sync</h3>
                <p className="text-sm text-green-600">Transaksi otomatis tersinkronisasi</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6 flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Calculator className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">SAK ETAP</h3>
                <p className="text-sm text-blue-600">Standar akuntansi koperasi</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-6 flex items-center space-x-3">
              <div className="bg-purple-100 p-3 rounded-full">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-purple-800">Integrated</h3>
                <p className="text-sm text-purple-600">Terintegrasi dengan semua modul</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Menu */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <Card 
              key={item.title} 
              className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-primary/20"
              onClick={() => navigate(item.href)}
            >
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className={`${item.color} text-white p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                    {item.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground mb-4">
                  {item.description}
                </CardDescription>
                <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Akses Module
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Integration Info */}
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-800 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Integrasi Real-time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700">
              <div>
                <h4 className="font-semibold mb-2">Sinkronisasi Otomatis:</h4>
                <ul className="space-y-1">
                  <li>• Transaksi Simpanan → Jurnal Ekuitas/Liabilitas</li>
                  <li>• Transaksi Pinjaman → Jurnal Piutang</li>
                  <li>• Angsuran → Alokasi Pokok & Jasa</li>
                  <li>• Penarikan → Jurnal Pengurangan Simpanan</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Integrasi Modul:</h4>
                <ul className="space-y-1">
                  <li>• Transaksi Koperasi ↔ Akuntansi</li>
                  <li>• Keuangan ↔ Akuntansi</li>
                  <li>• Pengajuan → Auto Journal</li>
                  <li>• Real-time Dashboard Updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
