import { AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { Modal } from './Modal';
import { Button } from './Button';

type ConfirmVariant = 'danger' | 'warning';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isLoading?: boolean;
  variant?: ConfirmVariant;
}

const variantIconMap: Record<ConfirmVariant, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  danger: {
    icon: AlertCircle,
    color: 'text-danger',
    bg: 'bg-danger-bg',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning-bg',
  },
};

const confirmButtonVariantMap: Record<ConfirmVariant, 'danger' | 'secondary'> = {
  danger: 'danger',
  warning: 'secondary',
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  variant = 'danger',
}: ConfirmModalProps) {
  const { icon: Icon, color, bg } = variantIconMap[variant];
  const buttonVariant = confirmButtonVariantMap[variant];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={buttonVariant}
            onClick={onConfirm}
            loading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex gap-4">
        <span
          className={cn(
            'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
            bg,
          )}
        >
          <Icon size={20} className={color} />
        </span>

        <p className="text-text-sm text-t-default leading-relaxed pt-2">
          {message}
        </p>
      </div>
    </Modal>
  );
}
