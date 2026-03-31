import { cn } from '@/utils/helpers';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ width, height, className }: SkeletonProps) {
  const style: React.CSSProperties = {};
  if (width !== undefined) {
    style.width = typeof width === 'number' ? `${width}px` : width;
  }
  if (height !== undefined) {
    style.height = typeof height === 'number' ? `${height}px` : height;
  }

  return (
    <div
      style={style}
      className={cn(
        'bg-surface-hover rounded-none skeleton-shimmer',
        className,
      )}
    />
  );
}
