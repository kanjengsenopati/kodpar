import { useState } from "react";
import { deleteAnggota } from "@/services/anggotaService";
import { resetAnggotaData } from "@/services/anggotaService";
import { resetTransaksiData } from "@/services/transaksiService";
import { resetAllSHUValues } from "@/services/transaksiService";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export function useAnggotaActions() {
  const [anggotaToDelete, setAnggotaToDelete] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isResetSHUConfirmOpen, setIsResetSHUConfirmOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeleteClick = (anggota: any) => {
    setAnggotaToDelete(anggota.id);
    setIsConfirmOpen(true);
  };

  const handleDeleteConfirm = (onRefresh: () => void) => {
    if (anggotaToDelete) {
      const success = deleteAnggota(anggotaToDelete);
      
      if (success) {
        toast({
          title: "Anggota berhasil dihapus",
          description: "Data anggota telah dihapus dari sistem",
        });
        onRefresh();
      } else {
        toast({
          title: "Gagal menghapus anggota",
          description: "Terjadi kesalahan saat menghapus data anggota",
          variant: "destructive",
        });
      }
      
      setIsConfirmOpen(false);
      setAnggotaToDelete(null);
    }
  };

  const handleResetDataClick = () => {
    setIsResetConfirmOpen(true);
  };

  const handleResetDataConfirm = (onRefresh: () => void) => {
    resetAnggotaData();
    resetTransaksiData();
    onRefresh();
    
    toast({
      title: "Data berhasil direset",
      description: "Data anggota dan transaksi telah direset ke nilai awal",
    });
    
    setIsResetConfirmOpen(false);
  };

  const handleResetSHUClick = () => {
    setIsResetSHUConfirmOpen(true);
  };

  const handleResetSHUConfirm = (onRefresh: () => void) => {
    try {
      const resetCount = resetAllSHUValues();
      onRefresh();
      
      toast({
        title: "SHU berhasil direset",
        description: `SHU untuk ${resetCount} anggota telah dihitung ulang berdasarkan formula terbaru`,
      });
    } catch (error) {
      console.error("Error resetting SHU values:", error);
      toast({
        title: "Gagal reset SHU",
        description: "Terjadi kesalahan saat mereset nilai SHU anggota",
        variant: "destructive",
      });
    }
    
    setIsResetSHUConfirmOpen(false);
  };

  const handleViewDetail = (id: string) => {
    navigate(`/master/anggota/${id}`);
  };

  const handleEdit = (id: string) => {
    navigate(`/master/anggota/edit/${id}`);
  };

  return {
    anggotaToDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    isResetConfirmOpen,
    setIsResetConfirmOpen,
    isResetSHUConfirmOpen,
    setIsResetSHUConfirmOpen,
    handleDeleteClick,
    handleDeleteConfirm,
    handleResetDataClick,
    handleResetDataConfirm,
    handleResetSHUClick,
    handleResetSHUConfirm,
    handleViewDetail,
    handleEdit
  };
}
