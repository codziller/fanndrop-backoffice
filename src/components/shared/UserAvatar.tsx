import React from 'react';
import { cn } from '@/utils/helpers';
import type { AvatarSize } from '@/types/common';
import { Avatar } from '@/components/ui/Avatar';

interface UserAvatarProps {
  avatar?: string;
  name: string;
  sub?: string;
  size?: AvatarSize;
  onClick?: () => void;
}

export const UserAvatar = React.memo(function UserAvatar({
  avatar,
  name,
  sub,
  size = 'sm',
  onClick,
}: UserAvatarProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        onClick && 'cursor-pointer hover:opacity-80',
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <Avatar src={avatar} name={name} size={size} />

      <div className="min-w-0">
        <p className="text-text-sm font-medium text-t-bold leading-tight truncate">
          {name}
        </p>
        {sub && (
          <p className="text-text-xs text-t-subtle leading-tight truncate mt-0.5">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
});
