import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

interface CartHeaderProps {
  itemCount: number;
  onClear: () => void;
}

export function CartHeader({ itemCount, onClear }: CartHeaderProps) {
  return (
    <div className="flex items-center justify-between p-5 border-b border-slate-50 bg-white">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-blue-50 flex items-center justify-center">
          <ShoppingCart className="h-5 w-5 text-blue-600" strokeWidth={2} />
        </div>
        <div className="flex flex-col">
          <Text.H2 className="leading-tight">Keranjang</Text.H2>
          {itemCount > 0 && (
            <Text.Caption className="not-italic text-blue-600 font-bold">
              {itemCount} item terpilih
            </Text.Caption>
          )}
        </div>
      </div>
      
      {itemCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClear}
          className="rounded-xl text-xs font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
        >
          Kosongkan
        </Button>
      )}
    </div>
  );
}
