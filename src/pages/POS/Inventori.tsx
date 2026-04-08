import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Archive, Package, Plus, Search } from "lucide-react";
import { ProdukItem } from "@/types";
import { Input } from "@/components/ui/input";
import { getAllProdukItems, initSampleProdukData } from "@/services/produk";
import { InventoryList } from "@/components/inventory/InventoryList";

export default function Inventori() {
  const { toast } = useToast();
  const [products, setProducts] = useState<ProdukItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<ProdukItem[]>([]);

  // Load products on component mount
  useEffect(() => {
    initSampleProdukData(); // Initialize sample data if needed
    loadProducts();
  }, []);

  // Filter products when search query or products change
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProducts(products);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = products.filter(
        (product) =>
          product.nama.toLowerCase().includes(query) ||
          product.kode.toLowerCase().includes(query) ||
          product.kategori.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  const loadProducts = () => {
    const allProducts = getAllProdukItems();
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle view product (redirect to StokBarang with the product ID)
  const handleViewProduct = (id: string) => {
    window.location.href = `/pos/stok?id=${id}`;
  };

  return (
    <Layout pageTitle="Inventori">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Inventori</h2>
          <Button onClick={() => window.location.href = "/pos/stok"}>
            <Package className="mr-2 h-4 w-4" /> Kelola Stok
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-primary" />
                <CardTitle>Manajemen Inventori</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Cari produk..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-8"
                  />
                </div>
                <Button onClick={() => window.location.href = "/pos/stok?action=add"}>
                  <Plus className="mr-2 h-4 w-4" /> Tambah Produk
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Belum ada produk. Klik tombol 'Tambah Produk' untuk menambahkan produk baru.
                </AlertDescription>
              </Alert>
            ) : filteredProducts.length === 0 ? (
              <Alert>
                <AlertDescription>
                  Tidak ada produk yang cocok dengan pencarian Anda.
                </AlertDescription>
              </Alert>
            ) : (
              <InventoryList
                products={filteredProducts}
                onViewItem={handleViewProduct}
                onEditItem={(id) => window.location.href = `/pos/stok?id=${id}&action=edit`}
                onDeleteItem={(id) => window.location.href = `/pos/stok?id=${id}&action=delete`}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
