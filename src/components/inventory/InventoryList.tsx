
import React, { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { ProdukItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TableColumnToggle } from "@/components/ui/table-column-toggle";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Package, Trash2 } from "lucide-react";

interface InventoryListProps {
  products: ProdukItem[];
  onViewItem: (id: string) => void;
  onEditItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
}

export function InventoryList({
  products,
  onViewItem,
  onEditItem,
  onDeleteItem,
}: InventoryListProps) {
  const [columns, setColumns] = useState([
    { id: "kode", label: "Kode", isVisible: true },
    { id: "nama", label: "Nama Produk", isVisible: true },
    { id: "kategori", label: "Kategori", isVisible: true },
    { id: "hargaBeli", label: "Harga Beli", isVisible: true },
    { id: "hargaJual", label: "Harga Jual", isVisible: true },
    { id: "stok", label: "Stok", isVisible: true },
    { id: "actions", label: "Aksi", isVisible: true },
  ]);

  const handleToggleColumn = (columnId: string) => {
    setColumns(
      columns.map((column) => 
        column.id === columnId
          ? { ...column, isVisible: !column.isVisible }
          : column
      )
    );
  };

  const isColumnVisible = (columnId: string) => {
    return columns.find((column) => column.id === columnId)?.isVisible || false;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Daftar Barang</h3>
        <TableColumnToggle columns={columns} onToggleColumn={handleToggleColumn} />
      </div>
      
      <div className="rounded-md border">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No</TableHead>
                {isColumnVisible("kode") && <TableHead>Kode</TableHead>}
                {isColumnVisible("nama") && <TableHead>Nama Produk</TableHead>}
                {isColumnVisible("kategori") && <TableHead>Kategori</TableHead>}
                {isColumnVisible("hargaBeli") && (
                  <TableHead className="text-right">Harga Beli</TableHead>
                )}
                {isColumnVisible("hargaJual") && (
                  <TableHead className="text-right">Harga Jual</TableHead>
                )}
                {isColumnVisible("stok") && (
                  <TableHead className="text-right">Stok</TableHead>
                )}
                {isColumnVisible("actions") && (
                  <TableHead className="text-center w-[80px]">Aksi</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={
                      1 +
                      columns.filter((column) => column.isVisible).length
                    }
                    className="text-center h-24"
                  >
                    Tidak ada data produk
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell>{index + 1}</TableCell>
                    {isColumnVisible("kode") && <TableCell>{product.kode}</TableCell>}
                    {isColumnVisible("nama") && <TableCell>{product.nama}</TableCell>}
                    {isColumnVisible("kategori") && (
                      <TableCell>
                        <Badge variant="outline">{product.kategori}</Badge>
                      </TableCell>
                    )}
                    {isColumnVisible("hargaBeli") && (
                      <TableCell className="text-right">
                        {formatRupiah(product.hargaBeli)}
                      </TableCell>
                    )}
                    {isColumnVisible("hargaJual") && (
                      <TableCell className="text-right">
                        {formatRupiah(product.hargaJual)}
                      </TableCell>
                    )}
                    {isColumnVisible("stok") && (
                      <TableCell className="text-right">
                        <Badge
                          variant={product.stok > 10 ? "success" : product.stok > 0 ? "warning" : "destructive"}
                        >
                          {product.stok} {product.satuan}
                        </Badge>
                      </TableCell>
                    )}
                    {isColumnVisible("actions") && (
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <div className="grid grid-cols-2 gap-1 w-fit">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => onViewItem(product.id)}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => onEditItem(product.id)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0 col-span-2"
                              onClick={() => onDeleteItem(product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
