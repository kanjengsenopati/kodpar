
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  currentStock: number;
  onAdjustStock: (quantity: number) => void;
  isSubmitting: boolean;
}

export function StockAdjustmentDialog({
  open,
  onOpenChange,
  productName,
  currentStock,
  onAdjustStock,
  isSubmitting,
}: StockAdjustmentDialogProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const [operation, setOperation] = useState<"add" | "subtract">("add");

  const handleSubmit = () => {
    const adjustedQuantity = operation === "add" ? quantity : -quantity;
    onAdjustStock(adjustedQuantity);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Penyesuaian Stok: {productName}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <Label>Stok Saat Ini</Label>
            <div className="mt-1 font-medium">{currentStock}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operation">Operasi</Label>
              <div className="flex">
                <Button
                  type="button"
                  variant={operation === "add" ? "default" : "outline"}
                  className="rounded-r-none flex-1"
                  onClick={() => setOperation("add")}
                >
                  Tambah
                </Button>
                <Button
                  type="button"
                  variant={operation === "subtract" ? "default" : "outline"}
                  className="rounded-l-none flex-1"
                  onClick={() => setOperation("subtract")}
                >
                  Kurangi
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Jumlah</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity || ""}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="0"
                required
              />
            </div>
          </div>
          
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm">
              Stok setelah penyesuaian: 
              <strong className="ml-1">
                {operation === "add" ? currentStock + quantity : currentStock - quantity}
              </strong>
            </p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || quantity <= 0}
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
