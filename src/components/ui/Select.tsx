import { useRef, useEffect, useId, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/utils/helpers';
import type { SelectOption } from '@/types/common';

interface SelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  label,
  options,
  value,
  onChange,
  error,
  placeholder = 'Select an option',
  disabled = false,
  className,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();

  const selectedOption = options.find((o) => o.value === value);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  function handleSelect(optionValue: string) {
    onChange(optionValue);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cn('flex flex-col relative', className)}>
      {label && (
        <label
          htmlFor={generatedId}
          className="text-text-sm text-t-subtle mb-1 font-medium"
        >
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        id={generatedId}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          'w-full h-11 bg-bg-surface border text-text-sm rounded-none',
          'px-3 flex items-center justify-between gap-2',
          'transition-colors duration-150 focus:outline-none',
          'focus:border-border-focus focus:shadow-focus-brand',
          error ? 'border-danger' : 'border-border',
          selectedOption ? 'text-t-default' : 'text-t-subtle',
          disabled && 'border-border-disabled bg-bg-disabled text-t-disabled cursor-not-allowed opacity-60',
          open && !error && 'border-border-focus shadow-focus-brand',
        )}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="flex-shrink-0 text-t-subtle"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute top-full left-0 right-0 z-50 mt-1',
              'bg-bg-surface border border-border-subtle shadow-elevated',
              'max-h-60 overflow-y-auto rounded-none',
            )}
          >
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'flex items-center justify-between px-3 py-2.5 text-text-sm cursor-pointer',
                    'transition-colors duration-100 rounded-none',
                    isSelected
                      ? 'text-t-bold bg-surface-hover'
                      : 'text-t-default hover:bg-surface-hover',
                  )}
                >
                  <span>{option.label}</span>
                  {isSelected && (
                    <Check size={14} className="text-brand flex-shrink-0" />
                  )}
                </li>
              );
            })}

            {options.length === 0 && (
              <li className="px-3 py-2.5 text-text-sm text-t-subtle">
                No options available
              </li>
            )}
          </motion.ul>
        )}
      </AnimatePresence>

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
