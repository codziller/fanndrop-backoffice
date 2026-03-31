import React from 'react';
import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { Skeleton } from '@/components/ui/Skeleton';

interface BarDef {
  dataKey: string;
  color: string;
  name: string;
}

interface BarChartProps {
  data: Array<Record<string, string | number>>;
  bars: Array<BarDef>;
  xAxisKey: string;
  height?: number;
  isLoading?: boolean;
  stacked?: boolean;
}

function BarChartInner({
  data,
  bars,
  xAxisKey,
  height,
  isLoading = false,
  stacked = false,
}: BarChartProps) {
  if (isLoading) {
    return <Skeleton width="100%" height={height ?? 240} />;
  }

  return (
    <ResponsiveContainer width="100%" height={height ?? 240}>
      <RechartsBarChart
        data={data}
        margin={{ top: 5, right: 10, bottom: 0, left: 10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#202939"
          vertical={false}
        />

        <XAxis
          dataKey={xAxisKey}
          tick={{ fill: '#9AA4B2', fontSize: 12 }}
          axisLine={{ stroke: '#4B5565' }}
          tickLine={false}
        />

        <YAxis
          tick={{ fill: '#9AA4B2', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: '#121926',
            border: '1px solid #4B5565',
            borderRadius: 0,
          }}
          labelStyle={{ color: '#CDD5DF' }}
          itemStyle={{ color: '#CDD5DF' }}
          cursor={{ fill: 'rgba(255,255,255,0.04)' }}
        />

        {bars.map((bar) => (
          <Bar
            key={bar.dataKey}
            dataKey={bar.dataKey}
            name={bar.name}
            fill={bar.color}
            stackId={stacked ? 'stack' : undefined}
            radius={[0, 0, 0, 0]}
            isAnimationActive={false}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}

export const BarChart = React.memo(BarChartInner);
