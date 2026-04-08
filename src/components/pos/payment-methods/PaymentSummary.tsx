
import React from "react";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface PaymentSummaryProps {
  subtotal: number;
  discount?: number;
  tax?: number;
  serviceFee?: number;
  takeawayFee?: number;
  discountAmount?: number;
  serviceFeeAmount?: number;
  takeawayFeeAmount?: number;
  total: number;
}

export function PaymentSummary({
  subtotal,
  discount = 0,
  tax = 0,
  serviceFee = 0,
  takeawayFee = 0,
  discountAmount = 0,
  serviceFeeAmount = 0,
  takeawayFeeAmount = 0,
  total
}: PaymentSummaryProps) {
  // Calculate amounts if not provided
  const calculatedDiscountAmount = discountAmount || (subtotal * discount) / 100;
  const calculatedServiceFeeAmount = serviceFeeAmount || (subtotal * serviceFee) / 100;
  const calculatedTakeawayFeeAmount = takeawayFeeAmount || (subtotal * takeawayFee) / 100;
  const calculatedTaxAmount = (subtotal * (1 - discount / 100) * tax) / 100;

  return (
    <Card className="border bg-white">
      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Sub-Total</span>
          <span className="font-medium">{formatRupiah(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Discounts</span>
            <span className="text-destructive">({formatRupiah(calculatedDiscountAmount)})</span>
          </div>
        )}

        {serviceFee > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Service Charge ({serviceFee}%)</span>
            <span>{formatRupiah(calculatedServiceFeeAmount)}</span>
          </div>
        )}
        
        {takeawayFee > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Take Away Fee ({takeawayFee}%)</span>
            <span>{formatRupiah(calculatedTakeawayFeeAmount)}</span>
          </div>
        )}
        
        {tax > 0 && (
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Pajak ({tax}%)</span>
            <span>{formatRupiah(calculatedTaxAmount)}</span>
          </div>
        )}
        
        <div className="flex justify-between pt-2 border-t mt-1">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg text-primary">{formatRupiah(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
