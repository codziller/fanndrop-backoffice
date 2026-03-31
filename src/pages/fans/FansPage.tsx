import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical } from 'lucide-react';
import {
  useFans,
  useSuspendFan,
  useUnsuspendFan,
  useDeleteFan,
} from '@/api/hooks/useFans';
import type { FanFilters } from '@/api/hooks/useFans';
import type { Fan } from '@/types/models';
import type { BadgeVariant } from '@/types/common';
import { ARTIST_STATUS_OPTIONS, SEARCH_DEBOUNCE_MS } from '@/utils/constants';
import { formatCurrency, formatNumber, formatDate } from '@/utils/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { UserAvatar } from '@/components/shared/UserAvatar';

// ─── Types ────────────────────────────────────────────────────────────────────

type ConfirmType = 'suspend' | 'unsuspend' | 'delete';

interface ConfirmModalState {
  open: boolean;
  type: ConfirmType;
  fanId: string;
  fanName: string;
}

const CLOSED_MODAL: ConfirmModalState = {
  open: false,
  type: 'suspend',
  fanId: '',
  fanName: '',
};

// ─── Status badge map ─────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, BadgeVariant> = {
  active: 'success',
  suspended: 'danger',
  pending: 'warning',
  inactive: 'default',
};

const STATUS_LABEL: Record<string, string> = {
  active: 'Active',
  suspended: 'Suspended',
  pending: 'Pending',
  inactive: 'Inactive',
};

// ─── Sort options ─────────────────────────────────────────────────────────────

const FAN_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'spent', label: 'Most Spent' },
  { value: 'drops', label: 'Most Drops' },
  { value: 'following', label: 'Most Following' },
] as const;

const SORT_OPTIONS = [...FAN_SORT_OPTIONS];
const STATUS_OPTIONS = [...ARTIST_STATUS_OPTIONS];

// ─── FanActionsMenu ───────────────────────────────────────────────────────────

interface FanActionsMenuProps {
  fan: Fan;
  onSuspend: (fan: Fan) => void;
  onUnsuspend: (fan: Fan) => void;
  onDelete: (fan: Fan) => void;
  onView: (fan: Fan) => void;
}

function FanActionsMenu({
  fan,
  onSuspend,
  onUnsuspend,
  onDelete,
  onView,
}: FanActionsMenuProps) {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Fan actions"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="w-8 h-8 flex items-center justify-center text-t-subtle hover:text-t-default hover:bg-surface-hover transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        <MoreVertical size={16} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -4 }}
              transition={{ duration: 0.1 }}
              className="absolute right-0 z-20 mt-1 w-44 bg-bg-surface border border-border-subtle shadow-elevated"
            >
              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-text-sm text-t-default hover:bg-surface-hover transition-colors"
                onClick={() => { close(); onView(fan); }}
              >
                View Profile
              </button>

              {fan.status === 'suspended' ? (
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-text-sm text-t-default hover:bg-surface-hover transition-colors"
                  onClick={() => { close(); onUnsuspend(fan); }}
                >
                  Unsuspend
                </button>
              ) : (
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-text-sm text-warning hover:bg-warning-bg transition-colors"
                  onClick={() => { close(); onSuspend(fan); }}
                >
                  Suspend
                </button>
              )}

              <div className="border-t border-border-subtle" />

              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-text-sm text-danger hover:bg-danger-bg transition-colors"
                onClick={() => { close(); onDelete(fan); }}
              >
                Delete
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Filter bar ───────────────────────────────────────────────────────────────

interface FilterBarProps {
  searchInput: string;
  onSearchInputChange: (v: string) => void;
  status: string;
  onStatusChange: (v: string) => void;
  sort: string;
  onSortChange: (v: string) => void;
  hasActiveFilters: boolean;
  onClear: () => void;
}

function FilterBar({
  searchInput,
  onSearchInputChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  hasActiveFilters,
  onClear,
}: FilterBarProps) {
  return (
    <Card padding="sm">
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Search fans..."
          value={searchInput}
          onChange={onSearchInputChange}
          leftIcon={<Search size={14} />}
          className="w-64"
        />
        <Select
          options={STATUS_OPTIONS}
          value={status}
          onChange={onStatusChange}
          className="w-40"
        />
        <Select
          options={SORT_OPTIONS}
          value={sort}
          onChange={onSortChange}
          className="w-48"
        />
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            Clear
          </Button>
        )}
      </div>
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const DEFAULT_FILTERS: FanFilters = {
  search: '',
  status: 'all',
  sort: 'newest',
  page: 1,
  perPage: 25,
};

