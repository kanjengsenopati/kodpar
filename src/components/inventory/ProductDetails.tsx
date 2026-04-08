
import React from "react";
import { formatRupiah } from "@/lib/utils";
import { ProdukItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Package, ArrowLeft, BarChart2, Image } from "lucide-react";

interface ProductDetailsProps {
  product: ProdukItem;
  onEdit: () => void;
  onBack: () => void;
  onAdjustStock: (id: string) => void;
}

export function ProductDetails({ 
  product, 
  onEdit, 
  onBack,
  onAdjustStock 
}: ProductDetailsProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <div>
              <CardTitle>Detail Produk</CardTitle>
              <CardDescription>Informasi lengkap produk</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
            </Button>
            <Button onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
            {product.gambar ? (
              <img 
                src={product.gambar} 
                alt={product.nama}
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Image className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Kode Produk</div>
                  <div>{product.kode}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Nama Produk</div>
                  <div className="text-lg font-semibold">{product.nama}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Kategori</div>
                  <Badge variant="outline">{product.kategori}</Badge>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Stok</div>
                  <Badge
                    variant={product.stok > 10 ? "success" : product.stok > 0 ? "warning" : "destructive"}
                  >
                    {product.stok} {product.satuan}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Harga Beli</div>
                  <div className="text-lg font-medium">{formatRupiah(product.hargaBeli)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Harga Jual</div>
                  <div className="text-lg font-medium">{formatRupiah(product.hargaJual)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-muted-foreground">Margin</div>
                  <div>
                    {formatRupiah(product.hargaJual - product.hargaBeli)} (
                    {Math.round(((product.hargaJual - product.hargaBeli) / product.hargaBeli) * 100)}%)
                  </div>
                </div>
              </div>
            </div>
            
            {product.deskripsi && (
              <div className="mt-4">
                <div className="text-sm font-medium text-muted-foreground mb-1">Deskripsi</div>
                <div className="text-sm">{product.deskripsi}</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => onAdjustStock(product.id)}
        >
          <BarChart2 className="mr-2 h-4 w-4" /> Sesuaikan Stok
        </Button>
      </CardFooter>
    </Card>
  );
}
