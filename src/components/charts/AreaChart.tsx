import React from 'react';
import {
  ResponsiveContainer,
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Skeleton } from '@/components/ui/Skeleton';

interface AreaChartProps {
  data: Array<{ date: string; revenue: number }>;
  isLoading?: boolean;
}

function AreaChartInner({ data, isLoading = false }: AreaChartProps) {
  if (isLoading) {
    return <Skeleton width="100%" height={280} />;
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RechartsAreaChart
        data={data}
        margin={{ top: 5, right: 10, bottom: 0, left: 10 }}
      >
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#21B576" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#21B576" stopOpacity={0.02} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#202939"
          vertical={false}
        />

        <XAxis
          dataKey="date"
          tick={{ fill: '#9AA4B2', fontSize: 12 }}
          axisLine={{ stroke: '#4B5565' }}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: '#9AA4B2', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `₦${(v / 1000).toFixed(0)}K`}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: '#121926',
            border: '1px solid #4B5565',
            borderRadius: 0,
          }}
          labelStyle={{ color: '#CDD5DF' }}
          itemStyle={{ color: '#6ACDA3' }}
          formatter={(v: number) => [`₦${v.toLocaleString('en-NG')}`, 'Revenue']}
        />

        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#21B576"
          strokeWidth={2}
          fill="url(#revenueGradient)"
          isAnimationActive={false}
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}

export const AreaChart = React.memo(AreaChartInner);