export default function FansPage() {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<FanFilters>(DEFAULT_FILTERS);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>(CLOSED_MODAL);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = useFans(filters);

  const suspendFan = useSuspendFan();
  const unsuspendFan = useUnsuspendFan();
  const deleteFan = useDeleteFan();

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setFilters((f) => ({ ...f, search: searchInput, page: 1 }));
    }, SEARCH_DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  const hasActiveFilters =
    searchInput !== '' ||
    filters.status !== 'all' ||
    filters.sort !== 'newest';

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setFilters(DEFAULT_FILTERS);
  }, []);

  const handleSuspend = useCallback((fan: Fan) => {
    setConfirmModal({ open: true, type: 'suspend', fanId: fan.id, fanName: fan.name });
  }, []);

  const handleUnsuspend = useCallback((fan: Fan) => {
    setConfirmModal({ open: true, type: 'unsuspend', fanId: fan.id, fanName: fan.name });
  }, []);

  const handleDelete = useCallback((fan: Fan) => {
    setConfirmModal({ open: true, type: 'delete', fanId: fan.id, fanName: fan.name });
  }, []);

  const handleView = useCallback((fan: Fan) => {
    navigate(`/fans/${fan.id}`);
  }, [navigate]);

  function handleConfirm() {
    const { type, fanId } = confirmModal;
    if (!fanId) return;

    if (type === 'suspend') {
      suspendFan.mutate(fanId, { onSuccess: () => setConfirmModal(CLOSED_MODAL) });
    } else if (type === 'unsuspend') {
      unsuspendFan.mutate(fanId, { onSuccess: () => setConfirmModal(CLOSED_MODAL) });
    } else if (type === 'delete') {
      deleteFan.mutate(fanId, { onSuccess: () => setConfirmModal(CLOSED_MODAL) });
    }
  }

  const isMutating =
    suspendFan.isPending || unsuspendFan.isPending || deleteFan.isPending;

  const columns = useMemo<ColumnDef<Fan>[]>(
    () => [
      {
        id: 'fan',
        header: 'Fan',
        accessorKey: 'name',
        size: 220,
        cell: ({ row }) => (
          <UserAvatar
            avatar={row.original.avatar}
            name={row.original.name}
            sub={`@${row.original.username}`}
            size="sm"
          />
        ),
      },
      {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
        size: 200,
        cell: ({ getValue }) => (
          <span className="text-text-sm text-t-subtle">{getValue<string>()}</span>
        ),
      },
      {
        id: 'dropsBalance',
        header: 'Drops Balance',
        accessorKey: 'dropsBalance',
        size: 130,
        cell: ({ getValue }) => (
          <span className="text-text-sm text-gold font-medium">
            {formatNumber(getValue<number>())} Drops
          </span>
        ),
      },
      {
        id: 'totalSpent',
        header: 'Total Spent',
        accessorKey: 'totalSpent',
        size: 120,
        cell: ({ getValue }) => (
          <span className="text-t-bold font-medium">{formatCurrency(getValue<number>())}</span>
        ),
      },
      {
        id: 'artistsFollowed',
        header: 'Artists Followed',
        accessorKey: 'artistsFollowed',
        size: 130,
        cell: ({ getValue }) => getValue<number>().toString(),
      },
      {
        id: 'joined',
        header: 'Joined',
        accessorKey: 'joinedAt',
        size: 120,
        cell: ({ getValue }) => (
          <span className="text-text-sm text-t-subtle">{formatDate(getValue<string>())}</span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        size: 110,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          return (
            <Badge variant={STATUS_BADGE[status] ?? 'default'}>
              {STATUS_LABEL[status] ?? status}
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        enableSorting: false,
        size: 48,
        cell: ({ row }) => (
          <FanActionsMenu
            fan={row.original}
            onSuspend={handleSuspend}
            onUnsuspend={handleUnsuspend}
            onDelete={handleDelete}
            onView={handleView}
          />
        ),
      },
    ],
    [handleSuspend, handleUnsuspend, handleDelete, handleView],
  );

  const confirmConfig = (() => {
    if (confirmModal.type === 'delete') {
      return {
        title: 'Delete Fan',
        message: `This will permanently delete ${confirmModal.fanName} and all their data. This cannot be undone.`,
        confirmLabel: 'Delete',
        variant: 'danger' as const,
      };
    }
    if (confirmModal.type === 'unsuspend') {
      return {
        title: 'Unsuspend Fan',
        message: `${confirmModal.fanName}'s account will be restored and they will regain access to the platform.`,
        confirmLabel: 'Unsuspend',
        variant: 'warning' as const,
      };
    }
    return {
      title: 'Suspend Fan',
      message: `This will prevent ${confirmModal.fanName} from accessing their account.`,
      confirmLabel: 'Suspend',
      variant: 'danger' as const,
    };
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <PageHeader title="Fans" count={data?.total} />

      <FilterBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        status={filters.status ?? 'all'}
        onStatusChange={(v) => setFilters((f) => ({ ...f, status: v as FanFilters['status'], page: 1 }))}
        sort={filters.sort ?? 'newest'}
        onSortChange={(v) => setFilters((f) => ({ ...f, sort: v, page: 1 }))}
        hasActiveFilters={hasActiveFilters}
        onClear={handleClearFilters}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="No fans found."
        enableBulkSelect
        onRowClick={(row) => navigate(`/fans/${row.id}`)}
        pagination={
          data
            ? {
                page: data.page,
                perPage: data.perPage,
                total: data.total,
                totalPages: data.totalPages,
                onPageChange: (p) => setFilters((f) => ({ ...f, page: p })),
                onPerPageChange: (pp) => setFilters((f) => ({ ...f, perPage: pp, page: 1 })),
              }
            : undefined
        }
      />

      <ConfirmModal
        open={confirmModal.open}
        onClose={() => setConfirmModal(CLOSED_MODAL)}
        onConfirm={handleConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmLabel={confirmConfig.confirmLabel}
        isLoading={isMutating}
        variant={confirmConfig.variant}
      />
    </motion.div>
  );
}
