
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getAllAnggota } from "@/services/anggotaService";
import { getTransaksiById, updateTransaksi } from "@/services/transaksiService";
import { SimpananForm } from "@/components/transaksi/SimpananForm";
import { Transaksi } from "@/types";

export default function SimpanEditForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState([]);
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load anggota list
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
    
    // Load transaction data
    if (id) {
      console.log("Loading transaction with ID:", id);
      const loadedTransaksi = getTransaksiById(id);
      console.log("Loaded transaction:", loadedTransaksi);
      
      if (loadedTransaksi && loadedTransaksi.jenis === "Simpan") {
        setTransaksi(loadedTransaksi);
      } else {
        console.error("Transaction not found or not a Simpan transaction:", loadedTransaksi);
        toast({
          title: "Transaksi tidak ditemukan",
          description: "Data simpanan tidak ditemukan atau bukan merupakan transaksi simpanan",
          variant: "destructive"
        });
        navigate("/transaksi/simpan");
        return;
      }
    } else {
      console.error("No ID provided in URL params");
      toast({
        title: "ID transaksi tidak valid",
        description: "Parameter ID tidak ditemukan di URL",
        variant: "destructive"
      });
      navigate("/transaksi/simpan");
      return;
    }
    
    setIsLoading(false);
  }, [id, navigate, toast]);
  
  const handleSuccess = () => {
    toast({
      title: "Simpanan berhasil diperbarui",
      description: "Data simpanan telah berhasil diperbarui"
    });
    navigate("/transaksi/simpan");
  };
  
  if (isLoading) {
    return (
      <Layout pageTitle="Memuat...">
        <div className="flex items-center justify-center h-64">
          <p>Memuat data simpanan...</p>
        </div>
      </Layout>
    );
  }

  if (!transaksi) {
    return (
      <Layout pageTitle="Transaksi Tidak Ditemukan">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/transaksi/simpan">
            <Button variant="outline" size="icon">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          <h1 className="page-title">Transaksi Tidak Ditemukan</h1>
        </div>
        
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Transaksi simpanan dengan ID "{id}" tidak ditemukan atau bukan merupakan transaksi simpanan.
            </p>
            <Button asChild>
              <Link to="/transaksi/simpan">
                Kembali ke Daftar Simpanan
              </Link>
            </Button>
          </CardContent>
        </Card>
      </Layout>
    );
  }
  
  return (
    <Layout pageTitle="Edit Simpanan">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/simpan">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Edit Transaksi Simpanan</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <SimpananForm 
            anggotaList={anggotaList} 
            initialData={transaksi}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </Layout>
  );
}
