import type { InputHTMLAttributes, ReactNode } from 'react';
import { useState, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size'> {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  type?: string;
  disabled?: boolean;
  name?: string;
}

export function Input({
  label,
  placeholder,
  value,
  onChange,
  error,
  leftIcon,
  rightIcon,
  type = 'text',
  disabled = false,
  name,
  className,
  id,
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const hasRightSlot = isPassword || rightIcon;

  return (
    <div className={cn('flex flex-col', className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-text-sm text-t-subtle mb-1 font-medium"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3 flex items-center justify-center text-t-subtle pointer-events-none w-4 h-4">
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          name={name}
          type={resolvedType}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full h-11 bg-bg-surface border text-t-default text-text-sm',
            'placeholder:text-t-subtle rounded-none',
            'transition-colors duration-150 focus:outline-none',
            'focus:border-border-focus focus:shadow-focus-brand',
            leftIcon ? 'pl-9' : 'pl-3',
            hasRightSlot ? 'pr-9' : 'pr-3',
            error
              ? 'border-danger text-danger placeholder:text-danger/50'
              : 'border-border',
            disabled && 'border-border-disabled bg-bg-disabled text-t-disabled cursor-not-allowed opacity-60',
          )}
          {...rest}
        />

        {hasRightSlot && (
          <span className="absolute right-3 flex items-center justify-center w-4 h-4">
            {isPassword ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="text-t-subtle hover:text-t-default transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            ) : (
              <span className="text-t-subtle pointer-events-none">{rightIcon}</span>
            )}
          </span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="text-text-xs text-danger overflow-hidden"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
