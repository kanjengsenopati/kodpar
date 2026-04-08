
import Layout from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { AnggotaGridView } from "@/components/anggota/AnggotaGridView";
import { useAnggotaList } from "@/hooks/useAnggotaList";
import { useAnggotaListSync } from "@/hooks/useAnggotaListSync";
import { AnggotaListFilters } from "@/components/anggota/list/AnggotaListFilters";
import { AnggotaTableView } from "@/components/anggota/list/AnggotaTableView";
import { AnggotaListHeader } from "@/components/anggota/list/AnggotaListHeader";
import { DeleteConfirmDialog, ResetConfirmDialog, ResetSHUDialog } from "@/components/anggota/list/ConfirmationDialogs";
import { Loader2 } from "lucide-react";

export default function AnggotaList() {
  // Menggunakan hook baru untuk real-time sync anggota list
  const { anggotaList: syncedAnggotaList } = useAnggotaListSync();
  
  const {
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
  } = useAnggotaList();

  // Use synced anggota list instead of the original one for better real-time consistency
  const displayAnggotaList = syncedAnggotaList.length > 0 ? syncedAnggotaList : filteredAnggota;

  return (
    <Layout pageTitle="Data Anggota">
      <AnggotaListHeader 
        onResetData={handleResetDataClick}
        onResetSHU={handleResetSHUClick}
        onLoadDemoData={handleLoadDemoData}
      />
      
      <Card>
        <CardContent className="p-0">
          <AnggotaListFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
            columns={columns}
            onToggleColumn={handleToggleColumn}
          />
          
          {isCalculating ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
              <p className="text-slate-500 font-medium">Menghitung data keuangan anggota...</p>
            </div>
          ) : viewMode === "table" ? (
            <AnggotaTableView 
              anggotaList={displayAnggotaList}
              columns={columns}
              getTotalSimpanan={getTotalSimpanan}
              getTotalPinjaman={getTotalPinjaman}
              getTotalSHU={getTotalSHU}
              getPetugas={getPetugas}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ) : (
            <div className="p-6">
              <AnggotaGridView 
                anggota={displayAnggotaList} 
                onViewDetail={handleViewDetail}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                getTotalSimpanan={getTotalSimpanan}
                getTotalPinjaman={getTotalPinjaman}
              />
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Confirmation Dialogs */}
      <DeleteConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
      
      <ResetConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetDataConfirm}
      />
      
      <ResetSHUDialog
        isOpen={isResetSHUConfirmOpen}
        onClose={() => setIsResetSHUConfirmOpen(false)}
        onConfirm={handleResetSHUConfirm}
      />
    </Layout>
  );
}
