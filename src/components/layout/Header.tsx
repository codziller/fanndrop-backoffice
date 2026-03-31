import { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, LogOut } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { Avatar } from '@/components/ui/Avatar';
import { DATE_FILTER_OPTIONS } from '@/utils/constants';
import { cn } from '@/utils/helpers';
import type { DateFilter } from '@/types/api';

type DatePeriod = DateFilter['period'];

export function Header() {
  const { user, logout } = useAuth();
  const { pageTitle, dateFilter, setDateFilter } = useApp();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleDateFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setDateFilter({ period: e.target.value as DatePeriod });
  }

  function handleLogout() {
    setDropdownOpen(false);
    logout();
  }

  return (
    <header
      className={cn(
        'flex-shrink-0 h-16 flex items-center justify-between px-6',
        'bg-bg-surface border-b border-border-subtle',
      )}
    >
      {/* Left — page title */}
      <p className="text-text-md font-semibold text-t-bold truncate">
        {pageTitle}
      </p>

      {/* Right — controls */}
      <div className="flex items-center gap-3">
        {/* Date filter */}
        <div className="relative flex items-center">
          <select
            value={dateFilter.period}
            onChange={handleDateFilterChange}
            className={cn(
              'bg-bg-surface border border-border-subtle text-t-default text-text-sm',
              'h-9 pl-3 pr-8 cursor-pointer outline-none focus:border-border-focus',
              'transition-colors duration-150',
            )}
          >
            {DATE_FILTER_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2 text-t-subtle pointer-events-none"
          />
        </div>

        {/* Notification bell */}
        <button
          type="button"
          aria-label="Notifications"
          className="flex items-center justify-center w-9 h-9 text-t-subtle hover:text-t-default transition-colors duration-150"
        >
          <Bell size={20} />
        </button>

        {/* User avatar + dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 h-9 px-2 text-t-default hover:text-t-bold transition-colors duration-150"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <Avatar
              name={user?.name ?? 'Admin'}
              size="sm"
            />
            <span className="text-text-sm font-medium text-t-default hidden sm:block">
              {user?.name ?? 'Admin'}
            </span>
            <ChevronDown
              size={16}
              className={cn(
                'text-t-subtle transition-transform duration-200',
                dropdownOpen && 'rotate-180',
              )}
            />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'absolute right-0 top-full mt-1 w-48 z-50',
                  'bg-bg-surface border border-border-subtle shadow-lg',
                )}
              >
                {/* User info */}
                <div className="px-4 py-3 border-b border-border-subtle">
                  <p className="text-text-sm font-semibold text-t-bold truncate">
                    {user?.name}
                  </p>
                  <p className="text-text-xs text-t-subtle truncate">
                    {user?.role}
                  </p>
                </div>

                {/* Actions */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className={cn(
                    'w-full flex items-center gap-2 px-4 py-2.5',
                    'text-text-sm text-danger hover:bg-surface-hover',
                    'transition-colors duration-150',
                  )}
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
