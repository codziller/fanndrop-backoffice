import { cn } from '@/utils/helpers';

type SpinnerSize = 'sm' | 'md' | 'lg';
type SpinnerColor = 'brand' | 'white' | 'subtle';

interface SpinnerProps {
  size?: SpinnerSize;
  color?: SpinnerColor;
  className?: string;
}

const sizeMap: Record<SpinnerSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

const colorMap: Record<SpinnerColor, string> = {
  brand:  'border-brand',
  white:  'border-white',
  subtle: 'border-t-subtle',
};

export function Spinner({ size = 'md', color = 'brand', className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        'inline-block rounded-full border-2 border-transparent animate-spin',
        sizeMap[size],
        colorMap[color],
        className,
      )}
      style={{ borderTopColor: 'currentColor' }}
    />
  );
}
