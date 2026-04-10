
import Layout from "@/components/layout/Layout";
import { usePembelian } from "@/hooks/usePembelian";

// Import the components
import { PembelianHeader } from "@/components/pembelian/PembelianHeader";
import { PembelianList } from "@/components/pembelian/PembelianList";
import { DeleteConfirmDialog } from "@/components/pembelian/DeleteConfirmDialog";
import { PembelianFormDialog } from "@/components/pembelian/PembelianFormDialog";
import { PembelianDetailDialog } from "@/components/pembelian/PembelianDetailDialog";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function PembelianPage() {
  const { 
    pembelianList,
    searchQuery,
    isFormOpen, 
    isDeleteDialogOpen, 
    isDetailDialogOpen, 
    currentPembelian,
    formData,
    pemasokList,
    handleSearch,
    openNewForm,
    openEditForm,
    openDeleteDialog,
    openDetailDialog,
    setIsFormOpen,
    setIsDeleteDialogOpen,
    setIsDetailDialogOpen,
    handleDelete,
    handleSave,
    handleCompletePurchase,
    setFormData,
    calculateTotal
  } = usePembelian();
  
  return (
    <Layout 
      pageTitle="Pembelian Barang"
      actions={
        <Button onClick={openNewForm} className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Tambah Pembelian
        </Button>
      }
    >
      <PembelianHeader 
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />
      
      <PembelianList 
        pembelianList={pembelianList}
        onViewDetail={openDetailDialog}
        onEdit={openEditForm}
        onDelete={openDeleteDialog}
      />
      
      {/* Form Dialog */}
      <PembelianFormDialog 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        currentPembelian={currentPembelian}
        formData={formData}
        setFormData={setFormData}
        pemasokList={pemasokList}
        calculateTotal={calculateTotal}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
      
      {/* Detail Dialog */}
      <PembelianDetailDialog 
        isOpen={isDetailDialogOpen}
        onClose={() => setIsDetailDialogOpen(false)}
        currentPembelian={currentPembelian}
        onComplete={handleCompletePurchase}
      />
    </Layout>
  );
}
