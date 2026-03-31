import { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ColumnDef } from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MoreVertical, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useArtists,
  useSuspendArtist,
  useUnsuspendArtist,
  useDeleteArtist,
  useVerifyArtist,
} from '@/api/hooks/useArtists';
import type { ArtistFilters } from '@/api/hooks/useArtists';
import type { Artist } from '@/types/models';
import type { BadgeVariant } from '@/types/common';
import {
  ARTIST_STATUS_OPTIONS,
  ARTIST_SORT_OPTIONS,
  GENRE_OPTIONS,
  SEARCH_DEBOUNCE_MS,
} from '@/utils/constants';
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
  artistId: string;
  artistName: string;
}

const CLOSED_MODAL: ConfirmModalState = {
  open: false,
  type: 'suspend',
  artistId: '',
  artistName: '',
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
  pending: 'Unverified',
  inactive: 'Inactive',
};

// ─── Genre options ────────────────────────────────────────────────────────────

const GENRE_SELECT_OPTIONS = [
  { value: 'all', label: 'All Genres' },
  ...GENRE_OPTIONS.map((g) => ({ value: g, label: g })),
];

// ─── Sort options (mutable copy for Select) ───────────────────────────────────

const SORT_OPTIONS = [...ARTIST_SORT_OPTIONS];
const STATUS_OPTIONS = [...ARTIST_STATUS_OPTIONS];

// ─── ArtistActionsMenu ────────────────────────────────────────────────────────

interface ArtistActionsMenuProps {
  artist: Artist;
  onSuspend: (artist: Artist) => void;
  onUnsuspend: (artist: Artist) => void;
  onDelete: (artist: Artist) => void;
  onVerify: (artist: Artist) => void;
  onView: (artist: Artist) => void;
}

