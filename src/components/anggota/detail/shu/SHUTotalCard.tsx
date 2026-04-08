
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";

interface SHUTotalCardProps {
  totalSHU: number;
}

export function SHUTotalCard({ totalSHU }: SHUTotalCardProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Total SHU Anggota</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-purple-600">{formatCurrency(totalSHU)}</p>
      </CardContent>
    </Card>
  );
}
