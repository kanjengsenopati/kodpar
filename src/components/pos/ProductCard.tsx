
import { ProdukItem } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { Text } from "@/components/ui/text";

interface ProductCardProps {
  product: ProdukItem;
  onAddToCart: (product: ProdukItem) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    onAddToCart(product);
  };

  return (
    <div 
      className="bg-white rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-lg cursor-pointer group flex flex-col h-full" 
      onClick={handleAddToCart}
    >
      <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden">
        {product.gambar ? (
          <img
            src={product.gambar}
            alt={product.nama}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="h-10 w-10 text-slate-200" />
          </div>
        )}
        
        {product.stok <= 0 ? (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
              Habis
            </span>
          </div>
        ) : (
          <div className="absolute top-3 right-3">
             <span className="bg-white/90 backdrop-blur-md text-slate-500 text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm border border-slate-100">
               Stock: {product.stok}
             </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1 justify-between">
        <Text.Body className="line-clamp-2 mb-2 leading-tight min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
          {product.nama}
        </Text.Body>
        <div className="flex items-center justify-between mt-auto">
          <Text.Amount>
            {formatRupiah(product.hargaJual)}
          </Text.Amount>
          <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ShoppingCart size={16} strokeWidth={2} />
          </div>
        </div>
      </div>
    </div>
  );
}
