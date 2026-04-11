
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getLoanGrowthData } from '@/services/dashboardDataService';
import { Loader2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`${label} ${new Date().getFullYear()}`}</p>
        <p className="text-blue-600">
          Pinjaman Baru: <span className="font-bold">
            Rp {(payload[0].value || 0).toLocaleString('id-ID')}
          </span>
        </p>
        <p className="text-green-600">
          Repayment: <span className="font-bold">
            Rp {(payload[1].value || 0).toLocaleString('id-ID')}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function PinjamanBarChart() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getLoanGrowthData();
        setData(result);
      } catch (error) {
        console.error("Error fetching loan growth data:", error);
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

  const isEmpty = data.every(item => item.pinjaman === 0 && item.lunas === 0);
  
  if (isEmpty) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">📈</div>
          <p className="text-gray-500 text-sm">Tidak ada data pinjaman</p>
          <p className="text-gray-400 text-xs">Data akan muncul setelah ada transaksi pinjaman</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => value === 0 ? '0' : `${(value / 10000).toLocaleString('id-ID')}rb`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="pinjaman" fill="#3b82f6" name="Pinjaman Baru" radius={[4, 4, 0, 0]} />
          <Bar dataKey="lunas" fill="#10b981" name="Repayment" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
