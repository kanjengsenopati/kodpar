
import { ArrowDownLeft, AlertTriangle } from "lucide-react";
import { FinancialCard } from "./FinancialCard";
import { SHUCardEnhanced } from "./SHUCardEnhanced";

interface FinancialCardsSecondRowProps {
  totalPenarikan: number;
  totalTunggakan: number;
  totalSHU: number;
  anggotaId?: string;
  onSHURefresh?: (newValue: number) => void;
}

export function FinancialCardsSecondRow({ 
  totalPenarikan, 
  totalTunggakan, 
  totalSHU,
  anggotaId,
  onSHURefresh
}: FinancialCardsSecondRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FinancialCard
        title="Total Penarikan"
        value={totalPenarikan}
        icon={ArrowDownLeft}
        iconColor="text-indigo-600"
        iconBgColor="bg-indigo-100"
      />
      
      <FinancialCard
        title="Total Tunggakan"
        value={totalTunggakan}
        icon={AlertTriangle}
        iconColor="text-red-600"
        iconBgColor="bg-red-100"
      />
      
      <SHUCardEnhanced 
        totalSHU={totalSHU} 
        anggotaId={anggotaId}
        onRefresh={onSHURefresh}
      />
    </div>
  );
}
