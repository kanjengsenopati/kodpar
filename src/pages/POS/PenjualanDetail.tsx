
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { Penjualan } from "@/types";
import { getPenjualanById, updatePenjualan } from "@/services/penjualan";
import { getProdukItemById } from "@/services/produk";
import { getKasirById, getAllKasir } from "@/services/kasirService";

// Import refactored components
import { TransactionInfoCard } from "@/components/pos/detail/TransactionInfoCard";
import { ReceiptCard } from "@/components/pos/detail/ReceiptCard";
import { ItemsTable } from "@/components/pos/detail/ItemsTable";
import { EditTransactionDialog } from "@/components/pos/detail/EditTransactionDialog";
import { StatusDialog } from "@/components/pos/detail/StatusDialog";
import { DetailPageHeader } from "@/components/pos/detail/DetailPageHeader";
import { LoadingState } from "@/components/pos/detail/LoadingState";

export default function PenjualanDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [penjualan, setPenjualan] = useState<Penjualan | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editForm, setEditForm] = useState({
    catatan: "",
    kasirId: ""
  });
  
  // Fetch data on component mount
  useEffect(() => {
    if (id) {
      const foundPenjualan = getPenjualanById(id);
      if (foundPenjualan) {
        setPenjualan(foundPenjualan);
        setEditForm({
          catatan: foundPenjualan.catatan || "",
          kasirId: foundPenjualan.kasirId
        });
      } else {
        toast({
          title: "Data tidak ditemukan",
          description: "Transaksi penjualan tidak ditemukan",
          variant: "destructive"
        });
        navigate("/pos/penjualan-list");
      }
    }
  }, [id, navigate, toast]);
  
  // Helper functions
  const getProductName = (productId: string): string => {
    const product = getProdukItemById(productId);
    return product ? product.nama : "Produk tidak ditemukan";
  };
  
  const getProductCode = (productId: string): string => {
    const product = getProdukItemById(productId);
    return product ? product.kode : "";
  };
  
  const getKasirName = (kasirId: string): string => {
    const kasir = getKasirById(kasirId);
    return kasir ? kasir.nama : "Kasir tidak ditemukan";
  };
  
  // Event handlers
  const handleEditSubmit = () => {
    if (!penjualan || !id) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedPenjualan = updatePenjualan(id, {
        catatan: editForm.catatan,
        kasirId: editForm.kasirId
      });
      
      if (updatedPenjualan) {
        setPenjualan(updatedPenjualan);
        toast({
          title: "Transaksi berhasil diperbarui",
          description: "Data transaksi telah diperbarui"
        });
        setIsEditDialogOpen(false);
      } else {
        throw new Error("Gagal memperbarui transaksi");
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal memperbarui data transaksi",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleStatusChange = (newStatus: "sukses" | "dibatalkan") => {
    if (!penjualan || !id) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedPenjualan = updatePenjualan(id, {
        status: newStatus
      });
      
      if (updatedPenjualan) {
        setPenjualan(updatedPenjualan);
        toast({
          title: "Status berhasil diperbarui",
          description: `Status transaksi diubah menjadi ${newStatus === "sukses" ? "Sukses" : "Dibatalkan"}`
        });
        setIsStatusDialogOpen(false);
      } else {
        throw new Error("Gagal memperbarui status");
      }
    } catch (error) {
      toast({
        title: "Terjadi kesalahan",
        description: "Gagal memperbarui status transaksi",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handlePrintReceipt = () => {
    toast({
      title: "Cetak Struk",
      description: "Fitur cetak struk akan segera tersedia"
    });
  };
  
  // Show loading state if data is not yet loaded
  if (!penjualan) {
    return <LoadingState pageTitle="Detail Penjualan" />;
  }
  
  return (
    <Layout pageTitle={`Detail Penjualan - ${penjualan.nomorTransaksi}`}>
      <DetailPageHeader title="Detail Penjualan" backLink="/pos/penjualan-list" />
      
      {/* Transaction Info and Receipt Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <TransactionInfoCard 
          penjualan={penjualan}
          getKasirName={getKasirName}
          onEditClick={() => setIsEditDialogOpen(true)}
          onPrintReceipt={handlePrintReceipt}
          onStatusClick={() => setIsStatusDialogOpen(true)}
        />
        
        <ReceiptCard 
          penjualan={penjualan}
          getKasirName={getKasirName}
          getProductName={getProductName}
        />
      </div>
      
      {/* Items Table */}
      <ItemsTable 
        items={penjualan.items}
        subtotal={penjualan.subtotal}
        getProductName={getProductName}
        getProductCode={getProductCode}
      />
      
      {/* Dialogs */}
      <EditTransactionDialog 
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editForm={editForm}
        setEditForm={setEditForm}
        kasirList={getAllKasir()}
        onSubmit={handleEditSubmit}
        isSubmitting={isSubmitting}
      />
      
      <StatusDialog 
        open={isStatusDialogOpen}
        onOpenChange={setIsStatusDialogOpen}
        currentStatus={penjualan.status}
        onStatusChange={handleStatusChange}
        isSubmitting={isSubmitting}
      />
    </Layout>
  );
}
