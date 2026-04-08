
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRupiah } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface CashPaymentFieldsProps {
  amountPaid: number;
  total: number;
  onChange: (amount: number) => void;
}

export function CashPaymentFields({ 
  amountPaid, 
  total, 
  onChange 
}: CashPaymentFieldsProps) {
  // Predefined cash amount buttons
  const cashOptions = [
    { label: "Uang Pas", value: total },
    { label: formatRupiah(20000), value: 20000 },
    { label: formatRupiah(50000), value: 50000 },
    { label: formatRupiah(100000), value: 100000 }
  ];

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numericValue = value ? parseInt(value.replace(/[^\d]/g, '')) : 0;
    onChange(numericValue);
  };

  // Calculate change
  const change = Math.max(0, amountPaid - total);

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="paid-amount" className="text-sm font-medium">Jumlah Dibayar</Label>
        <Input
          id="paid-amount"
          type="text"
          className="mt-1.5 text-lg font-medium"
          value={formatRupiah(amountPaid)}
          onChange={handleInputChange}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cashOptions.map((option, index) => (
          <button
            key={index}
            type="button"
            className={`py-2 px-2 text-sm rounded-md border transition-colors ${
              amountPaid === option.value 
                ? 'bg-primary text-white border-primary' 
                : 'bg-background hover:bg-muted'
            }`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <Card className={`border ${change >= 0 ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Kembalian:</span>
            <span className={`text-lg font-bold ${amountPaid >= total ? 'text-green-600' : 'text-destructive'}`}>
              {amountPaid >= total ? formatRupiah(change) : 'Pembayaran Kurang'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
