
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Plus } from "lucide-react";
import { InventoryList } from "@/components/inventory/InventoryList";
import { ProdukItem } from "@/types";

interface InventoryViewProps {
  products: ProdukItem[];
  onViewItem: (id: string) => void;
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: () => void;
}

export function InventoryView({
  products,
  onViewItem,
  onEditItem,
  onDeleteItem,
  onAddItem
}: InventoryViewProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <CardTitle>Manajemen Stok Barang</CardTitle>
          </div>
          <Button onClick={onAddItem}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Produk
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {products.length === 0 ? (
          <Alert>
            <AlertDescription>
              Belum ada produk. Klik tombol 'Tambah Produk' untuk menambahkan produk baru.
            </AlertDescription>
          </Alert>
        ) : (
          <InventoryList
            products={products}
            onViewItem={onViewItem}
            onEditItem={onEditItem}
            onDeleteItem={onDeleteItem}
          />
        )}
      </CardContent>
    </Card>
  );
}