function ArtistActionsMenu({
  artist,
  onSuspend,
  onUnsuspend,
  onDelete,
  onVerify,
  onView,
}: ArtistActionsMenuProps) {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Artist actions"
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
                onClick={() => { close(); onView(artist); }}
              >
                View Profile
              </button>

              {artist.status === 'pending' && (
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-text-sm text-success hover:bg-success-bg transition-colors"
                  onClick={() => { close(); onVerify(artist); }}
                >
                  Verify
                </button>
              )}

              {artist.status === 'suspended' ? (
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-text-sm text-t-default hover:bg-surface-hover transition-colors"
                  onClick={() => { close(); onUnsuspend(artist); }}
                >
                  Unsuspend
                </button>
              ) : (
                <button
                  type="button"
                  className="w-full px-4 py-2.5 text-left text-text-sm text-warning hover:bg-warning-bg transition-colors"
                  onClick={() => { close(); onSuspend(artist); }}
                >
                  Suspend
                </button>
              )}

              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-text-sm text-t-default hover:bg-surface-hover transition-colors"
                onClick={() => {
                  close();
                  toast('Notification feature coming soon', { icon: 'ℹ️' });
                }}
              >
                Send Notification
              </button>

              <div className="border-t border-border-subtle" />

              <button
                type="button"
                className="w-full px-4 py-2.5 text-left text-text-sm text-danger hover:bg-danger-bg transition-colors"
                onClick={() => { close(); onDelete(artist); }}
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
  genre: string;
  onGenreChange: (v: string) => void;
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
  genre,
  onGenreChange,
  sort,
  onSortChange,
  hasActiveFilters,
  onClear,
}: FilterBarProps) {
  return (
    <Card padding="sm">
      <div className="flex flex-wrap gap-3 items-center">
        <Input
          placeholder="Search artists..."
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
          options={GENRE_SELECT_OPTIONS}
          value={genre}
          onChange={onGenreChange}
          placeholder="All Genres"
          className="w-44"
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

const DEFAULT_FILTERS: ArtistFilters = {
  search: '',
  status: 'all',
  genre: 'all',
  sort: 'newest',
  page: 1,
  perPage: 25,
};

export default function ArtistsPage() {
  const navigate = useNavigate();

  // Separate raw search input (pre-debounce) from committed filters
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<ArtistFilters>(DEFAULT_FILTERS);
  const [confirmModal, setConfirmModal] = useState<ConfirmModalState>(CLOSED_MODAL);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data, isLoading } = useArtists(filters);

  const suspendArtist = useSuspendArtist();
  const unsuspendArtist = useUnsuspendArtist();
  const deleteArtist = useDeleteArtist();
  const verifyArtist = useVerifyArtist();

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
    (filters.genre !== 'all' && filters.genre !== '') ||
    filters.sort !== 'newest';

  const handleClearFilters = useCallback(() => {
    setSearchInput('');
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Action handlers
  const handleSuspend = useCallback((artist: Artist) => {
    setConfirmModal({ open: true, type: 'suspend', artistId: artist.id, artistName: artist.name });
  }, []);

  const handleUnsuspend = useCallback((artist: Artist) => {
    setConfirmModal({ open: true, type: 'unsuspend', artistId: artist.id, artistName: artist.name });
  }, []);

  const handleDelete = useCallback((artist: Artist) => {
    setConfirmModal({ open: true, type: 'delete', artistId: artist.id, artistName: artist.name });
  }, []);

  const handleVerify = useCallback((artist: Artist) => {
    verifyArtist.mutate(artist.id);
  }, [verifyArtist]);

  const handleView = useCallback((artist: Artist) => {
    navigate(`/artists/${artist.id}`);
  }, [navigate]);

  function handleConfirm() {
    const { type, artistId } = confirmModal;
    if (!artistId) return;

    if (type === 'suspend') {
      suspendArtist.mutate(artistId, { onSuccess: () => setConfirmModal(CLOSED_MODAL) });
    } else if (type === 'unsuspend') {
      unsuspendArtist.mutate(artistId, { onSuccess: () => setConfirmModal(CLOSED_MODAL) });
    } else if (type === 'delete') {
      deleteArtist.mutate(artistId, { onSuccess: () => setConfirmModal(CLOSED_MODAL) });
    }
  }

  const isMutating =
    suspendArtist.isPending || unsuspendArtist.isPending || deleteArtist.isPending;

  // Column definitions
  const columns = useMemo<ColumnDef<Artist>[]>(
    () => [
      {
        id: 'artist',
        header: 'Artist',
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
        id: 'genres',
        header: 'Genres',
        accessorKey: 'genres',
        enableSorting: false,
        size: 180,
        cell: ({ getValue }) => {
          const genres = getValue<string[]>().slice(0, 3);
          return (
            <div className="flex flex-wrap gap-1">
              {genres.map((g) => (
                <Badge key={g} variant="default" size="sm">
                  {g}
                </Badge>
              ))}
            </div>
          );
        },
      },
      {
        id: 'followers',
        header: 'Followers',
        accessorKey: 'followers',
        size: 100,
        cell: ({ getValue }) => formatNumber(getValue<number>()),
      },
      {
        id: 'content',
        header: 'Content',
        accessorKey: 'contentCount',
        size: 90,
        cell: ({ getValue }) => getValue<number>().toLocaleString(),
      },
      {
        id: 'revenue',
        header: 'Revenue',
        accessorKey: 'revenue',
        size: 110,
        cell: ({ getValue }) => (
          <span className="text-t-bold font-medium">{formatCurrency(getValue<number>())}</span>
        ),
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
          <ArtistActionsMenu
            artist={row.original}
            onSuspend={handleSuspend}
            onUnsuspend={handleUnsuspend}
            onDelete={handleDelete}
            onVerify={handleVerify}
            onView={handleView}
          />
        ),
      },
    ],
    [handleSuspend, handleUnsuspend, handleDelete, handleVerify, handleView],
  );

  // Confirm modal copy
  const confirmConfig = useMemo(() => {
    if (confirmModal.type === 'delete') {
      return {
        title: 'Delete Artist',
        message: `This will permanently delete ${confirmModal.artistName} and all their content. This cannot be undone.`,
        confirmLabel: 'Delete',
        variant: 'danger' as const,
      };
    }
    if (confirmModal.type === 'unsuspend') {
      return {
        title: 'Unsuspend Artist',
        message: `${confirmModal.artistName}'s account will be restored and they will regain access to the platform.`,
        confirmLabel: 'Unsuspend',
        variant: 'warning' as const,
      };
    }
    return {
      title: 'Suspend Artist',
      message: `This will prevent ${confirmModal.artistName} from accessing their account and publishing content.`,
      confirmLabel: 'Suspend',
      variant: 'danger' as const,
    };
  }, [confirmModal]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <PageHeader title="Artists" count={data?.total}>
        <Button variant="ghost" size="sm" leftIcon={<Download size={14} />}>
          Export
        </Button>
      </PageHeader>

      <FilterBar
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        status={filters.status ?? 'all'}
        onStatusChange={(v) => setFilters((f) => ({ ...f, status: v as ArtistFilters['status'], page: 1 }))}
        genre={filters.genre ?? 'all'}
        onGenreChange={(v) => setFilters((f) => ({ ...f, genre: v === 'all' ? 'all' : v, page: 1 }))}
        sort={filters.sort ?? 'newest'}
        onSortChange={(v) => setFilters((f) => ({ ...f, sort: v, page: 1 }))}
        hasActiveFilters={hasActiveFilters}
        onClear={handleClearFilters}
      />

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyMessage="No artists found."
        enableBulkSelect
        onRowClick={(row) => navigate(`/artists/${row.id}`)}
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
