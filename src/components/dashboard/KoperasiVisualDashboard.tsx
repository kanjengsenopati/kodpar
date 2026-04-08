
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SimpananPieChart } from './charts/SimpananPieChart';
import { PinjamanBarChart } from './charts/PinjamanBarChart';
import { SHULineChart } from './charts/SHULineChart';
import { PiutangStackedBarChart } from './charts/PiutangStackedBarChart';
import { SimpananPinjamanAreaChart } from './charts/SimpananPinjamanAreaChart';
import { AnggotaDonutChart } from './charts/AnggotaDonutChart';
import { KinerjaRadarChart } from './charts/KinerjaRadarChart';

export function KoperasiVisualDashboard() {
  const handleDownloadPNG = () => {
    console.log('Downloading as PNG...');
  };

  const handleDownloadPDF = () => {
    console.log('Downloading as PDF...');
  };

  return (
    <div className="p-4 bg-gradient-to-br from-koperasi-light via-koperasi-light to-koperasi-light min-h-screen">

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pie Chart - Komposisi Simpanan */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-koperasi-light hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-lg py-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              📊 Komposisi Simpanan Anggota
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 p-3">
            <SimpananPieChart />
          </CardContent>
        </Card>

        {/* Bar Chart - Pertumbuhan Pinjaman */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-koperasi-light hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-lg py-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              📈 Pertumbuhan Pinjaman Per Bulan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 p-3">
            <PinjamanBarChart />
          </CardContent>
        </Card>

        {/* Line Chart - Tren SHU */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-koperasi-light hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-lg py-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              📊 Tren SHU 5 Tahun Terakhir
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 p-3">
            <SHULineChart />
          </CardContent>
        </Card>

        {/* Stacked Bar Chart - Piutang */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-koperasi-light hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-lg py-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              📊 Analisis Piutang Bulanan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 p-3">
            <PiutangStackedBarChart />
          </CardContent>
        </Card>

        {/* Area Chart - Simpanan vs Pinjaman */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-koperasi-light hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-lg py-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              📈 Perbandingan Simpanan & Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 p-3">
            <SimpananPinjamanAreaChart />
          </CardContent>
        </Card>

        {/* Donut Chart - Distribusi Anggota */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-koperasi-light hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-lg py-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              👥 Distribusi Anggota Berdasarkan Pekerjaan
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 p-3">
            <AnggotaDonutChart />
          </CardContent>
        </Card>

        {/* Radar Chart - Kinerja Koperasi */}
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-koperasi-light lg:col-span-2 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-2 bg-gradient-to-r from-koperasi-blue to-koperasi-green text-white rounded-t-lg py-3">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              🎯 Penilaian Kinerja Koperasi
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-3 p-3">
            <KinerjaRadarChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
