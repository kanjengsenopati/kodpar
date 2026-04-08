
import { ProdukItem } from "@/types";
import { ProductCard } from "./ProductCard";
import { ShoppingCart } from "lucide-react";

interface ProductGridProps {
  products: ProdukItem[];
  onAddToCart: (product: ProdukItem) => void;
}

export function ProductGrid({ products, onAddToCart }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="p-6 bg-primary/5 rounded-lg">
          <ShoppingCart className="h-12 w-12 text-primary/30 mx-auto" />
          <p className="text-gray-500 mt-2">Tidak ada produk yang ditemukan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
