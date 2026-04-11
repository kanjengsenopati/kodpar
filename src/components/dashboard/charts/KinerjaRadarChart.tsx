
import React, { useEffect, useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { getKoperasiPerformance } from '@/services/dashboardDataService';
import { Loader2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-blue-600">
          Skor: <span className="font-bold">{payload[0].value}/100</span>
        </p>
      </div>
    );
  }
  return null;
};

export function KinerjaRadarChart() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getKoperasiPerformance();
        setData(result);
      } catch (error) {
        console.error("Error fetching performance data:", error);
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

  return (
    <div className="h-80">
      {/* Performance Summary - Top Row */}
      <div className="mb-3 grid grid-cols-3 gap-3 text-center">
        {(data || []).slice(0, 3).map((item) => (
          <div key={item.subject} className="bg-gray-50/50 p-2 rounded-xl border border-gray-100">
            <div className="text-lg font-bold text-blue-600">{item.A}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-tight">
              {item.subject}
            </div>
          </div>
        ))}
      </div>
      
      <ResponsiveContainer width="100%" height="60%">
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#e0e7ff" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Kinerja"
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.15}
            strokeWidth={3}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Performance Summary - Bottom Row */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-center max-w-[280px] mx-auto">
        {(data || []).slice(3, 5).map((item) => (
          <div key={item.subject} className="bg-gray-50/50 p-2 rounded-xl border border-gray-100">
            <div className="text-lg font-bold text-blue-600">{item.A}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider leading-tight">
              {item.subject}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
