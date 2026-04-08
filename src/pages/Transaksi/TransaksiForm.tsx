
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { getAllAnggota } from "@/services/anggotaService";
import { SimpananForm } from "@/components/transaksi/SimpananForm";
import { PinjamanForm } from "@/components/transaksi/pinjaman-form";

export default function TransaksiForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [transaksiType, setTransaksiType] = useState<string>("simpan");
  const [anggotaList, setAnggotaList] = useState([]);
  
  useEffect(() => {
    // Load anggota from local storage
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
  }, []);

  const handleSimpananSuccess = () => {
    toast({
      title: "Simpanan berhasil dibuat",
      description: "Data simpanan telah berhasil disimpan"
    });
    navigate("/transaksi/simpan");
  };

  const handlePinjamanSuccess = () => {
    toast({
      title: "Pinjaman berhasil dibuat", 
      description: "Data pinjaman telah berhasil disimpan"
    });
    navigate("/transaksi/pinjam");
  };

  return (
    <Layout pageTitle="Transaksi Baru">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Buat Transaksi Baru</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <Tabs 
            defaultValue="simpan" 
            onValueChange={(value) => setTransaksiType(value)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="simpan">Simpanan</TabsTrigger>
              <TabsTrigger value="pinjam">Pinjaman</TabsTrigger>
            </TabsList>
            
            <TabsContent value="simpan">
              <SimpananForm anggotaList={anggotaList} onSuccess={handleSimpananSuccess} />
            </TabsContent>
            
            <TabsContent value="pinjam">
              <PinjamanForm anggotaList={anggotaList} onSuccess={handlePinjamanSuccess} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
}
