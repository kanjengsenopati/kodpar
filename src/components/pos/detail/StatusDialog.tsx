
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface StatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentStatus: "sukses" | "dibatalkan";
  onStatusChange: (status: "sukses" | "dibatalkan") => void;
  isSubmitting: boolean;
}

export function StatusDialog({
  open,
  onOpenChange,
  currentStatus,
  onStatusChange,
  isSubmitting,
}: StatusDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {currentStatus === "sukses" ? "Batalkan Transaksi" : "Tandai Sebagai Sukses"}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm">
            {currentStatus === "sukses" 
              ? "Membatalkan transaksi akan mengembalikan stok produk. Yakin ingin melanjutkan?" 
              : "Menandai transaksi sebagai sukses akan mengurangi stok produk. Yakin ingin melanjutkan?"}
          </p>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tidak
          </Button>
          <Button 
            variant={currentStatus === "sukses" ? "destructive" : "default"}
            onClick={() => onStatusChange(currentStatus === "sukses" ? "dibatalkan" : "sukses")}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Memproses..." : "Ya, Lanjutkan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
