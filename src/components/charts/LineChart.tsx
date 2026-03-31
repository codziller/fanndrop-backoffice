import React from 'react';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Skeleton } from '@/components/ui/Skeleton';

interface LineChartProps {
  data: Array<{ week: string; artists: number; fans: number }>;
  isLoading?: boolean;
}

interface LegendPayloadItem {
  value: string;
  color: string;
}

interface LegendContentProps {
  payload?: LegendPayloadItem[];
}

function CustomLegend({ payload }: LegendContentProps) {
  if (!payload) return null;

  return (
    <div className="flex items-center justify-center gap-6 mt-2">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-1.5">
          <span
            style={{ backgroundColor: entry.color }}
            className="w-2 h-2 rounded-full flex-shrink-0"
          />
          <span style={{ color: '#9AA4B2', fontSize: 12 }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function LineChartInner({ data, isLoading = false }: LineChartProps) {
  if (isLoading) {
    return <Skeleton width="100%" height={240} />;
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <RechartsLineChart
        data={data}
        margin={{ top: 5, right: 10, bottom: 0, left: 10 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#202939"
          vertical={false}
        />

        <XAxis
          dataKey="week"
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
          formatter={(value, name) => {
            const amount = typeof value === 'number' ? value : Number(value ?? 0);
            const label = String(name ?? '');
            return [
              amount.toLocaleString('en-NG'),
              label.charAt(0).toUpperCase() + label.slice(1),
            ];
          }}
        />

        <Legend content={<CustomLegend />} />

        <Line
          type="monotone"
          dataKey="artists"
          name="Artists"
          stroke="#21B576"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#21B576' }}
          isAnimationActive={false}
        />

        <Line
          type="monotone"
          dataKey="fans"
          name="Fans"
          stroke="#769FF2"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#769FF2' }}
          isAnimationActive={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}

export const LineChart = React.memo(LineChartInner);
