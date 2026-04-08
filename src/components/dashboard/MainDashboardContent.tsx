
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatisticsCards } from "@/components/dashboard/StatisticsCards";
import { RecentTransactionsTable } from "@/components/dashboard/RecentTransactionsTable";
import { ProductivityTable } from "@/components/dashboard/ProductivityTable";
import { ActivityBarChart } from "@/components/dashboard/ActivityBarChart";
import { KinerjaRadarChart } from "@/components/dashboard/charts/KinerjaRadarChart";
import { DashboardData } from "@/hooks/useDashboardData";
import { ActivityData } from "@/hooks/useActivityChart";

interface MainDashboardContentProps {
  dashboardData: DashboardData;
  monthlyActivityData: ActivityData[];
}

export function MainDashboardContent({ 
  dashboardData, 
  monthlyActivityData 
}: MainDashboardContentProps) {
  const { 
    totalAnggota, 
    totalSimpanan, 
    totalPinjaman,
    recentTransaksi,
    productivityData
  } = dashboardData;

  return (
    <>
      {/* Statistics Cards */}
      <StatisticsCards 
        totalAnggota={totalAnggota}
        totalSimpanan={totalSimpanan}
        totalPinjaman={totalPinjaman}
      />
      
      {/* Transaction Activity and Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Transaction Activity Chart Card */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-xl">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-xl py-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📊 Aktivitas Transaksi Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <div className="h-[250px]">
              <ActivityBarChart data={monthlyActivityData} />
            </div>
          </CardContent>
        </Card>
        
        {/* Radar Chart - Kinerja Koperasi */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-xl">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-xl py-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              🎯 Penilaian Kinerja Koperasi
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <KinerjaRadarChart />
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Transactions Table */}
      <Card className="mb-6 shadow-lg border-0 bg-white/95 backdrop-blur-sm rounded-xl">
        <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-xl py-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            📋 Transaksi Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 p-4">
          <RecentTransactionsTable transactions={recentTransaksi} />
        </CardContent>
      </Card>
      
      {/* Productivity Table */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm rounded-xl">
        <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-xl py-3">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            📈 Produktivitas Koperasi
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 p-4">
          <ProductivityTable {...productivityData} />
        </CardContent>
      </Card>
    </>
  );
}
