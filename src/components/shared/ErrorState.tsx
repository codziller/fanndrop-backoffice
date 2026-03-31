import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState = React.memo(function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertTriangle size={48} className="text-danger" strokeWidth={1.5} />

      <p className="text-text-md font-semibold text-t-bold mt-4">
        Something went wrong
      </p>

      {message && (
        <p className="text-text-sm text-t-subtle mt-2 max-w-xs">{message}</p>
      )}

      {onRetry && (
        <div className="mt-6">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            leftIcon={<RefreshCw size={14} />}
          >
            Try again
          </Button>
        </div>
      )}
    </div>
  );
});
