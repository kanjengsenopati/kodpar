
import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { getMemberDistribution } from '@/services/dashboardDataService';
import { Loader2 } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{data.name}</p>
        <p className="text-blue-600">
          Jumlah: <span className="font-bold">{data.value} orang</span>
        </p>
      </div>
    );
  }
  return null;
};

const renderLabel = ({ name, value }: any) => {
  return value > 0 ? `${value}` : '0';
};

export function AnggotaDonutChart() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getMemberDistribution();
        setData(result);
      } catch (error) {
        console.error("Error fetching member distribution data:", error);
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

  if (data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">👥</div>
          <p className="text-gray-500 text-sm">Tidak ada data distribusi anggota</p>
          <p className="text-gray-400 text-xs">Data akan muncul setelah ada anggota terdaftar</p>
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
            innerRadius={40}
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
      
      <div className="flex flex-wrap gap-4 mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-slate-600 font-medium whitespace-nowrap">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
