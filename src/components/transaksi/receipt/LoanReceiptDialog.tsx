
import React, { useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Transaksi } from "@/types";
import { getPengaturan } from "@/services/pengaturanService";
import { ProfessionalLoanReceipt } from "./ProfessionalLoanReceipt";
import { Printer, FileText, Check } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface LoanReceiptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaksi: Transaksi | null;
}

export function LoanReceiptDialog({ open, onOpenChange, transaksi }: LoanReceiptDialogProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  if (!transaksi) return null;

  const pengaturan = getPengaturan();
  
  // Calculate additional charges based on settings
  const calculateAdditionalCharges = () => {
    const charges: { danaResikoKredit?: number; simpananWajibKredit?: number } = {};
    
    if (pengaturan.sukuBunga.danaResikoKredit?.enabled) {
      charges.danaResikoKredit = Math.round(
        transaksi.jumlah * (pengaturan.sukuBunga.danaResikoKredit.persentase / 100)
      );
    }
    
    if (pengaturan.sukuBunga.simpananWajibKredit?.enabled) {
      charges.simpananWajibKredit = Math.round(
        transaksi.jumlah * (pengaturan.sukuBunga.simpananWajibKredit.persentase / 100)
      );
    }
    
    return charges;
  };

  // Handle printing
  const handlePrint = useReactToPrint({
    documentTitle: `Tanda-Terima-Pinjaman-${transaksi.id}`,
    onAfterPrint: () => {
      toast({
        title: "Tanda Terima Pinjaman Dicetak",
        description: `Tanda terima pinjaman ${transaksi.id} berhasil dicetak.`,
      });
    },
    contentRef: receiptRef,
  });

  const additionalCharges = calculateAdditionalCharges();
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center justify-center">
            <FileText className="h-5 w-5" />
            Tanda Terima Pinjaman
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <ProfessionalLoanReceipt 
            ref={receiptRef} 
            transaksi={transaksi}
            additionalCharges={additionalCharges}
          />
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline"
            className="flex-1 gap-2"
            onClick={handlePrint}
          >
            <Printer className="h-4 w-4" /> Cetak Tanda Terima
          </Button>
          
          <Button 
            className="flex-1 gap-2"
            onClick={() => onOpenChange(false)}
          >
            <Check className="h-4 w-4" /> Selesai
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
