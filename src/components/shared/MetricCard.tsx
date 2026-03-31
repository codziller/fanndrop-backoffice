import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { formatNumber } from '@/utils/format';
import { useCountUp } from '@/hooks/useCountUp';
import { Skeleton } from '@/components/ui/Skeleton';

interface MetricCardProps {
  title: string;
  value: number;
  trend?: number;
  direction?: 'up' | 'down';
  icon: LucideIcon;
  accentColor: string;
  formatter?: (v: number) => string;
  isLoading?: boolean;
}

export const MetricCard = React.memo(function MetricCard({
  title,
  value,
  trend,
  direction,
  icon: Icon,
  accentColor,
  formatter = formatNumber,
  isLoading = false,
}: MetricCardProps) {
  const animatedValue = useCountUp(isLoading ? 0 : value);

  const iconBgStyle: React.CSSProperties = {
    backgroundColor: `${accentColor}26`, // 15% opacity in hex (≈0x26)
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-bg-surface border border-border-subtle shadow-card p-6"
    >
      {/* Header row */}
      <div className="flex items-start justify-between">
        <p className="text-text-sm text-t-subtle mb-1">{title}</p>
        <span
          className="inline-flex items-center justify-center flex-shrink-0"
          style={{ width: 40, height: 40, ...iconBgStyle }}
        >
          <Icon size={20} color={accentColor} />
        </span>
      </div>

      {/* Value */}
      {isLoading ? (
        <Skeleton width={96} height={28} className="mt-1" />
      ) : (
        <p className="text-heading-xs font-bold text-t-bold">
          {formatter(animatedValue)}
        </p>
      )}

      {/* Trend */}
      {(trend !== undefined || isLoading) && (
        <div className="mt-2 flex items-center gap-1">
          {isLoading ? (
            <Skeleton width={60} height={16} />
          ) : trend !== undefined && direction !== undefined ? (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-text-sm font-medium',
                direction === 'up' ? 'text-success' : 'text-danger',
              )}
            >
              {direction === 'up' ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              {Math.abs(trend).toFixed(1)}%
            </span>
          ) : null}
        </div>
      )}
    </motion.div>
  );
});
