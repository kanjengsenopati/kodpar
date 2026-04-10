
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import * as Text from "@/components/ui/text";
import { formatCurrency } from "@/utils/formatters";

interface FinancialCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
}

export function FinancialCard({ title, value, icon: Icon, iconColor, iconBgColor }: FinancialCardProps) {
  return (
    <Card className="hover:shadow-md transition-all active:scale-[0.98] cursor-pointer">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <Text.Label className="block mb-1">{title}</Text.Label>
            <Text.Amount className="text-xl block">{formatCurrency(value)}</Text.Amount>
          </div>
          <div className={`rounded-2xl ${iconBgColor} p-3 ml-3`}>
            <Icon className={`h-5 w-5 ${iconColor}`} strokeWidth={2.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
