
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getAnggotaList } from "@/services/anggotaService";
import { getTransaksiById, updateTransaksi } from "@/services/transaksiService";
import { AngsuranForm } from "@/components/transaksi/AngsuranForm";
import { Transaksi } from "@/types";

export default function AngsuranEditForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState([]);
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const listAnggota = await getAnggotaList();
        setAnggotaList(listAnggota);
        
        if (id) {
          const loadedTransaksi = await getTransaksiById(id);
          if (loadedTransaksi && loadedTransaksi.jenis === "Angsuran") {
            setTransaksi(loadedTransaksi);
          } else {
            toast({
              title: "Transaksi tidak ditemukan",
              description: "Data angsuran tidak ditemukan atau bukan merupakan transaksi angsuran",
              variant: "destructive"
            });
            navigate("/transaksi/angsuran");
          }
        }
      } catch (error) {
        console.error("Error loading angsuran edit data:", error);
        toast({
          title: "Kesalahan sistem",
          description: "Gagal memuat data angsuran",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [id, navigate, toast]);
  
  const handleSuccess = () => {
    toast({
      title: "Angsuran berhasil diperbarui",
      description: "Data angsuran telah berhasil diperbarui"
    });
    navigate("/transaksi/angsuran");
  };
  
  if (isLoading) {
    return (
      <Layout pageTitle="Memuat...">
        <div className="flex items-center justify-center h-64">
          <p>Memuat data angsuran...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout pageTitle="Edit Angsuran">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/angsuran">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Edit Transaksi Angsuran</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {transaksi && (
            <AngsuranForm 
              anggotaList={anggotaList} 
              initialData={transaksi}
              onSuccess={handleSuccess}
            />
          )}
        </CardContent>
      </Card>
    </Layout>
  );
}
