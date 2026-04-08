
import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Transaksi } from "@/types";
import { Printer, Share2, Check } from "lucide-react";
import { useReactToPrint } from "react-to-print";

interface ReceiptActionsProps {
  receiptRef: React.RefObject<HTMLDivElement>;
  transaksi: Transaksi;
  onClose: () => void;
}

export function ReceiptActions({ receiptRef, transaksi, onClose }: ReceiptActionsProps) {
  const { toast } = useToast();

  // Handle printing
  const handlePrint = useReactToPrint({
    documentTitle: `Receipt-${transaksi.id}`,
    onAfterPrint: () => {
      toast({
        title: "Bukti Transaksi Dicetak",
        description: `Bukti transaksi ${transaksi.id} berhasil dicetak.`,
      });
    },
    contentRef: receiptRef,
  });

  // Handle sharing
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Bukti Transaksi Koperasi",
          text: `Bukti transaksi ${transaksi.id} di Koperasi Sejahtera`,
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
        className="flex-1 gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4" /> Cetak Bukti
      </Button>
      
      <Button 
        variant="outline"
        className="flex-1 gap-2 border-blue-200 text-blue-700 hover:bg-blue-50"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" /> Bagikan
      </Button>
      
      <Button 
        className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
        onClick={onClose}
      >
        <Check className="h-4 w-4" /> Selesai
      </Button>
    </>
  );
}
