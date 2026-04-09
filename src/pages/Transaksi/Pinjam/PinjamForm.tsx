
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { PinjamanForm } from "@/components/transaksi/pinjaman-form";
import { getAnggotaList } from "@/services/anggotaService";

export default function PinjamForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState([]);
  
  useEffect(() => {
    // Load anggota list on component mount
    const loadData = async () => {
      try {
        const listAnggota = await getAnggotaList();
        setAnggotaList(listAnggota);
      } catch (error) {
        console.error("Error loading anggota list:", error);
      }
    };
    
    loadData();
  }, []);
  
  const handleSuccess = () => {
    toast({
      title: "Pinjaman berhasil dibuat",
      description: "Data pinjaman telah berhasil disimpan"
    });
    navigate("/transaksi/pinjam");
  };
  
  return (
    <Layout pageTitle="Tambah Pinjaman Baru">
      <PinjamanForm anggotaList={anggotaList} onSuccess={handleSuccess} />
    </Layout>
  );
}
