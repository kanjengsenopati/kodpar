
import { useAnggotaData } from "@/hooks/anggota/useAnggotaData";
import { useAnggotaColumns } from "@/hooks/anggota/useAnggotaColumns";
import { useAnggotaActions } from "@/hooks/anggota/useAnggotaActions";
import { useAnggotaFilters } from "@/hooks/anggota/useAnggotaFilters";
import { useAnggotaCalculations } from "@/hooks/anggota/useAnggotaCalculations";
import { useAnggotaWatchers } from "@/hooks/anggota/useAnggotaWatchers";

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
  const { getTotalSimpanan, getTotalPinjaman, getTotalSHU, getPetugas } = useAnggotaCalculations();
  
  // Initialize watchers with refresh callback
  useAnggotaWatchers(refreshAnggotaList);

  // Create wrapper functions that include the refresh callback
  const handleDeleteConfirm = () => baseHandleDeleteConfirm(refreshAnggotaList);
  const handleResetDataConfirm = () => baseHandleResetDataConfirm(refreshAnggotaList);
  const handleResetSHUConfirm = () => baseHandleResetSHUConfirm(refreshAnggotaList);

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
    getTotalSimpanan,
    getTotalPinjaman,
    getTotalSHU,
    getPetugas,
    handleViewDetail,
    handleEdit,
  };
}
