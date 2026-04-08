
import { ProdukItem } from "@/types";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: ProdukItem;
  onAddToCart: (product: ProdukItem) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden border transition-all duration-200 hover:shadow-md cursor-pointer" onClick={handleAddToCart}>
      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {product.gambar ? (
          <img
            src={product.gambar}
            alt={product.nama}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <ShoppingCart className="h-8 w-8 text-gray-300" />
          </div>
        )}
        {product.stok <= 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-sm bg-red-500 px-3 py-1 rounded-full">
              Stok Habis
            </span>
          </div>
        )}
      </div>

      <div className="p-3">
        <h3 className="font-medium text-sm line-clamp-1">{product.nama}</h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm font-bold text-primary">
            {formatRupiah(product.hargaJual)}
          </p>
          {product.stok > 0 && (
            <span className="text-xs text-gray-500">Stok: {product.stok}</span>
          )}
        </div>
      </div>
    </div>
  );
}
