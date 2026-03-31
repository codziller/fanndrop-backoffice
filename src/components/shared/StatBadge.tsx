import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { formatNumber } from '@/utils/format';

interface StatBadgeProps {
  icon: LucideIcon;
  value: number;
  label: string;
  trend?: number;
  direction?: 'up' | 'down';
  formatter?: (v: number) => string;
}

export const StatBadge = React.memo(function StatBadge({
  icon: Icon,
  value,
  label,
  trend,
  direction,
  formatter = formatNumber,
}: StatBadgeProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-bg-surface border-b border-border-subtle">
      {/* Left: icon + label */}
      <div className="flex items-center">
        <Icon size={20} className="text-t-subtle flex-shrink-0" />
        <span className="text-text-sm text-t-subtle ml-3">{label}</span>
      </div>

      {/* Right: value + optional trend */}
      <div className="flex items-center gap-2">
        <span className="text-text-md font-semibold text-t-bold">
          {formatter(value)}
        </span>

        {trend !== undefined && direction !== undefined && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-text-xs font-medium',
              direction === 'up' ? 'text-success' : 'text-danger',
            )}
          >
            {direction === 'up' ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
});
