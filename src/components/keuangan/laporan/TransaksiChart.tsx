
import React from 'react';
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency } from '@/utils/formatters';

interface ChartDataItem {
  name: string;
  pemasukan: number;
  pengeluaran: number;
}

interface TransaksiChartProps {
  data: ChartDataItem[];
  title: string;
  showLegend?: boolean;
  chartType?: 'bar' | 'line';
  height?: number;
}

const COLORS = {
  pemasukan: "#3b82f6", // Blue
  pengeluaran: "#ef4444", // Red
};

export default function TransaksiChart({ 
  data, 
  title, 
  showLegend = true,
  chartType = 'bar',
  height = 300
}: TransaksiChartProps) {
  // Create a chart-compatible formatter function that adapts our formatCurrency
  const chartCurrencyFormatter = (value: number, name?: string) => {
    return formatCurrency(value);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            pemasukan: { label: "Pemasukan", color: COLORS.pemasukan },
            pengeluaran: { label: "Pengeluaran", color: COLORS.pengeluaran },
          }}
        >
          <div style={{ height }}>
            {chartType === 'bar' ? (
              <BarChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => 
                    value >= 1000000
                      ? `${(value / 1000000).toFixed(0)} JT`
                      : value >= 1000
                      ? `${(value / 1000).toFixed(0)} RB`
                      : value.toString()
                  }
                />
                <ChartTooltip content={<ChartTooltipContent formatter={chartCurrencyFormatter} />} />
                <Bar dataKey="pemasukan" fill={COLORS.pemasukan} />
                <Bar dataKey="pengeluaran" fill={COLORS.pengeluaran} />
                {showLegend && <ChartLegend content={<ChartLegendContent />} />}
              </BarChart>
            ) : (
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => 
                    value >= 1000000
                      ? `${(value / 1000000).toFixed(0)} JT`
                      : value >= 1000
                      ? `${(value / 1000).toFixed(0)} RB`
                      : value.toString()
                  }
                />
                <ChartTooltip content={<ChartTooltipContent formatter={chartCurrencyFormatter} />} />
                <Line 
                  type="monotone" 
                  dataKey="pemasukan" 
                  stroke={COLORS.pemasukan} 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="pengeluaran" 
                  stroke={COLORS.pengeluaran} 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                />
                {showLegend && <ChartLegend content={<ChartLegendContent />} />}
              </LineChart>
            )}
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
