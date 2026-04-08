
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatCurrency } from '@/utils/formatters';
import { useSHUDistributionChart, SHUData } from '@/hooks/useSHUDistributionChart';

interface SHUDistributionChartProps {
  data: SHUData[];
}

export function SHUDistributionChart({ data }: SHUDistributionChartProps) {
  const { prepareSHUChartData } = useSHUDistributionChart();
  
  // Prepare data for charts
  const chartData = prepareSHUChartData(data);
  const COLORS = [
    '#8B5CF6', '#06B6D4', '#10B981', '#F59E0B',
    '#EF4444', '#EC4899', '#6366F1', '#84CC16'
  ];

  // Enhanced 3D-style tooltip for modern UX
  const EnhancedTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = chartData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);
      
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border-0 rounded-xl shadow-2xl ring-1 ring-black/5">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-4 h-4 rounded-full shadow-sm ring-2 ring-white"
              style={{ backgroundColor: data.payload.fill }}
            />
            <h4 className="font-semibold text-gray-900 text-sm">{data.name}</h4>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-8">
              <span className="text-xs text-gray-600">Jumlah:</span>
              <span className="font-bold text-blue-600 text-sm">
                {formatCurrency(data.value)}
              </span>
            </div>
            
            <div className="flex justify-between items-center gap-8">
              <span className="text-xs text-gray-600">Persentase:</span>
              <span className="font-semibold text-purple-600 text-sm">
                {percentage}%
              </span>
            </div>
          </div>
          
          {/* Modern progress indicator */}
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${percentage}%`,
                backgroundColor: data.payload.fill,
                boxShadow: `0 0 8px ${data.payload.fill}40`
              }}
            />
          </div>
        </div>
      );
    }
    return null;
  };

  // Custom label function for 3D effect
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    if (percent < 0.05) return null; // Hide labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-semibold drop-shadow-lg"
        style={{ filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.8))' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <defs>
          {/* 3D shadow effect */}
          <filter id="shadow-dashboard" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.15"/>
          </filter>
        </defs>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomLabel}
          outerRadius={80}
          innerRadius={30}
          fill="#8884d8"
          dataKey="value"
          stroke="#ffffff"
          strokeWidth={2}
          style={{ filter: 'url(#shadow-dashboard)' }}
        >
          {chartData.map((entry, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]}
              style={{
                filter: 'brightness(1.1) saturate(1.2)',
              }}
            />
          ))}
        </Pie>
        <Tooltip content={<EnhancedTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
