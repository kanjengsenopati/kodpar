
import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getSavingsComposition } from '@/services/dashboardDataService';
import { Loader2 } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-blue-600">
          Persentase: <span className="font-bold">{data.value}%</span>
        </p>
        <p className="text-green-600">
          Jumlah: <span className="font-bold">
            Rp {(data.payload.amount || 0).toLocaleString('id-ID')}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const renderLabel = ({ name, value }: any) => {
  return value > 0 ? `${value}%` : '0%';
};

export function SimpananPieChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getSavingsComposition();
        setChartData(data);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-80 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">📊</div>
          <p className="text-gray-500 text-sm">Tidak ada data simpanan</p>
          <p className="text-gray-400 text-xs">Data akan muncul setelah ada transaksi simpanan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="75%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            stroke="#ffffff"
            strokeWidth={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
          {Array.isArray(chartData) && chartData.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="flex flex-col">
                <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  {entry.name}
                </span>
                <span className="text-sm font-semibold text-slate-800">
                  {(entry.amount || 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
}
