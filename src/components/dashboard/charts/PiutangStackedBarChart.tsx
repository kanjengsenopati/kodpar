
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { month: 'Jan', piutang: 0, terbayar: 0, tunggakan: 0 },
  { month: 'Feb', piutang: 0, terbayar: 0, tunggakan: 0 },
  { month: 'Mar', piutang: 0, terbayar: 0, tunggakan: 0 },
  { month: 'Apr', piutang: 0, terbayar: 0, tunggakan: 0 },
  { month: 'Mei', piutang: 0, terbayar: 0, tunggakan: 0 },
  { month: 'Jun', piutang: 0, terbayar: 0, tunggakan: 0 }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{`${label} 2024`}</p>
        <p className="text-blue-600">
          Total Piutang: <span className="font-bold">
            Rp {payload[0].value.toLocaleString('id-ID')}
          </span>
        </p>
        <p className="text-green-600">
          Terbayar: <span className="font-bold">
            Rp {payload[1].value.toLocaleString('id-ID')}
          </span>
        </p>
        <p className="text-red-600">
          Tunggakan: <span className="font-bold">
            Rp {payload[2].value.toLocaleString('id-ID')}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

export function PiutangStackedBarChart() {
  // Check if all values are zero to show empty state
  const isEmpty = data.every(item => item.piutang === 0 && item.terbayar === 0 && item.tunggakan === 0);
  
  if (isEmpty) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">📊</div>
          <p className="text-gray-500 text-sm">Tidak ada data piutang</p>
          <p className="text-gray-400 text-xs">Data akan muncul setelah ada transaksi piutang</p>
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
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="piutang" stackId="a" fill="#3b82f6" name="Total Piutang" />
          <Bar dataKey="terbayar" stackId="a" fill="#10b981" name="Terbayar" />
          <Bar dataKey="tunggakan" stackId="a" fill="#ef4444" name="Tunggakan" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
