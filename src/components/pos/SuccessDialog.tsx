
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Penjualan } from "@/types";
import { useRef } from "react";
import { getKasirById } from "@/services/kasirService";
import { Receipt } from "./receipt/Receipt";
import { ReceiptActions } from "./receipt/ReceiptActions";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sale: Penjualan | null;
}

export function SuccessDialog({ open, onOpenChange, sale }: SuccessDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  
  if (!sale) return null;
  
  const kasir = getKasirById(sale.kasirId);
  const kasirName = kasir ? kasir.nama : "Unknown";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600 text-center justify-center">
            <div className="bg-green-100 rounded-full p-1">
              <Check className="h-5 w-5" />
            </div>
            Transaksi Berhasil
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
          <Receipt ref={receiptRef} sale={sale} kasirName={kasirName} />
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <ReceiptActions 
            receiptRef={receiptRef}
            sale={sale}
            onClose={() => onOpenChange(false)} 
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
