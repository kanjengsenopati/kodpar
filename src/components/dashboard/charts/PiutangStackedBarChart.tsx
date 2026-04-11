
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getPiutangAnalysis } from '@/services/dashboardDataService';
import { Loader2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const total = payload.reduce((sum: number, entry: any) => sum + entry.value, 0);
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`Bulan ${label}`}</p>
        <div className="space-y-1 mt-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <span className="text-xs" style={{ color: entry.color }}>{entry.name}:</span>
              <span className="text-xs font-bold">Rp {entry.value.toLocaleString('id-ID')}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-1 mt-1 flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-gray-900">Total:</span>
            <span className="text-xs font-bold text-gray-900">Rp {total.toLocaleString('id-ID')}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function PiutangStackedBarChart() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getPiutangAnalysis();
        setData(result);
      } catch (error) {
        console.error("Error fetching piutang analysis data:", error);
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

  const isEmpty = data.every(item => item.lancar === 0 && item.kurangLancar === 0 && item.macet === 0);

  if (isEmpty) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">📊</div>
          <p className="text-gray-500 text-sm">Tidak ada data piutang</p>
          <p className="text-gray-400 text-xs">Data akan muncul setelah ada pinjaman aktif</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => value === 0 ? '0' : `${(value / 1000000).toFixed(0)}Jt`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="lancar" name="Lancar" stackId="a" fill="#10B981" />
          <Bar dataKey="kurangLancar" name="Kurang Lancar" stackId="a" fill="#F59E0B" />
          <Bar dataKey="macet" name="Macet" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
