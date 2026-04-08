
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', simpanan: 0, pinjaman: 0 },
  { month: 'Feb', simpanan: 0, pinjaman: 0 },
  { month: 'Mar', simpanan: 0, pinjaman: 0 },
  { month: 'Apr', simpanan: 0, pinjaman: 0 },
  { month: 'Mei', simpanan: 0, pinjaman: 0 },
  { month: 'Jun', simpanan: 0, pinjaman: 0 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`${label} 2024`}</p>
        <p className="text-green-600">
          Total Simpanan: <span className="font-bold">
            Rp {payload[0].value.toLocaleString('id-ID')}
          </span>
        </p>
        <p className="text-blue-600">
          Total Pinjaman: <span className="font-bold">
            Rp {payload[1].value.toLocaleString('id-ID')}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function SimpananPinjamanAreaChart() {
  // Check if all values are zero to show empty state
  const isEmpty = data.every(item => item.simpanan === 0 && item.pinjaman === 0);
  
  if (isEmpty) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">📈</div>
          <p className="text-gray-500 text-sm">Tidak ada data perbandingan</p>
          <p className="text-gray-400 text-xs">Data akan muncul setelah ada transaksi simpanan dan pinjaman</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorSimpanan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorPinjaman" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#d1d5db' }}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="simpanan" 
            stackId="1"
            stroke="#10b981" 
            fillOpacity={1} 
            fill="url(#colorSimpanan)" 
          />
          <Area 
            type="monotone" 
            dataKey="pinjaman" 
            stackId="1"
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorPinjaman)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
