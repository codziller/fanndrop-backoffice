import type { ReactNode } from 'react';
import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/utils/helpers';
import type { ModalSize } from '@/types/common';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: ModalSize;
}

const sizeMap: Record<ModalSize, string> = {
  sm: 'max-w-[480px]',
  md: 'max-w-[640px]',
  lg: 'max-w-[800px]',
};

const panelVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

const overlayVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit:    { opacity: 0, transition: { duration: 0.15 } },
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleEscape]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={cn(
            'fixed inset-0 z-50 flex items-center justify-center p-4',
            'bg-black/70 backdrop-blur-sm',
          )}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className={cn(
              'w-full flex flex-col rounded-none',
              'bg-bg-surface border border-border-subtle shadow-modal',
              sizeMap[size],
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle flex-shrink-0">
              <h2
                id="modal-title"
                className="text-text-md font-semibold text-t-bold"
              >
                {title}
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className={cn(
                  'w-8 h-8 flex items-center justify-center text-t-subtle',
                  'hover:text-t-default hover:bg-surface-hover rounded-none',
                  'transition-colors duration-150 focus:outline-none',
                  'focus-visible:ring-2 focus-visible:ring-border-focus',
                )}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto max-h-[70vh] p-6 flex-1">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="border-t border-border-subtle p-4 flex justify-end gap-3 flex-shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
