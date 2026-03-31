import React from 'react';
import {
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { Skeleton } from '@/components/ui/Skeleton';

interface PieDataItem {
  type: string;
  count: number;
  percentage: number;
}

interface PieChartProps {
  data: Array<PieDataItem>;
  isLoading?: boolean;
}

const COLOR_MAP: Record<string, string> = {
  Audio: '#21B576',
  Video: '#769FF2',
  Campaign: '#E0C196',
  Album: '#F9B05A',
  Poll: '#F26283',
};

const FALLBACK_COLORS = [
  '#21B576',
  '#769FF2',
  '#E0C196',
  '#F9B05A',
  '#F26283',
  '#9AA4B2',
];

function getColor(type: string, index: number): string {
  return COLOR_MAP[type] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

interface PieTooltipEntry {
  payload: PieDataItem;
}

interface PieTooltipProps {
  active?: boolean;
  payload?: PieTooltipEntry[];
}

function CustomTooltip({ active, payload }: PieTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const item = payload[0];
  const data = item.payload;

  return (
    <div
      style={{
        backgroundColor: '#121926',
        border: '1px solid #4B5565',
        borderRadius: 0,
        padding: '8px 12px',
      }}
    >
      <p style={{ color: '#CDD5DF', fontSize: 13, marginBottom: 4 }}>
        {data.type}
      </p>
      <p style={{ color: '#6ACDA3', fontSize: 13 }}>
        {data.count.toLocaleString('en-NG')} &mdash; {data.percentage}%
      </p>
    </div>
  );
}

function PieChartInner({ data, isLoading = false }: PieChartProps) {
  if (isLoading) {
    return <Skeleton width="100%" height={280} />;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <ResponsiveContainer width="100%" height={280}>
        <RechartsPieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="type"
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            strokeWidth={0}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${entry.type}`}
                fill={getColor(entry.type, index)}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </RechartsPieChart>
      </ResponsiveContainer>

      {/* Custom legend */}
      <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
        {data.map((entry, index) => (
          <div key={entry.type} className="flex items-center gap-1.5">
            <span
              style={{ backgroundColor: getColor(entry.type, index) }}
              className="w-2 h-2 rounded-full flex-shrink-0"
            />
            <span className="text-text-xs text-t-subtle">{entry.type}</span>
            <span className="text-text-xs text-t-default font-medium">
              {entry.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export const PieChart = React.memo(PieChartInner);
