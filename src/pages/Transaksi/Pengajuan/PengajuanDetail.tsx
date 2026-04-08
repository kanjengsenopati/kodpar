
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { getPengajuanById, updatePengajuan, deletePengajuan, approvePengajuan, rejectPengajuan } from "@/services/pengajuanService";
import { getAnggotaById } from "@/services/anggotaService";
import { Anggota, Pengajuan } from "@/types";
import { PengajuanHeader } from "@/components/pengajuan/PengajuanHeader";
import { PengajuanDetailCard } from "@/components/pengajuan/PengajuanDetailCard";
import { PengajuanActionCard } from "@/components/pengajuan/PengajuanActionCard";
import { DeletePengajuanDialog } from "@/components/pengajuan/DeletePengajuanDialog";
import { StatusUpdateDialog } from "@/components/pengajuan/StatusUpdateDialog";
import { formatDate, formatCurrency } from "@/utils/formatters";

export default function PengajuanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [pengajuan, setPengajuan] = useState<Pengajuan | null>(null);
  const [anggota, setAnggota] = useState<Anggota | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<"Menunggu" | "Disetujui" | "Ditolak" | "">("");

  useEffect(() => {
    if (id) {
      const pengajuanData = getPengajuanById(id);
      if (pengajuanData) {
        setPengajuan(pengajuanData);
        
        // Load anggota data
        const anggotaData = getAnggotaById(pengajuanData.anggotaId);
        if (anggotaData) {
          setAnggota(anggotaData);
        }
      } else {
        toast({
          title: "Data tidak ditemukan",
          description: `Pengajuan dengan ID ${id} tidak ditemukan`,
          variant: "destructive",
        });
        navigate("/transaksi/pengajuan");
      }
    }
    setLoading(false);
  }, [id, navigate, toast]);

  const handleDelete = () => {
    if (id) {
      const success = deletePengajuan(id);
      if (success) {
        toast({
          title: "Pengajuan berhasil dihapus",
          description: `Pengajuan dengan ID ${id} telah dihapus dari sistem`,
        });
        navigate("/transaksi/pengajuan");
      } else {
        toast({
          title: "Gagal menghapus pengajuan",
          description: "Terjadi kesalahan saat menghapus data pengajuan",
          variant: "destructive",
        });
      }
      setIsDeleteDialogOpen(false);
    }
  };

  const handleUpdateStatus = (status: "Menunggu" | "Disetujui" | "Ditolak") => {
    if (id && pengajuan) {
      let success;
      
      if (status === "Disetujui") {
        success = approvePengajuan(id);
        if (success) {
          toast({
            title: "Pengajuan disetujui",
            description: `Pengajuan telah disetujui dan transaksi baru telah dibuat`,
          });
        }
      } else if (status === "Ditolak") {
        success = rejectPengajuan(id);
        if (success) {
          toast({
            title: "Pengajuan ditolak",
            description: `Pengajuan telah ditandai sebagai ditolak`,
          });
        }
      } else {
        success = updatePengajuan(id, { status });
        if (success) {
          toast({
            title: "Status berhasil diperbarui",
            description: `Status pengajuan telah diubah menjadi ${status}`,
          });
        }
      }
      
      if (success) {
        // Refresh pengajuan data
        const updatedPengajuan = getPengajuanById(id);
        if (updatedPengajuan) {
          setPengajuan(updatedPengajuan);
        }
      } else {
        toast({
          title: "Gagal memperbarui status",
          description: "Terjadi kesalahan saat memperbarui status pengajuan",
          variant: "destructive",
        });
      }
      setIsStatusDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Layout pageTitle="Detail Pengajuan">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Memuat data...</p>
        </div>
      </Layout>
    );
  }

  if (!pengajuan) {
    return (
      <Layout pageTitle="Detail Pengajuan">
        <div className="flex justify-center items-center h-[50vh]">
          <p>Data pengajuan tidak ditemukan</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout pageTitle="Detail Pengajuan">
      <PengajuanHeader 
        id={pengajuan.id} 
        onDeleteClick={() => setIsDeleteDialogOpen(true)} 
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PengajuanDetailCard 
            pengajuan={pengajuan}
            anggota={anggota}
            formatDate={formatDate}
            formatCurrency={formatCurrency}
          />
        </div>

        <div>
          <PengajuanActionCard 
            status={pengajuan.status}
            onApprove={() => {
              setNewStatus("Disetujui");
              setIsStatusDialogOpen(true);
            }}
            onReject={() => {
              setNewStatus("Ditolak");
              setIsStatusDialogOpen(true);
            }}
            onChangeStatus={() => {
              setNewStatus(pengajuan.status as "Menunggu" | "Disetujui" | "Ditolak");
              setIsStatusDialogOpen(true);
            }}
          />
        </div>
      </div>

      <DeletePengajuanDialog 
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
      />

      <StatusUpdateDialog 
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        onConfirm={handleUpdateStatus}
        currentStatus={pengajuan.status}
      />
    </Layout>
  );
}
