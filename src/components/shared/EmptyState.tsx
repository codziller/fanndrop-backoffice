import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export const EmptyState = React.memo(function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && (
        <Icon size={48} className="text-t-disabled" strokeWidth={1.5} />
      )}

      <p className="text-text-md font-semibold text-t-subtle mt-4">{title}</p>

      {description && (
        <p className="text-text-sm text-t-disabled mt-2 max-w-xs">
          {description}
        </p>
      )}

      {action && (
        <div className="mt-6">
          <Button variant="secondary" size="sm" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
});
