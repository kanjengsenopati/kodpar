
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { getAllAnggota } from "@/services/anggotaService";
import { PenarikanFormEnhanced } from "@/components/transaksi/PenarikanFormEnhanced";

export default function PenarikanFormPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState([]);
  
  useEffect(() => {
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
  }, []);

  const handleSuccess = () => {
    toast({
      title: "Penarikan berhasil dibuat",
      description: "Data penarihan telah berhasil disimpan dan tersinkronisasi"
    });
    navigate("/transaksi/penarikan");
  };

  return (
    <Layout pageTitle="Tambah Penarikan">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/penarikan">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Tambah Penarikan Simpanan</h1>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <PenarikanFormEnhanced anggotaList={anggotaList} onSuccess={handleSuccess} />
        </CardContent>
      </Card>
    </Layout>
  );
}
