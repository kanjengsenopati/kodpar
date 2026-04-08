
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityBarChart } from "@/components/dashboard/ActivityBarChart";
import { SHUDistributionChart } from "@/components/dashboard/SHUDistributionChart";
import { useActivityChart } from "@/hooks/useActivityChart";
import { SHUData } from "@/hooks/useSHUDistributionChart";
import { Transaksi } from "@/types";

interface ChartSectionProps {
  transactions: Transaksi[];
  shuDistribution: SHUData[];
}

export function ChartSection({ transactions, shuDistribution }: ChartSectionProps) {
  const { prepareActivityChartData } = useActivityChart();
  const monthlyActivityData = prepareActivityChartData(transactions);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Transaction Activity Chart Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Aktivitas Transaksi Bulanan</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[300px]">
            <ActivityBarChart data={monthlyActivityData} />
          </div>
        </CardContent>
      </Card>
      
      {/* SHU Distribution Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Distribusi SHU Anggota</CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="h-[300px]">
            <SHUDistributionChart data={shuDistribution} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
