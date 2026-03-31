import { cn, getInitials } from '@/utils/helpers';
import type { AvatarSize } from '@/types/common';

interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  online?: boolean;
  className?: string;
}

const sizeMap: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-text-xxs',
  sm: 'w-8 h-8 text-text-xs',
  md: 'w-10 h-10 text-text-sm',
  lg: 'w-12 h-12 text-text-md',
  xl: 'w-16 h-16 text-text-xl',
};

const indicatorSizeMap: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
};

export function Avatar({
  src,
  name,
  size = 'md',
  online,
  className,
}: AvatarProps) {
  return (
    <span className={cn('relative inline-flex flex-shrink-0', className)}>
      <span
        className={cn(
          'rounded-full overflow-hidden inline-flex items-center justify-center',
          'bg-surface-press text-brand font-semibold select-none',
          sizeMap[size],
        )}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span aria-label={name}>{getInitials(name)}</span>
        )}
      </span>

      {online !== undefined && (
        <span
          aria-label={online ? 'Online' : 'Offline'}
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-bg-app',
            indicatorSizeMap[size],
            online ? 'bg-brand' : 'bg-t-subtle',
          )}
        />
      )}
    </span>
  );
}
