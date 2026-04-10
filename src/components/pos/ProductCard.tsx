
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
            <ShoppingCart className="h-10 w-10 text-slate-200" strokeWidth={1.5} />
          </div>
        )}
        
        {product.stok <= 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-sm">
              Habis
            </span>
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 justify-between">
        <Text.Body className="line-clamp-2 mb-2 leading-tight font-bold text-slate-800 transition-colors group-hover:text-blue-600">
          {product.nama}
        </Text.Body>
        <div className="flex items-baseline justify-between gap-2 mt-auto">
          <div className="flex items-baseline gap-1 overflow-hidden">
            <Text.Amount className="text-[14px]">
              {formatRupiah(product.hargaJual)}
            </Text.Amount>
            {product.stok > 0 && (
              <Text.Caption className="not-italic text-[10px] text-slate-400 font-bold whitespace-nowrap">
                Stok {product.stok}
              </Text.Caption>
            )}
          </div>
          <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
            <Plus size={14} strokeWidth={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
