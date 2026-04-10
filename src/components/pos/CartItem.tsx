import React, { useState, useEffect } from "react";
import { ProdukItem, PenjualanItem } from "@/types";
import { formatRupiah } from "@/lib/utils";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Text } from "@/components/ui/text";

interface CartItemProps {
  item: PenjualanItem;
  product: ProdukItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export function CartItem({ item, product, onUpdateQuantity, onRemove }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.jumlah);
  
  useEffect(() => {
    setQuantity(item.jumlah);
  }, [item.jumlah]);

  const increaseQuantity = () => {
    if (quantity < product.stok) {
      const newQuantity = quantity + 1;
      setQuantity(newQuantity);
      onUpdateQuantity(product.id, newQuantity);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      onUpdateQuantity(product.id, newQuantity);
    } else {
      onRemove(product.id);
    }
  };

  return (
    <div className="group relative bg-white p-3 rounded-2xl border border-slate-50 shadow-sm transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-10">
          <Text.Body className="font-semibold line-clamp-1">{product.nama}</Text.Body>
          <Text.Caption className="not-italic text-slate-400">
            {formatRupiah(item.hargaSatuan)} / unit
          </Text.Caption>
        </div>
        
        <div className="flex items-center gap-1">
          <button 
            onClick={() => onRemove(product.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-50">
        <div className="flex items-center bg-slate-100/50 rounded-xl p-0.5">
          <button 
            onClick={decreaseQuantity}
            className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-blue-600 disabled:opacity-50 transition-all"
          >
            <Minus size={14} strokeWidth={2.5} />
          </button>
          <span className="mx-3 text-xs font-bold text-slate-700 w-4 text-center">{quantity}</span>
          <button 
            onClick={increaseQuantity}
            className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:text-blue-600 disabled:opacity-50 transition-all"
            disabled={quantity >= product.stok}
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>
        
        <Text.Amount className="text-[14px]">
          {formatRupiah(item.total)}
        </Text.Amount>
      </div>
    </div>
  );
}
