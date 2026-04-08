
import { useEffect } from "react";
import { useAnggotaData } from "@/hooks/anggota/useAnggotaData";
import { useAnggotaColumns } from "@/hooks/anggota/useAnggotaColumns";
import { useAnggotaActions } from "@/hooks/anggota/useAnggotaActions";
import { useAnggotaFilters } from "@/hooks/anggota/useAnggotaFilters";
import { useAnggotaCalculations } from "@/hooks/anggota/useAnggotaCalculations";
import { useAnggotaWatchers } from "@/hooks/anggota/useAnggotaWatchers";
import { runLoadDemoDataAction } from "@/services/seedDataService";
import { toast } from "sonner";

export function useAnggotaList() {
  // Use focused hooks
  const { anggotaList, refreshAnggotaList } = useAnggotaData();
  const { columns, handleToggleColumn } = useAnggotaColumns();
  const {
    anggotaToDelete,
    isConfirmOpen,
    setIsConfirmOpen,
    isResetConfirmOpen,
    setIsResetConfirmOpen,
    isResetSHUConfirmOpen,
    setIsResetSHUConfirmOpen,
    handleDeleteClick,
    handleDeleteConfirm: baseHandleDeleteConfirm,
    handleResetDataClick,
    handleResetDataConfirm: baseHandleResetDataConfirm,
    handleResetSHUClick,
    handleResetSHUConfirm: baseHandleResetSHUConfirm,
    handleViewDetail,
    handleEdit
  } = useAnggotaActions();
  const { searchQuery, setSearchQuery, viewMode, setViewMode, getFilteredAnggota } = useAnggotaFilters();
  const { 
    getTotalSimpanan, 
    getTotalPinjaman, 
    getTotalSHU, 
    getPetugas,
    isCalculating,
    performBulkCalculations 
  } = useAnggotaCalculations();
  
  // Initialize watchers with refresh callback
  useAnggotaWatchers(refreshAnggotaList);

  // Trigger bulk calculations when anggotaList changes
  useEffect(() => {
    if (anggotaList && anggotaList.length > 0) {
      performBulkCalculations(anggotaList);
    }
  }, [anggotaList, performBulkCalculations]);

  // Create wrapper functions that include the refresh callback
  const handleDeleteConfirm = () => baseHandleDeleteConfirm(refreshAnggotaList);
  const handleResetDataConfirm = () => baseHandleResetDataConfirm(refreshAnggotaList);
  const handleResetSHUConfirm = () => baseHandleResetSHUConfirm(refreshAnggotaList);

  const handleLoadDemoData = async () => {
    try {
      await runLoadDemoDataAction();
      toast.success("Data demo berhasil dimuat!");
      // Brief pause to let IndexedDB flush all bulkPut writes before re-read
      await new Promise((r) => setTimeout(r, 300));
      refreshAnggotaList();
      performBulkCalculations([]);
    } catch (error) {
      console.error("Error loading demo data:", error);
      toast.error("Gagal memuat data demo.");
    }
  };

  // Get filtered anggota
  const filteredAnggota = getFilteredAnggota(anggotaList);

  return {
    searchQuery,
    setSearchQuery,
    filteredAnggota,
    viewMode,
    setViewMode,
    columns,
    handleToggleColumn,
    isConfirmOpen,
    setIsConfirmOpen,
    anggotaToDelete,
    handleDeleteClick,
    handleDeleteConfirm,
    isResetConfirmOpen,
    setIsResetConfirmOpen,
    handleResetDataClick,
    handleResetDataConfirm,
    isResetSHUConfirmOpen,
    setIsResetSHUConfirmOpen,
    handleResetSHUClick,
    handleResetSHUConfirm,
    handleLoadDemoData,
    getTotalSimpanan,
    getTotalPinjaman,
    getTotalSHU,
    getPetugas,
    isCalculating,
    handleViewDetail,
    handleEdit,
  };
}
