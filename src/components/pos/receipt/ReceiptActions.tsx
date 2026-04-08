
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Penjualan } from "@/types";
import { Printer, Share2, Check } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface ReceiptActionsProps {
  receiptRef: React.RefObject<HTMLDivElement>;
  sale: Penjualan;
  onClose: () => void;
}

export function ReceiptActions({ receiptRef, sale, onClose }: ReceiptActionsProps) {
  const { toast } = useToast();

  // Handle printing
  const handlePrint = useReactToPrint({
    documentTitle: `Receipt-${sale.nomorTransaksi}`,
    onAfterPrint: () => {
      toast({
        title: "Struk Dicetak",
        description: `Struk ${sale.nomorTransaksi} berhasil dicetak.`,
      });
    },
    // The content property should be a function that returns the element to print
    contentRef: receiptRef,
  });

  // Handle sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Struk Pembelian",
          text: `Struk pembelian dengan nomor ${sale.nomorTransaksi}`,
        });
      } catch (error) {
        toast({
          title: "Sharing tidak tersedia",
          description: "Fitur share tidak tersedia di perangkat Anda",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Sharing tidak tersedia",
        description: "Fitur share tidak tersedia di perangkat Anda",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button 
        variant="outline"
        className="flex-1 gap-2"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" /> Cetak Struk
      </Button>
      
      <Button 
        variant="outline"
        className="flex-1 gap-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" /> Bagikan
      </Button>
      
      <Button 
        className="flex-1 gap-2"
        onClick={onClose}
      >
        <Check className="h-4 w-4" /> Selesai
      </Button>
    </>
  );
}
