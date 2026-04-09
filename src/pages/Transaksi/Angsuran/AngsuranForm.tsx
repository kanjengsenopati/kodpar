
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { getAllAnggota } from "@/services/anggotaService";
import { AngsuranForm } from "@/components/transaksi/AngsuranForm";

export default function AngsuranFormPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedAnggota = await getAllAnggota();
        setAnggotaList(loadedAnggota || []);
      } catch (error) {
        console.error("Failed to load anggota for angsuran form:", error);
        toast({
          title: "Gagal memuat data",
          description: "Tidak dapat mengambil data anggota",
          variant: "destructive",
        });
      }
    };
    
    loadData();
  }, [toast]);

  const handleSuccess = () => {
    navigate("/transaksi/angsuran");
  };

  return (
    <Layout pageTitle="Tambah Angsuran">
      <div className="mb-6">
        <h1 className="page-title">Tambah Angsuran</h1>
        <p className="text-muted-foreground">
          Buat transaksi angsuran baru untuk anggota
        </p>
      </div>

      <AngsuranForm 
        anggotaList={anggotaList}
        onSuccess={handleSuccess}
      />
    </Layout>
  );
}
