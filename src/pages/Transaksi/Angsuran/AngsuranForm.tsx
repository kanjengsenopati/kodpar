
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { getAllAnggota } from "@/services/anggotaService";
import { getAnggotaWithActiveLoans } from "@/services/transaksi/loanOperations";
import { AngsuranForm } from "@/components/transaksi/AngsuranForm";

export default function AngsuranFormPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [allAnggota, activeLoanAnggotaIds] = await Promise.all([
          getAllAnggota(),
          getAnggotaWithActiveLoans()
        ]);
        
        // Filter members who have active loans
        const filteredAnggota = allAnggota.filter(a => activeLoanAnggotaIds.includes(a.id));
        setAnggotaList(filteredAnggota || []);
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
  }, [toast, refreshKey]);

  const handleSuccess = () => {
    // Increment refreshKey to reload anggota list (some might have finished their loans)
    setRefreshKey(prev => prev + 1);
    // We stay on the page for "auto update" experience, unless the user manually goes back
    // The form itself should handle internal state reset
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
