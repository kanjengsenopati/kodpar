
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { PinjamanForm } from "@/components/transaksi/pinjaman-form";
import { getAnggotaList } from "@/services/anggotaService";
import { getTransaksiById } from "@/services/transaksiService";
import { Transaksi } from "@/types";

export default function PinjamEditForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState([]);
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Load anggota list
    const listAnggota = getAnggotaList();
    setAnggotaList(listAnggota);
    
    // Load transaction data
    if (id) {
      const loadedTransaksi = getTransaksiById(id);
      if (loadedTransaksi && loadedTransaksi.jenis === "Pinjam") {
        setTransaksi(loadedTransaksi);
      } else {
        toast({
          title: "Transaksi tidak ditemukan",
          description: "Data pinjaman tidak ditemukan atau bukan merupakan transaksi pinjaman",
          variant: "destructive"
        });
        navigate("/transaksi/pinjam");
      }
    }
    
    setIsLoading(false);
  }, [id, navigate, toast]);
  
  const handleSuccess = () => {
    toast({
      title: "Pinjaman berhasil diperbarui",
      description: "Data pinjaman telah berhasil diperbarui"
    });
    navigate("/transaksi/pinjam");
  };
  
  if (isLoading) {
    return (
      <Layout pageTitle="Memuat...">
        <div className="flex items-center justify-center h-64">
          <p>Memuat data pinjaman...</p>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout pageTitle="Edit Pinjaman">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/pinjam">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Edit Transaksi Pinjaman</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          {transaksi && (
            <PinjamanForm 
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
