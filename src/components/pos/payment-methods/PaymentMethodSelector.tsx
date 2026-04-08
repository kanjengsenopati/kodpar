
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Wallet, Banknote, QrCode } from "lucide-react";

export type PaymentMethod = "cash" | "debit" | "kredit" | "qris";

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onMethodChange: (method: PaymentMethod) => void;
}

const paymentOptions = [
  { id: "cash", name: "Tunai", icon: Banknote },
  { id: "debit", name: "Debit", icon: CreditCard },
  { id: "kredit", name: "Kredit", icon: Wallet },
  { id: "qris", name: "QRIS", icon: QrCode },
];

export function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {paymentOptions.map((option) => {
        const IconComponent = option.icon;
        return (
          <Card
            key={option.id}
            className={`cursor-pointer transition-colors ${
              selectedMethod === option.id
                ? "border-primary bg-primary/5"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onMethodChange(option.id as PaymentMethod)}
          >
            <CardContent className="p-3 flex flex-col items-center justify-center">
              <IconComponent
                className={`h-6 w-6 mb-1 ${
                  selectedMethod === option.id ? "text-primary" : "text-gray-500"
                }`}
              />
              <span className={`text-sm ${
                selectedMethod === option.id ? "font-medium text-primary" : "text-gray-600"
              }`}>
                {option.name}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
