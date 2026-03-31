import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { Badge } from './Badge';

interface TabItem {
  id: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div
      role="tablist"
      className={cn('flex border-b border-border-subtle', className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative px-4 py-3 text-text-sm font-medium transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus',
              'inline-flex items-center gap-2 flex-shrink-0',
              isActive
                ? 'text-t-bold'
                : 'text-t-subtle hover:text-t-default',
            )}
          >
            {tab.label}

            {tab.count !== undefined && (
              <Badge variant="default" size="sm">
                {tab.count}
              </Badge>
            )}

            {isActive && (
              <motion.span
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
