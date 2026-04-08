
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { getAllTransaksi } from "@/services/transaksiService";
import { getPengajuanList } from "@/services/pengajuanService";
import { Transaksi, Pengajuan } from "@/types";
import { TransaksiDashboard } from "@/components/transaksi/TransaksiDashboard";

export default function TransaksiList() {
  const navigate = useNavigate();
  const [transaksiList, setTransaksiList] = useState<Transaksi[]>([]);
  const [pengajuanList, setPengajuanList] = useState<Pengajuan[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // Load data on mount
  useEffect(() => {
    const loadedTransaksi = getAllTransaksi();
    const loadedPengajuan = getPengajuanList();
    
    setTransaksiList(loadedTransaksi);
    setPengajuanList(loadedPengajuan);
  }, []);
  
  // Extract summaries from data
  const simpananCount = transaksiList.filter(t => t.jenis === "Simpan").length;
  const pinjamanCount = transaksiList.filter(t => t.jenis === "Pinjam").length;
  const angsuranCount = transaksiList.filter(t => t.jenis === "Angsuran").length;
  const pengajuanCount = pengajuanList.length;
  const pendingPengajuanCount = pengajuanList.filter(p => p.status === "Menunggu").length;
  
  // Calculate total amounts
  const totalSimpanan = transaksiList
    .filter(t => t.jenis === "Simpan" && t.status === "Sukses")
    .reduce((sum, t) => sum + t.jumlah, 0);
    
  const totalPinjaman = transaksiList
    .filter(t => t.jenis === "Pinjam" && t.status === "Sukses")
    .reduce((sum, t) => sum + t.jumlah, 0);
    
  const totalAngsuran = transaksiList
    .filter(t => t.jenis === "Angsuran" && t.status === "Sukses")
    .reduce((sum, t) => sum + t.jumlah, 0);
  
  // Get recent transactions
  const recentTransaksi = [...transaksiList]
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 5);
  
  // Get recent applications
  const recentPengajuan = [...pengajuanList]
    .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime())
    .slice(0, 5);
  
  return (
    <Layout pageTitle="Daftar Transaksi">
      <div className="flex justify-between items-center mb-6">
        <h1 className="page-title">Manajemen Transaksi</h1>
        
        <div className="flex gap-2">
          <Button onClick={() => navigate("/transaksi/pengajuan/tambah")}>
            Tambah Pengajuan
          </Button>
          <Button onClick={() => navigate("/transaksi/simpan/tambah")}>
            Tambah Simpanan
          </Button>
          <Button onClick={() => navigate("/transaksi/pinjam/tambah")}>
            Tambah Pinjaman
          </Button>
          <Button onClick={() => navigate("/transaksi/angsuran/tambah")}>
            Tambah Angsuran
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="simpanan">
            Simpanan ({simpananCount})
          </TabsTrigger>
          <TabsTrigger value="pinjaman">
            Pinjaman ({pinjamanCount})
          </TabsTrigger>
          <TabsTrigger value="angsuran">
            Angsuran ({angsuranCount})
          </TabsTrigger>
          <TabsTrigger value="pengajuan">
            Pengajuan {pendingPengajuanCount > 0 && `(${pendingPengajuanCount})`}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard">
          <TransaksiDashboard
            totalSimpanan={totalSimpanan}
            totalPinjaman={totalPinjaman}
            totalAngsuran={totalAngsuran}
            pendingPengajuan={pendingPengajuanCount}
            recentTransaksi={recentTransaksi}
            recentPengajuan={recentPengajuan}
            onNavigateToSimpanan={() => setActiveTab("simpanan")}
            onNavigateToPinjaman={() => setActiveTab("pinjaman")}
            onNavigateToAngsuran={() => setActiveTab("angsuran")}
            onNavigateToPengajuan={() => setActiveTab("pengajuan")}
          />
        </TabsContent>
        
        <TabsContent value="simpanan">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Daftar Simpanan</h2>
              <Button onClick={() => navigate("/transaksi/simpan")}>
                Kelola Simpanan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pinjaman">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Daftar Pinjaman</h2>
              <Button onClick={() => navigate("/transaksi/pinjam")}>
                Kelola Pinjaman
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="angsuran">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Daftar Angsuran</h2>
              <Button onClick={() => navigate("/transaksi/angsuran")}>
                Kelola Angsuran
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pengajuan">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Daftar Pengajuan</h2>
              <Button onClick={() => navigate("/transaksi/pengajuan")}>
                Kelola Pengajuan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
