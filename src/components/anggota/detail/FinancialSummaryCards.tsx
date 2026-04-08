
import { FinancialCardsFirstRow } from "./financial/FinancialCardsFirstRow";
import { FinancialCardsSecondRow } from "./financial/FinancialCardsSecondRow";
import { useSHURefresh } from "./financial/useSHURefresh";

interface FinancialSummaryCardsProps {
  totalSimpanan: number;
  totalPinjaman: number;
  totalAngsuran: number;
  totalPenarikan: number;
  totalTunggakan: number;
  totalSHU: number;
  anggotaId?: string;
}

export function FinancialSummaryCards({
  totalSimpanan,
  totalPinjaman,
  totalAngsuran,
  totalPenarikan,
  totalTunggakan,
  totalSHU: initialSHU,
  anggotaId
}: FinancialSummaryCardsProps) {
  const { totalSHU, setTotalSHU } = useSHURefresh(initialSHU, anggotaId);
  
  return (
    <div className="space-y-4 mb-6">
      {/* First row - 3 cards: Total Simpanan, Total Angsuran, Sisa Pinjaman */}
      <FinancialCardsFirstRow 
        totalSimpanan={totalSimpanan}
        totalPinjaman={totalPinjaman}
        totalAngsuran={totalAngsuran}
      />
      
      {/* Second row - 3 cards: Total Penarikan, Total Tunggakan, SHU */}
      <FinancialCardsSecondRow 
        totalPenarikan={totalPenarikan}
        totalTunggakan={totalTunggakan}
        totalSHU={totalSHU}
        anggotaId={anggotaId}
        onSHURefresh={setTotalSHU}
      />
    </div>
  );
}
