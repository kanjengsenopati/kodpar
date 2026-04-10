import React from "react";
import Layout from "@/components/layout/Layout";
import { useInventory } from "@/hooks/useInventory";
import { ProdukItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// Import the components
import { InventoryView } from "@/components/inventory/InventoryView";
import { ProductDetails } from "@/components/inventory/ProductDetails";
import { ProductForm } from "@/components/inventory/ProductForm";
import { ProductNotFound } from "@/components/inventory/ProductNotFound";
import { StockAdjustmentDialog } from "@/components/inventory/StockAdjustmentDialog";
import { DeleteConfirmDialog } from "@/components/inventory/DeleteConfirmDialog";
import { useInventoryUI } from "@/hooks/useInventoryUI";

export default function StokBarang() {
  // Custom hook for inventory management
  const { 
    products, 
    isSubmitting, 
    handleSubmitProduct, 
    confirmDeleteProduct,
    handleAdjustStock 
  } = useInventory();
  
  // Custom hook for UI state management
  const {
    viewMode,
    selectedProductId,
    selectedProduct,
    isStockDialogOpen,
    isDeleteDialogOpen,
    setViewMode,
    setIsStockDialogOpen,
    setIsDeleteDialogOpen,
    handleViewProduct,
    handleEditProduct,
    handleDeleteProduct
  } = useInventoryUI(products);

  // Handle form submission
  const handleFormSubmit = async (productData: Omit<ProdukItem, "id" | "createdAt">) => {
    const isEditing = viewMode === "edit";
    const success = await handleSubmitProduct(productData, isEditing, selectedProductId || undefined);
    
    if (success) {
      setViewMode("list");
    }
  };

  // Confirm delete product
  const handleConfirmDelete = async () => {
    if (!selectedProductId) return;
    
    const success = await confirmDeleteProduct(selectedProductId);
    if (success) {
      setIsDeleteDialogOpen(false);
      setViewMode("list");
    }
  };

  // Handle stock adjustment
  const handleStockAdjustment = async (quantity: number) => {
    if (!selectedProductId) return;
    
    const success = await handleAdjustStock(selectedProductId, quantity);
    if (success) {
      setIsStockDialogOpen(false);
    }
  };

  const renderContent = () => {
    switch (viewMode) {
      case "list":
        return (
          <InventoryView 
            products={products}
            onViewItem={handleViewProduct}
            onEditItem={handleEditProduct}
            onDeleteItem={handleDeleteProduct}
            onAddItem={() => setViewMode("add")}
          />
        );
      
      case "details":
        return selectedProduct ? (
          <ProductDetails
            product={selectedProduct}
            onEdit={() => setViewMode("edit")}
            onBack={() => setViewMode("list")}
            onAdjustStock={() => setIsStockDialogOpen(true)}
          />
        ) : (
          <ProductNotFound onBack={() => setViewMode("list")} />
        );
        
      case "add":
        return (
          <ProductForm
            isEditing={false}
            onSubmit={handleFormSubmit}
            onCancel={() => setViewMode("list")}
            isSubmitting={isSubmitting}
          />
        );
        
      case "edit":
        return selectedProduct ? (
          <ProductForm
            initialData={selectedProduct}
            isEditing={true}
            onSubmit={handleFormSubmit}
            onCancel={() => setViewMode("list")}
            isSubmitting={isSubmitting}
          />
        ) : (
          <ProductNotFound onBack={() => setViewMode("list")} />
        );
      default:
        return null;
    }
  };

  return (
    <Layout 
      pageTitle="Stok Barang"
      actions={
        viewMode === "list" ? (
          <Button onClick={() => setViewMode("add")}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Produk
          </Button>
        ) : null
      }
    >
      <div className="grid gap-6">
        {renderContent()}
        
        {/* Dialogs */}
        {selectedProduct && (
          <>
            <StockAdjustmentDialog
              open={isStockDialogOpen}
              onOpenChange={setIsStockDialogOpen}
              productName={selectedProduct.nama}
              currentStock={selectedProduct.stok}
              onAdjustStock={handleStockAdjustment}
              isSubmitting={isSubmitting}
            />
            
            <DeleteConfirmDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              productName={selectedProduct.nama}
              onConfirm={handleConfirmDelete}
              isSubmitting={isSubmitting}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
