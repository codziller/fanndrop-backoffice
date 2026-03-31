import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { DateFilter } from '@/types/api';

interface AppContextValue {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  dateFilter: DateFilter;
  setDateFilter: (filter: DateFilter) => void;
  pageTitle: string;
  setPageTitle: (title: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_DATE_FILTER: DateFilter = { period: 'month' };

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>(DEFAULT_DATE_FILTER);
  const [pageTitle, setPageTitle] = useState('Dashboard');

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev);
  }, []);

  return (
    <AppContext.Provider
      value={{
        sidebarCollapsed,
        toggleSidebar,
        dateFilter,
        setDateFilter,
        pageTitle,
        setPageTitle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
