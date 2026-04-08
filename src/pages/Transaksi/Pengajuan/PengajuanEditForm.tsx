
import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getAllAnggota } from "@/services/anggotaService";
import { getPengajuanById, updatePengajuan } from "@/services/pengajuanService";
import { PengajuanFormContent } from "@/components/pengajuan/PengajuanFormContent";
import { useToast } from "@/components/ui/use-toast";
import { Pengajuan } from "@/types";

export default function PengajuanEditForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState([]);
  const [pengajuan, setPengajuan] = useState<Pengajuan | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
    
    if (id) {
      const loadedPengajuan = getPengajuanById(id);
      if (loadedPengajuan) {
        setPengajuan(loadedPengajuan);
      } else {
        toast({
          title: "Pengajuan tidak ditemukan",
          description: "Data pengajuan tidak ditemukan atau telah dihapus",
          variant: "destructive",
        });
        navigate("/transaksi/pengajuan");
      }
    }
    
    setIsLoading(false);
  }, [id, navigate, toast]);

  const handleSubmit = async (formData: any) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      console.log("Updating pengajuan data:", formData);
      
      const updatedPengajuan = updatePengajuan(id, {
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jenis: formData.jenis,
        kategori: formData.kategori,
        jumlah: formData.jumlah,
        keterangan: formData.keterangan,
        status: formData.status,
        dokumen: formData.dokumen || []
      });

      if (updatedPengajuan) {
        console.log("Pengajuan updated successfully:", updatedPengajuan);
        toast({
          title: "Pengajuan berhasil diperbarui",
          description: `Pengajuan ${updatedPengajuan.id} telah diperbarui`,
        });
        navigate("/transaksi/pengajuan");
      } else {
        throw new Error("Failed to update pengajuan");
      }
    } catch (error) {
      console.error("Error updating pengajuan:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal memperbarui pengajuan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout pageTitle="Memuat...">
        <div className="flex items-center justify-center h-64">
          <p>Memuat data pengajuan...</p>
        </div>
      </Layout>
    );
  }

  if (!pengajuan) {
    return (
      <Layout pageTitle="Edit Pengajuan">
        <div className="flex items-center justify-center h-64">
          <p>Data pengajuan tidak ditemukan</p>
        </div>
      </Layout>
    );
  }

  const initialFormData = {
    tanggal: pengajuan.tanggal,
    anggotaId: pengajuan.anggotaId,
    jenis: pengajuan.jenis,
    kategori: pengajuan.kategori,
    jumlah: pengajuan.jumlah,
    keterangan: pengajuan.keterangan || "",
    status: pengajuan.status,
    dokumen: pengajuan.dokumen || []
  };

  return (
    <Layout pageTitle="Edit Pengajuan">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/pengajuan">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Edit Pengajuan #{pengajuan.id}</h1>
      </div>
      
      <PengajuanFormContent
        isEditMode={true}
        id={pengajuan.id}
        initialFormData={initialFormData}
        anggotaList={anggotaList}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Layout>
  );
}
