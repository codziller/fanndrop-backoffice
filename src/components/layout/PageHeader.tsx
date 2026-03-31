import type { ReactNode } from 'react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/helpers';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  count?: number;
  children?: ReactNode;
}

export function PageHeader({ title, subtitle, count, children }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-row items-start justify-between mb-6')}>
      {/* Left */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <h1 className="text-heading-xs font-bold text-t-bold">{title}</h1>
          {count !== undefined && (
            <Badge variant="default" size="sm">
              {count.toLocaleString('en-NG')}
            </Badge>
          )}
        </div>
        {subtitle && (
          <p className="text-text-sm text-t-subtle">{subtitle}</p>
        )}
      </div>

      {/* Right — action slot */}
      {children && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}
