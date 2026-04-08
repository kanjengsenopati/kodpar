
import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

const data = [
  { subject: 'Kolektibilitas', A: 85, fullMark: 100 },
  { subject: 'Pertumbuhan Aset', A: 78, fullMark: 100 },
  { subject: 'SHU per Anggota', A: 92, fullMark: 100 },
  { subject: 'Likuiditas', A: 88, fullMark: 100 },
  { subject: 'Efisiensi Operasional', A: 75, fullMark: 100 }
];

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
  return (
    <div className="h-80">
      {/* Performance Summary - Top Row (3 items) */}
      <div className="mb-3 grid grid-cols-3 gap-3 text-center">
        {data.slice(0, 3).map((item, index) => (
          <div key={item.subject} className="bg-gray-50 p-2 rounded">
            <div className="text-lg font-bold text-blue-600">{item.A}</div>
            <div className="text-xs text-gray-600">{item.subject}</div>
          </div>
        ))}
      </div>
      
      <ResponsiveContainer width="100%" height="60%">
        <RadarChart data={data} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#e0e7ff" />
          <PolarAngleAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: '#9ca3af' }}
          />
          <Radar
            name="Kinerja"
            dataKey="A"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          <Tooltip content={<CustomTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Performance Summary - Bottom Row (2 items) */}
      <div className="mt-3 grid grid-cols-2 gap-3 text-center max-w-md mx-auto">
        {data.slice(3, 5).map((item, index) => (
          <div key={item.subject} className="bg-gray-50 p-2 rounded">
            <div className="text-lg font-bold text-blue-600">{item.A}</div>
            <div className="text-xs text-gray-600">{item.subject}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
