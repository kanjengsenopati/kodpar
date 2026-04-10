import React, { useState, useEffect } from "react";
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
import { CashPaymentFields } from "./payment-methods/CashPaymentFields";
import { formatRupiah } from "@/lib/utils";
import { Text } from "@/components/ui/text";

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
    <div className="space-y-6">
      <div className="bg-white rounded-[24px] p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-3">
        <div className="flex justify-between items-center">
          <Text.Body className="text-slate-400">Sub-Total</Text.Body>
          <Text.Body className="font-bold text-slate-700">{formatRupiah(subtotal)}</Text.Body>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between items-center">
            <Text.Body className="text-slate-400">Discounts</Text.Body>
            <Text.Body className="text-red-600 font-bold">({formatRupiah(discountAmount)})</Text.Body>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <Text.Caption className="not-italic text-slate-400">Service Charge ({serviceFee}%)</Text.Caption>
          <Text.Caption className="not-italic text-slate-500 font-medium">{formatRupiah(serviceFeeAmount)}</Text.Caption>
        </div>
        
        <div className="flex justify-between items-center">
          <Text.Caption className="not-italic text-slate-400">Take Away Fee ({takeawayFee}%)</Text.Caption>
          <Text.Caption className="not-italic text-slate-500 font-medium">{formatRupiah(takeawayFeeAmount)}</Text.Caption>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-slate-50">
          <Text.H2>Total Tagihan</Text.H2>
          <Text.Amount className="text-2xl">{formatRupiah(total)}</Text.Amount>
        </div>
      </div>

      <div className="space-y-5 bg-white p-5 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <Label htmlFor="kasir" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Nama Kasir</Label>
          <Select value={kasirId} onValueChange={setKasirId}>
            <SelectTrigger id="kasir" className="h-11 bg-slate-50 border-none rounded-xl focus:ring-blue-600/20 font-medium text-sm">
              <SelectValue placeholder="Pilih kasir yang bertugas" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none shadow-xl">
              {kasirList.filter(k => k.aktif).map((kasir) => (
                <SelectItem key={kasir.id} value={kasir.id} className="rounded-lg mb-1">
                  {kasir.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block">Metode Pembayaran</Label>
          <PaymentMethodSelector
            selectedMethod={paymentMethod}
            onMethodChange={setPaymentMethod}
          />
        </div>
        
        {paymentMethod === "cash" && (
          <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
            <CashPaymentFields
              amountPaid={amountPaid}
              total={total}
              onChange={setAmountPaid}
            />
          </div>
        )}
        
        <div>
          <Label htmlFor="notes" className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 block">Catatan Tambahan</Label>
          <Input
            id="notes"
            placeholder="Ketik catatan di sini..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="h-11 bg-slate-50 border-none rounded-xl focus-visible:ring-blue-600/20 transition-all font-medium text-sm"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <Button
            variant="outline"
            className="h-12 w-full rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            disabled={processing}
          >
            <Save className="mr-2 h-4 w-4" />
            Save Bill
          </Button>
          
          <Button
            variant="outline"
            className="h-12 w-full rounded-2xl border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
            disabled={processing}
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
        
        <Button
          className="w-full h-14 gap-3 rounded-[20px] text-base font-bold bg-blue-600 hover:bg-blue-700 shadow-[0_10px_20px_rgba(37,99,235,0.2)] transition-all active:scale-[0.98] disabled:opacity-50"
          onClick={handleCheckout}
          disabled={!formIsValid || processing}
        >
          {processing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Sedang Memproses...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5" />
              <span>Bayar {formatRupiah(total)}</span>
              <ArrowRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
