import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import type { ButtonVariant, ButtonSize } from '@/types/common';
import { Spinner } from './Spinner';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
  form?: string;
}

const variantMap: Record<ButtonVariant, string> = {
  primary:
    'bg-brand text-t-on-btn hover:bg-brand-hover active:bg-brand-press font-semibold',
  secondary:
    'bg-bg-surface border border-border-subtle text-t-default hover:bg-surface-hover',
  danger:
    'bg-danger-bg border border-danger/40 text-danger hover:bg-danger-bg-subtle',
  ghost:
    'bg-transparent text-t-subtle hover:bg-surface-hover',
  link:
    'bg-transparent text-brand underline underline-offset-2 hover:text-brand-hover p-0 h-auto',
};

const sizeMap: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-text-xs gap-1.5',
  md: 'h-10 px-4 text-text-sm gap-2',
  lg: 'h-12 px-6 text-text-md gap-2',
};

const spinnerSizeMap: Record<ButtonSize, 'sm' | 'md'> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  children,
  className,
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <motion.button
      whileTap={isDisabled ? undefined : { scale: 0.98 }}
      transition={{ duration: 0.1 }}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center rounded-none font-medium',
        'transition-colors duration-150 focus-visible:outline-none',
        'focus-visible:ring-2 focus-visible:ring-border-focus focus-visible:ring-offset-2',
        'focus-visible:ring-offset-bg-app select-none',
        variantMap[variant],
        variant !== 'link' && sizeMap[size],
        isDisabled && 'opacity-50 cursor-not-allowed pointer-events-none',
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Spinner
          size={spinnerSizeMap[size]}
          color={variant === 'primary' ? 'white' : 'brand'}
          className="mr-2 flex-shrink-0"
        />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      {children}
      {!loading && rightIcon && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </motion.button>
  );
}
