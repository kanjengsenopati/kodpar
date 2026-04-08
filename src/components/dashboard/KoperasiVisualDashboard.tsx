
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
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

  const cardStyle = "rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-none bg-white transition-all duration-300 hover:scale-[1.01]";
  const headerStyle = "pb-2 pt-4 px-5";

  return (
    <div className="p-5 bg-[#F8FAFC] min-h-screen">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Komposisi Simpanan */}
        <Card className={cardStyle}>
          <CardHeader className={headerStyle}>
            <Text.H2 className="flex items-center gap-2">
              📊 Komposisi Simpanan Anggota
            </Text.H2>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <SimpananPieChart />
          </CardContent>
        </Card>

        {/* Bar Chart - Pertumbuhan Pinjaman */}
        <Card className={cardStyle}>
          <CardHeader className={headerStyle}>
            <Text.H2 className="flex items-center gap-2">
              📈 Pertumbuhan Pinjaman Per Bulan
            </Text.H2>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <PinjamanBarChart />
          </CardContent>
        </Card>

        {/* Line Chart - Tren SHU */}
        <Card className={cardStyle}>
          <CardHeader className={headerStyle}>
            <Text.H2 className="flex items-center gap-2">
              📊 Tren SHU 5 Tahun Terakhir
            </Text.H2>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <SHULineChart />
          </CardContent>
        </Card>

        {/* Stacked Bar Chart - Piutang */}
        <Card className={cardStyle}>
          <CardHeader className={headerStyle}>
            <Text.H2 className="flex items-center gap-2">
              📊 Analisis Piutang Bulanan
            </Text.H2>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <PiutangStackedBarChart />
          </CardContent>
        </Card>

        {/* Area Chart - Simpanan vs Pinjaman */}
        <Card className={cardStyle}>
          <CardHeader className={headerStyle}>
            <Text.H2 className="flex items-center gap-2">
              📈 Perbandingan Simpanan & Pinjaman
            </Text.H2>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <SimpananPinjamanAreaChart />
          </CardContent>
        </Card>

        {/* Donut Chart - Distribusi Anggota */}
        <Card className={cardStyle}>
          <CardHeader className={headerStyle}>
            <Text.H2 className="flex items-center gap-2">
              👥 Distribusi Anggota
            </Text.H2>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <AnggotaDonutChart />
          </CardContent>
        </Card>

        {/* Radar Chart - Kinerja Koperasi */}
        <Card className={`${cardStyle} lg:col-span-2`}>
          <CardHeader className={headerStyle}>
            <Text.H2 className="flex items-center gap-2">
              🎯 Penilaian Kinerja Koperasi
            </Text.H2>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <KinerjaRadarChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

