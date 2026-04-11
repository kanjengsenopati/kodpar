
import React, { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getSavingsVsLoansData } from '@/services/dashboardDataService';
import { Loader2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`${label} ${new Date().getFullYear()}`}</p>
        <div className="space-y-1 mt-1">
          <p className="text-emerald-600 text-sm">
            Simpanan: <span className="font-bold">Rp {(payload[0].value || 0).toLocaleString('id-ID')}</span>
          </p>
          <p className="text-blue-600 text-sm">
            Pinjaman: <span className="font-bold">Rp {(payload[1].value || 0).toLocaleString('id-ID')}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export function SimpananPinjamanAreaChart() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getSavingsVsLoansData();
        setData(result);
      } catch (error) {
        console.error("Error fetching savings vs loans data:", error);
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

  const isEmpty = data.every(item => item.simpanan === 0 && item.pinjaman === 0);

  if (isEmpty) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">📈</div>
          <p className="text-gray-500 text-sm">Tidak ada data perbandingan</p>
          <p className="text-gray-400 text-xs">Data akan muncul setelah ada mutasi keuangan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSimpanan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPinjaman" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#64748b' }}
            tickFormatter={(value) => value === 0 ? '0' : `${(value / 1000).toLocaleString('id-ID')}rb`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Area 
            type="monotone" 
            dataKey="simpanan" 
            name="Total Simpanan"
            stroke="#10b981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorSimpanan)" 
          />
          <Area 
            type="monotone" 
            dataKey="pinjaman" 
            name="Total Pinjaman"
            stroke="#3b82f6" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorPinjaman)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
