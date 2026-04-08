
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const data = [
  { name: 'Simpanan Pokok', value: 0, amount: 0 },
  { name: 'Simpanan Wajib', value: 0, amount: 0 },
  { name: 'Simpanan Sukarela', value: 0, amount: 0 }
];

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
            Rp {data.payload.amount.toLocaleString('id-ID')}
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
  // Check if all values are zero to show empty state
  const isEmpty = data.every(item => item.value === 0);
  
  if (isEmpty) {
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
            data={data}
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
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      {/* Legend inside component container */}
      <div className="mt-2 flex justify-center space-x-4 bg-gray-50 p-3 rounded-lg">
        {data.map((entry, index) => (
          <div key={entry.name} className="flex items-center">
            <div 
              className="w-3 h-3 rounded mr-2"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
