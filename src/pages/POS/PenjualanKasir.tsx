
import { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { ProductSection } from "@/components/pos/ProductSection";
import { CartSection } from "@/components/pos/CartSection";
import { SuccessDialog } from "@/components/pos/SuccessDialog";
import { getAllKasir, initSampleKasirData } from "@/services/kasirService";
import { initSampleProdukData } from "@/services/produk";
import { initSamplePenjualanData } from "@/services/penjualan";
import { usePenjualan } from "@/hooks/usePenjualan";

export default function PenjualanKasir() {
  const {
    products,
    cartItems,
    showSuccessDialog,
    completedSale,
    isProcessing,
    loadProducts,
    handleAddToCart,
    handleUpdateQuantity,
    handleRemoveFromCart,
    handleClearCart,
    handleCheckout,
    setShowSuccessDialog
  } = usePenjualan();
  
  // Load initial data
  useEffect(() => {
    // Initialize all sample data
    initSampleProdukData();
    initSampleKasirData();
    initSamplePenjualanData();
    
    // Add sample restaurant images to products
    loadProducts();
  }, []);
  
  return (
    <Layout pageTitle="Penjualan Kasir">
      <div className="px-5 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <ProductSection 
              products={products}
              onAddToCart={handleAddToCart}
            />
          </div>
          
          {/* Cart Section */}
          <div className="lg:col-span-1">
            <CartSection
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemove={handleRemoveFromCart}
              onClear={handleClearCart}
              onCheckout={handleCheckout}
              kasirList={getAllKasir()}
              processing={isProcessing}
            />
          </div>
        </div>
      </div>
      
      {/* Success Dialog */}
      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={setShowSuccessDialog}
        sale={completedSale}
      />
    </Layout>
  );
}
