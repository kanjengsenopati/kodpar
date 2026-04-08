
import React from "react";
import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardHeader } from "@/components/ui/card";

interface CartHeaderProps {
  itemCount: number;
  onClear: () => void;
}

export function CartHeader({ itemCount, onClear }: CartHeaderProps) {
  return (
    <CardHeader className="border-b flex justify-between items-center bg-primary/5">
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-medium">Keranjang</h2>
        {itemCount > 0 && (
          <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
            {itemCount} item
          </Badge>
        )}
      </div>
      
      {itemCount > 0 && (
        <Button 
          variant="ghost" 
          size="sm"
          onClick={onClear}
          className="text-sm text-muted-foreground hover:text-destructive"
        >
          Kosongkan
        </Button>
      )}
    </CardHeader>
  );
}
