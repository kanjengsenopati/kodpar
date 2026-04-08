
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { LoanSummaryProps } from "./types";

export function LoanSummary({
  angsuranPerBulan,
  totalBunga,
  totalPengembalian,
  jatuhTempo,
}: LoanSummaryProps) {
  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="p-4">
        <h3 className="font-semibold mb-3">Rincian Pembayaran</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Angsuran per Bulan:</p>
            <p className="font-medium">{formatCurrency(angsuranPerBulan)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Bunga:</p>
            <p className="font-medium">{formatCurrency(totalBunga)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Pengembalian:</p>
            <p className="font-medium">{formatCurrency(totalPengembalian)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Jatuh Tempo:</p>
            <p className="font-medium">{formatDate(jatuhTempo)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
