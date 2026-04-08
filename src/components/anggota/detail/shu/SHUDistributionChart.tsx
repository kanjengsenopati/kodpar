
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/utils/formatters';
import { useSHUDistributionChart, SHUData } from '@/hooks/useSHUDistributionChart';
import { TrendingUp, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';

interface SHUDistributionChartProps {
  data: SHUData[];
}

export function SHUDistributionChart({ data }: SHUDistributionChartProps) {
  const { prepareSHUChartData, getSHUChartColors } = useSHUDistributionChart();
  
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
    <Card className="shadow-xl border-0 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 backdrop-blur-sm">
      <CardHeader className="pb-4 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-t-lg">
        <CardTitle className="flex items-center gap-3 text-xl font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          Distribusi SHU Anggota
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Visualisasi pembagian Sisa Hasil Usaha dengan teknologi modern
        </p>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Tabs defaultValue="pie" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100/80 backdrop-blur-sm">
            <TabsTrigger 
              value="pie" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <PieChartIcon className="h-4 w-4" />
              3D Pie Chart
            </TabsTrigger>
            <TabsTrigger 
              value="bar" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg transition-all duration-200"
            >
              <BarChart3 className="h-4 w-4" />
              Bar Chart
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pie" className="space-y-6">
            {/* Modern 3D Pie Chart */}
            <div className="relative">
              {/* Background glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-2xl blur-xl" />
              
              <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl ring-1 ring-black/5">
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {/* 3D shadow effect */}
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#000000" floodOpacity="0.15"/>
                        </filter>
                      </defs>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={120}
                        innerRadius={45}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="#ffffff"
                        strokeWidth={3}
                        style={{ filter: 'url(#shadow)' }}
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
                </div>
              </div>
            </div>

            {/* Modern Summary Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm p-4 rounded-xl border border-blue-200/50 shadow-lg">
                <div className="text-2xl font-bold text-blue-700 mb-1">
                  {chartData.length}
                </div>
                <div className="text-xs text-blue-600 font-medium">Total Kategori</div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur-sm p-4 rounded-xl border border-blue-200/50 shadow-lg">
                <div className="text-lg font-bold text-blue-700 mb-1 truncate">
                  {formatCurrency(chartData.reduce((sum, item) => sum + item.value, 0))}
                </div>
                <div className="text-xs text-blue-600 font-medium">Total SHU</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm p-4 rounded-xl border border-purple-200/50 shadow-lg">
                <div className="text-lg font-bold text-purple-700 mb-1 truncate">
                  {chartData.length > 0 ? formatCurrency(Math.max(...chartData.map(item => item.value))) : 'Rp 0'}
                </div>
                <div className="text-xs text-purple-600 font-medium">Nilai Tertinggi</div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 backdrop-blur-sm p-4 rounded-xl border border-amber-200/50 shadow-lg">
                <div className="text-lg font-bold text-amber-700 mb-1 truncate">
                  {chartData.length > 0 ? formatCurrency(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length) : 'Rp 0'}
                </div>
                <div className="text-xs text-amber-600 font-medium">Rata-rata</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="bar" className="space-y-4">
            {/* Enhanced Bar Chart */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20 rounded-2xl blur-xl" />
              
              <div className="relative bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-xl ring-1 ring-black/5">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient id="modernBarGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="50%" stopColor="#6366F1" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-20" stroke="#E5E7EB" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={80}
                        fontSize={11}
                        tick={{ fill: '#6B7280' }}
                      />
                      <YAxis 
                        tickFormatter={(value) => 
                          value >= 1000000
                            ? `${(value / 1000000).toFixed(0)}M`
                            : value >= 1000
                            ? `${(value / 1000).toFixed(0)}K`
                            : value.toString()
                        }
                        fontSize={11}
                        tick={{ fill: '#6B7280' }}
                      />
                      <Tooltip content={<EnhancedTooltip />} />
                      <Bar 
                        dataKey="value" 
                        fill="url(#modernBarGradient)"
                        radius={[6, 6, 0, 0]}
                        stroke="#ffffff"
                        strokeWidth={1}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
