import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ProdukItem } from "@/types";
import {
  getAllProdukItems,
  createProdukItem,
  updateProdukItem,
  deleteProdukItem,
  updateProdukStock,
  initSampleProdukData
} from "@/services/produk";

export function useInventory() {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProdukItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load products on component mount
  useEffect(() => {
    initSampleProdukData(); // Initialize sample data if needed
    loadProducts();
  }, []);

  const loadProducts = () => {
    const allProducts = getAllProdukItems();
    setProducts(allProducts);
  };

  // Delete product
  const confirmDeleteProduct = async (productId: string) => {
    if (!productId) return;
    
    setIsSubmitting(true);
    try {
      const result = deleteProdukItem(productId);
      if (result) {
        toast({
          title: "Produk berhasil dihapus",
          description: "Produk telah dihapus dari inventori",
        });
        loadProducts();
        return true;
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      toast({
        title: "Gagal menghapus produk",
        description: "Terjadi kesalahan saat menghapus produk",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle stock adjustment
  const handleAdjustStock = async (productId: string, quantity: number) => {
    if (!productId) return false;
    
    setIsSubmitting(true);
    try {
      const result = updateProdukStock(productId, quantity);
      if (result) {
        toast({
          title: "Stok berhasil disesuaikan",
          description: `Stok produk telah ${quantity > 0 ? "ditambahkan" : "dikurangi"}`,
        });
        loadProducts();
        return true;
      } else {
        throw new Error("Failed to update stock");
      }
    } catch (error) {
      toast({
        title: "Gagal menyesuaikan stok",
        description: "Terjadi kesalahan saat memperbarui stok",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add or update product
  const handleSubmitProduct = async (productData: Omit<ProdukItem, "id" | "createdAt">, isEditing: boolean, productId?: string) => {
    setIsSubmitting(true);
    try {
      if (!isEditing) {
        // Add new product
        const newProduct = createProdukItem(productData);
        if (newProduct) {
          toast({
            title: "Produk berhasil ditambahkan",
            description: "Produk baru telah ditambahkan ke inventori",
          });
          loadProducts();
          return true;
        }
      } else if (isEditing && productId) {
        // Update existing product
        const updatedProduct = updateProdukItem(productId, productData);
        if (updatedProduct) {
          toast({
            title: "Produk berhasil diperbarui",
            description: "Informasi produk telah diperbarui",
          });
          loadProducts();
          return true;
        }
      }
      return false;
    } catch (error) {
      toast({
        title: "Gagal menyimpan produk",
        description: "Terjadi kesalahan saat menyimpan data produk",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    products,
    isSubmitting,
    loadProducts,
    confirmDeleteProduct,
    handleAdjustStock,
    handleSubmitProduct
  };
}
