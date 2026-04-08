
import { ProdukItem, PenjualanItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatRupiah } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import { useState, useEffect } from "react";

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

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value) || 0;
    if (newValue >= 0 && newValue <= product.stok) {
      setQuantity(newValue);
      onUpdateQuantity(product.id, newValue);
    }
  };

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
    <div className="flex items-center justify-between py-2 border-b last:border-b-0">
      <div className="flex-1">
        <h4 className="font-medium text-sm">{product.nama}</h4>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <div className="flex items-center mr-2">
            <button 
              onClick={decreaseQuantity}
              className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="mx-2 font-medium">× {quantity}</span>
            <button 
              onClick={increaseQuantity}
              className="w-5 h-5 flex items-center justify-center bg-gray-100 rounded-full"
              disabled={quantity >= product.stok}
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="text-right">
        <p className="font-semibold text-primary text-sm">{formatRupiah(item.total)}</p>
        <p className="text-xs text-gray-500">{formatRupiah(item.hargaSatuan)} / item</p>
      </div>
    </div>
  );
}
