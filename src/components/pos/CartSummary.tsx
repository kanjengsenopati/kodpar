
import { useState, useEffect } from "react";
import { PenjualanItem, Kasir } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, Save, Printer, CreditCard } from "lucide-react";
import { PaymentMethodSelector, PaymentMethod } from "./payment-methods/PaymentMethodSelector";
import { PaymentSummary } from "./payment-methods/PaymentSummary";
import { CashPaymentFields } from "./payment-methods/CashPaymentFields";
import { formatRupiah } from "@/lib/utils";

interface CartSummaryProps {
  items: PenjualanItem[];
  subtotal: number;
  discount: number;
  discountAmount: number;
  serviceFee: number;
  serviceFeeAmount: number;
  takeawayFee: number;
  takeawayFeeAmount: number;
  total: number;
  onCheckout: (data: {
    kasirId: string;
    metodePembayaran: "cash" | "debit" | "kredit" | "qris";
    dibayar: number;
    kembalian: number;
    catatan: string;
  }) => void;
  kasirList: Kasir[];
  processing: boolean;
}

export function CartSummary({
  items,
  subtotal,
  discount,
  discountAmount,
  serviceFee,
  serviceFeeAmount,
  takeawayFee,
  takeawayFeeAmount,
  total,
  onCheckout,
  kasirList,
  processing
}: CartSummaryProps) {
  const [kasirId, setKasirId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [amountPaid, setAmountPaid] = useState(total);
  const [notes, setNotes] = useState("");
  
  // Update amount paid when total changes
  useEffect(() => {
    if (paymentMethod === "cash") {
      setAmountPaid(total);
    }
  }, [total, paymentMethod]);
  
  const change = amountPaid - total;
  
  const handleCheckout = () => {
    if (items.length === 0) return;
    if (!kasirId) return;
    if (paymentMethod === "cash" && amountPaid < total) return;
    
    onCheckout({
      kasirId,
      metodePembayaran: paymentMethod,
      dibayar: amountPaid,
      kembalian: paymentMethod === "cash" ? Math.max(0, change) : 0,
      catatan: notes
    });
  };

  const formIsValid = 
    items.length > 0 &&
    kasirId !== "" &&
    (paymentMethod !== "cash" || amountPaid >= total);
  
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-md p-3 border space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Sub-Total</span>
          <span className="font-medium">{formatRupiah(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Discounts</span>
            <span className="text-destructive">({formatRupiah(discountAmount)})</span>
          </div>
        )}
        
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Service Charge ({serviceFee}%)</span>
          <span>{formatRupiah(serviceFeeAmount)}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-gray-400">
          <span>Take Away Fee ({takeawayFee}%)</span>
          <span>{formatRupiah(takeawayFeeAmount)}</span>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg text-primary">{formatRupiah(total)}</span>
        </div>
      </div>

      <div className="space-y-4 bg-white p-3 rounded-md border">
        <div>
          <Label htmlFor="kasir" className="text-sm font-medium">Nama Kasir</Label>
          <Select value={kasirId} onValueChange={setKasirId}>
            <SelectTrigger id="kasir" className="mt-1.5">
              <SelectValue placeholder="Pilih kasir" />
            </SelectTrigger>
            <SelectContent>
              {kasirList.filter(k => k.aktif).map((kasir) => (
                <SelectItem key={kasir.id} value={kasir.id}>
                  {kasir.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-1.5">
          <Label className="text-sm font-medium">Metode Pembayaran</Label>
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
          />
        </div>
        
        {paymentMethod === "cash" && (
          <CashPaymentFields
            amountPaid={amountPaid}
            total={total}
            onChange={setAmountPaid}
          />
        )}
        
        <div>
          <Label htmlFor="notes" className="text-sm font-medium">Catatan</Label>
          <Input
            id="notes"
            placeholder="Tambahkan catatan (opsional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1.5"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button
            variant="outline"
            className="py-5 w-full"
            disabled={processing}
          >
            <Save className="mr-2 h-5 w-5" />
            Save Bill
          </Button>
          
          <Button
            variant="outline"
            className="py-5 w-full"
            disabled={processing}
          >
            <Printer className="mr-2 h-5 w-5" />
            Print Bill
          </Button>
        </div>
        
        <Button
          className="w-full gap-2 py-6 text-base font-medium bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
          onClick={handleCheckout}
          disabled={!formIsValid || processing}
        >
          {processing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Memproses...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              <span>Charge {formatRupiah(total)}</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
