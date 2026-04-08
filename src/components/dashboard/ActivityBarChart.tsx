
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useActivityChart, ActivityData } from '@/hooks/useActivityChart';

interface ActivityBarChartProps {
  data: ActivityData[];
}

export function ActivityBarChart({ data }: ActivityBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`${value} transaksi`]}
        />
        <Legend />
        <Bar dataKey="simpanan" fill="#22c55e" name="Simpanan" />
        <Bar dataKey="pinjaman" fill="#f59e0b" name="Pinjaman" />
        <Bar dataKey="angsuran" fill="#3b82f6" name="Angsuran" />
      </BarChart>
    </ResponsiveContainer>
  );
}
