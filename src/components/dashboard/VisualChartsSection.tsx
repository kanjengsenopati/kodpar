
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpananPieChart } from "@/components/dashboard/charts/SimpananPieChart";
import { PinjamanBarChart } from "@/components/dashboard/charts/PinjamanBarChart";
import { SHULineChart } from "@/components/dashboard/charts/SHULineChart";
import { PiutangStackedBarChart } from "@/components/dashboard/charts/PiutangStackedBarChart";
import { SimpananPinjamanAreaChart } from "@/components/dashboard/charts/SimpananPinjamanAreaChart";
import { AnggotaDonutChart } from "@/components/dashboard/charts/AnggotaDonutChart";

export function VisualChartsSection() {
  return (
    <div className="mb-6">
      <div className="mb-6 p-6 bg-gradient-to-r from-koperasi-light via-koperasi-light to-koperasi-light rounded-xl border border-koperasi-green/20 shadow-lg">
        <h2 className="text-2xl font-bold text-koperasi-dark mb-2">Analisis Visual Koperasi</h2>
        <p className="text-koperasi-gray text-base font-medium">Visualisasi data komprehensif untuk pengambilan keputusan yang lebih baik</p>
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Pie Chart - Komposisi Simpanan */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-xl">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-xl py-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📊 Komposisi Simpanan Anggota
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <SimpananPieChart />
          </CardContent>
        </Card>

        {/* Bar Chart - Pertumbuhan Pinjaman */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-xl">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-xl py-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📈 Pertumbuhan Pinjaman Per Bulan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <PinjamanBarChart />
          </CardContent>
        </Card>

        {/* Line Chart - Tren SHU */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-xl">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-xl py-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📊 Tren SHU 5 Tahun Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <SHULineChart />
          </CardContent>
        </Card>

        {/* Stacked Bar Chart - Piutang */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-xl">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-xl py-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📊 Analisis Piutang Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <PiutangStackedBarChart />
          </CardContent>
        </Card>

        {/* Area Chart - Simpanan vs Pinjaman */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-xl">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-xl py-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              📈 Perbandingan Simpanan & Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <SimpananPinjamanAreaChart />
          </CardContent>
        </Card>

        {/* Donut Chart - Distribusi Anggota */}
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-xl">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-xl py-3">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              👥 Distribusi Anggota Berdasarkan Pekerjaan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 p-4">
            <AnggotaDonutChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
