import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  id?: string;
}

export function Toggle({ checked, onChange, disabled = false, label, id }: ToggleProps) {
  const toggleId = id ?? 'toggle';

  return (
    <label
      htmlFor={toggleId}
      className={cn(
        'inline-flex items-center gap-3 select-none',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
      )}
    >
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          'relative inline-flex w-11 h-6 rounded-full flex-shrink-0',
          'transition-colors duration-200 focus-visible:outline-none',
          'focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
          'focus-visible:ring-offset-bg-app',
          checked ? 'bg-brand' : 'bg-surface-press',
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 40 }}
          className={cn(
            'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md',
            checked ? 'left-[calc(100%-22px)]' : 'left-0.5',
          )}
        />
      </button>

      {label && (
        <span className="text-text-sm text-t-default">{label}</span>
      )}
    </label>
  );
}
