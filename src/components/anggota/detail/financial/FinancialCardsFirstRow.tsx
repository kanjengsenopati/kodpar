
import { Wallet, CreditCard, Calculator } from "lucide-react";
import { FinancialCard } from "./FinancialCard";

interface FinancialCardsFirstRowProps {
  totalSimpanan: number;
  totalPinjaman: number;
  totalAngsuran: number;
}

export function FinancialCardsFirstRow({ 
  totalSimpanan, 
  totalPinjaman, 
  totalAngsuran 
}: FinancialCardsFirstRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FinancialCard
        title="Total Simpanan"
        value={totalSimpanan}
        icon={Wallet}
        iconColor="text-green-600"
        iconBgColor="bg-green-100"
      />
      
      <FinancialCard
        title="Total Angsuran"
        value={totalAngsuran}
        icon={CreditCard}
        iconColor="text-blue-600"
        iconBgColor="bg-blue-100"
      />
      
      <FinancialCard
        title="Sisa Pinjaman"
        value={totalPinjaman}
        icon={Calculator}
        iconColor="text-amber-600"
        iconBgColor="bg-amber-100"
      />
    </div>
  );
}
