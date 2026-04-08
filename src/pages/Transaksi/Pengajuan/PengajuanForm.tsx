
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getAllAnggota } from "@/services/anggotaService";
import { createPengajuan } from "@/services/pengajuanService";
import { PengajuanFormContent } from "@/components/pengajuan/PengajuanFormContent";
import { useToast } from "@/components/ui/use-toast";

export default function PengajuanForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [anggotaList, setAnggotaList] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialFormData = {
    tanggal: new Date().toISOString().split('T')[0],
    anggotaId: "",
    jenis: "Pinjam" as "Simpan" | "Pinjam", // Default to Pinjam
    kategori: "",
    jumlah: 0,
    keterangan: "",
    status: "Menunggu" as "Menunggu" | "Disetujui" | "Ditolak",
    dokumen: []
  };
  
  useEffect(() => {
    const loadedAnggota = getAllAnggota();
    setAnggotaList(loadedAnggota);
  }, []);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      console.log("Submitting pengajuan data:", formData);
      
      // Create the pengajuan using the service
      const newPengajuan = createPengajuan({
        tanggal: formData.tanggal,
        anggotaId: formData.anggotaId,
        jenis: formData.jenis,
        kategori: formData.kategori,
        jumlah: formData.jumlah,
        keterangan: formData.keterangan,
        status: formData.status,
        dokumen: formData.dokumen || []
      });

      if (newPengajuan) {
        console.log("Pengajuan created successfully:", newPengajuan);
        toast({
          title: "Pengajuan berhasil dibuat",
          description: `Pengajuan ${newPengajuan.id} telah disimpan dan akan diproses dalam 1-2 hari kerja`,
        });
        navigate("/transaksi/pengajuan");
      } else {
        throw new Error("Failed to create pengajuan");
      }
    } catch (error) {
      console.error("Error creating pengajuan:", error);
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal menyimpan pengajuan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout pageTitle="Tambah Pengajuan">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/transaksi/pengajuan">
          <Button variant="outline" size="icon">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="page-title">Tambah Pengajuan Pinjaman</h1>
      </div>
      
      <PengajuanFormContent
        isEditMode={false}
        initialFormData={initialFormData}
        anggotaList={anggotaList}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </Layout>
  );
}
