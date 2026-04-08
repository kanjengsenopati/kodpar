
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { PemasukanPengeluaran } from '@/types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface KeuanganChartsProps {
  data: PemasukanPengeluaran[];
  loading: boolean;
}

export function KeuanganCharts({ data, loading }: KeuanganChartsProps) {
  const chartData = React.useMemo(() => {
    // Group by date
    const groupedByDate = data.reduce((acc, transaction) => {
      const date = format(new Date(transaction.tanggal), 'dd MMM', { locale: id });
      
      if (!acc[date]) {
        acc[date] = { date, pemasukan: 0, pengeluaran: 0 };
      }
      
      if (transaction.jenis === 'Pemasukan') {
        acc[date].pemasukan += transaction.jumlah;
      } else {
        acc[date].pengeluaran += transaction.jumlah;
      }
      
      return acc;
    }, {} as Record<string, { date: string; pemasukan: number; pengeluaran: number }>);
    
    return Object.values(groupedByDate).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [data]);

  const pieData = React.useMemo(() => {
    const pemasukan = data.filter(t => t.jenis === 'Pemasukan').reduce((sum, t) => sum + t.jumlah, 0);
    const pengeluaran = data.filter(t => t.jenis === 'Pengeluaran').reduce((sum, t) => sum + t.jumlah, 0);
    
    return [
      { name: 'Pemasukan', value: pemasukan, color: '#10B981' },
      { name: 'Pengeluaran', value: pengeluaran, color: '#EF4444' }
    ];
  }, [data]);

  const categoryData = React.useMemo(() => {
    const categories = data.reduce((acc, transaction) => {
      if (!acc[transaction.kategori]) {
        acc[transaction.kategori] = 0;
      }
      acc[transaction.kategori] += transaction.jumlah;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categories)
      .map(([kategori, jumlah]) => ({ kategori, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 10); // Top 10 categories
  }, [data]);

  const chartConfig = {
    pemasukan: {
      label: "Pemasukan",
      color: "#10B981"
    },
    pengeluaran: {
      label: "Pengeluaran", 
      color: "#EF4444"
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="pt-6">
              <div className="h-80 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Bar Chart - Daily Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Harian</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="pemasukan" fill="var(--color-pemasukan)" />
              <Bar dataKey="pengeluaran" fill="var(--color-pengeluaran)" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Pie Chart - Income vs Expense */}
      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Pemasukan vs Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Line Chart - Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Tren Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line 
                type="monotone" 
                dataKey="pemasukan" 
                stroke="var(--color-pemasukan)" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="pengeluaran" 
                stroke="var(--color-pengeluaran)" 
                strokeWidth={2}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Bar Chart - Top Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Top 10 Kategori</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-80">
            <BarChart data={categoryData} layout="horizontal">
              <XAxis type="number" />
              <YAxis dataKey="kategori" type="category" width={100} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="jumlah" fill="#3B82F6" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
