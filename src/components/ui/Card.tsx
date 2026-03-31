import type { ReactNode, MouseEvent } from 'react';
import { cn } from '@/utils/helpers';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: CardPadding;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

const paddingMap: Record<CardPadding, string> = {
  none: 'p-0',
  sm:   'p-4',
  md:   'p-6',
  lg:   'p-8',
};

export function Card({
  children,
  className,
  padding = 'md',
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-bg-surface border border-border-subtle shadow-card rounded-none',
        paddingMap[padding],
        onClick && 'cursor-pointer hover:bg-surface-hover transition-colors duration-150',
        className,
      )}
    >
      {children}
    </div>
  );
}
