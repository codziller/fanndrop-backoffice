import type { ReactNode } from 'react';
import { cn } from '@/utils/helpers';
import type { BadgeVariant } from '@/types/common';

type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  success: 'bg-success-bg text-success',
  danger:  'bg-danger-bg text-danger',
  warning: 'bg-warning-bg text-warning',
  info:    'bg-info-bg text-info',
  gold:    'bg-gold-bg text-gold',
  default: 'bg-surface-press text-t-subtle',
};

const sizeMap: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-text-xxs',
  md: 'px-2.5 py-1 text-text-xs',
};

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full',
        variantMap[variant],
        sizeMap[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
