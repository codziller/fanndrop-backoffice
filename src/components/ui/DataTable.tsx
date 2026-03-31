import { useMemo, useState } from 'react';
import type { ColumnDef, SortingState, Row } from '@tanstack/react-table';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronsUpDown, Inbox } from 'lucide-react';
import { cn } from '@/utils/helpers';
import type { SelectOption } from '@/types/common';
import { Skeleton } from './Skeleton';
import { Button } from './Button';
import { Select } from './Select';

interface PaginationProps {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  enableBulkSelect?: boolean;
  onBulkAction?: (selected: T[]) => void;
  pagination?: PaginationProps;
  onRowClick?: (row: T) => void;
}

const PER_PAGE_OPTIONS: SelectOption[] = [
  { value: '10',  label: '10 / page' },
  { value: '25',  label: '25 / page' },
  { value: '50',  label: '50 / page' },
  { value: '100', label: '100 / page' },
];

const SKELETON_ROWS = 5;

function SortIcon({ isSorted }: { isSorted: false | 'asc' | 'desc' }) {
  if (isSorted === 'asc')  return <ChevronUp   size={14} className="text-brand flex-shrink-0" />;
  if (isSorted === 'desc') return <ChevronDown  size={14} className="text-brand flex-shrink-0" />;
  return <ChevronsUpDown size={14} className="text-t-subtle flex-shrink-0 opacity-50" />;
}

function PaginationBar({ pagination }: { pagination: PaginationProps }) {
  const { page, perPage, total, totalPages, onPageChange, onPerPageChange } = pagination;

  const start = total === 0 ? 0 : (page - 1) * perPage + 1;
  const end   = Math.min(page * perPage, total);

  const pages = useMemo<(number | 'ellipsis-start' | 'ellipsis-end')[]>(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const result: (number | 'ellipsis-start' | 'ellipsis-end')[] = [1];
    if (page > 3) result.push('ellipsis-start');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      result.push(i);
    }
    if (page < totalPages - 2) result.push('ellipsis-end');
    result.push(totalPages);
    return result;
  }, [page, totalPages]);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border-subtle flex-wrap gap-3">
      <span className="text-text-xs text-t-subtle">
        {total === 0 ? 'No results' : `${start}–${end} of ${total}`}
      </span>

      <div className="flex items-center gap-2 flex-wrap">
        <Select
          options={PER_PAGE_OPTIONS}
          value={String(perPage)}
          onChange={(v) => onPerPageChange(Number(v))}
          className="w-32"
        />

        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
          >
            ‹
          </Button>

          {pages.map((p, idx) => {
            if (p === 'ellipsis-start' || p === 'ellipsis-end') {
              return (
                <span key={`${p}-${idx}`} className="px-1.5 text-t-subtle text-text-xs select-none">
                  …
                </span>
              );
            }
            return (
              <Button
                key={p}
                variant={p === page ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => onPageChange(p)}
                aria-label={`Page ${p}`}
                aria-current={p === page ? 'page' : undefined}
                className="min-w-[32px]"
              >
                {p}
              </Button>
            );
          })}

          <Button
            variant="secondary"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="Next page"
          >
            ›
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DataTable<T extends object>({
  columns: columnsProp,
  data,
  isLoading = false,
  emptyMessage = 'No data found.',
  enableBulkSelect = false,
  onBulkAction,
  pagination,
  onRowClick,
}: DataTableProps<T>) {
  const [sorting, setSorting]         = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const selectColumn = useMemo<ColumnDef<T>>(
    () => ({
      id: '__select__',
      header: ({ table }) => (
        <input
          type="checkbox"
          aria-label="Select all rows"
          checked={table.getIsAllRowsSelected()}
          ref={(el) => {
            if (el) el.indeterminate = table.getIsSomeRowsSelected();
          }}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="w-4 h-4 accent-brand cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          aria-label="Select row"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 accent-brand cursor-pointer"
        />
      ),
      size: 40,
      enableSorting: false,
    }),
    [],
  );

  const columns = useMemo(
    () => (enableBulkSelect ? [selectColumn, ...columnsProp] : columnsProp),
    [enableBulkSelect, selectColumn, columnsProp],
  );

  const table = useReactTable<T>({
    data,
    columns,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableRowSelection: enableBulkSelect,
    manualPagination: !!pagination,
  });

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map((r: Row<T>) => r.original);

  const colCount = table.getAllLeafColumns().length;

  return (
    <div className="flex flex-col bg-bg-surface border border-border-subtle shadow-card rounded-none overflow-hidden">
      {/* Bulk action bar */}
      <AnimatePresence>
        {enableBulkSelect && selectedRows.length > 0 && onBulkAction && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-3 px-4 py-2.5 bg-info-bg border-b border-border-subtle"
          >
            <span className="text-text-sm text-info font-medium">
              {selectedRows.length} selected
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onBulkAction(selectedRows)}
            >
              Apply Action
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Sticky header */}
          <thead className="sticky top-0 z-10 bg-bg-surface">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();

                  return (
                    <th
                      key={header.id}
                      onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                      style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                      className={cn(
                        'px-4 py-3 text-left text-text-xs font-semibold text-t-subtle',
                        'border-b border-border-subtle whitespace-nowrap',
                        canSort && 'cursor-pointer select-none hover:text-t-default',
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <span className="inline-flex items-center gap-1.5">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort && <SortIcon isSorted={header.column.getIsSorted()} />}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody>
            {/* Loading skeleton rows */}
            {isLoading &&
              Array.from({ length: SKELETON_ROWS }).map((_, rowIdx) => (
                <tr key={`skeleton-${rowIdx}`} className="border-b border-border-subtle">
                  {Array.from({ length: colCount }).map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-3">
                      <Skeleton height={16} width={colIdx === 0 ? 120 : '80%'} className="my-0.5" />
                    </td>
                  ))}
                </tr>
              ))}

            {/* Empty state */}
            {!isLoading && table.getRowModel().rows.length === 0 && (
              <tr>
                <td colSpan={colCount}>
                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-t-subtle">
                    <Inbox size={36} strokeWidth={1.5} />
                    <p className="text-text-sm">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading &&
              table.getRowModel().rows.map((row, rowIndex) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: rowIndex * 0.03, ease: 'easeOut' }}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(
                    'border-b border-border-subtle transition-colors duration-100',
                    onRowClick ? 'cursor-pointer hover:bg-surface-hover' : 'hover:bg-surface-hover/50',
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-text-sm text-t-default whitespace-nowrap"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </motion.tr>
              ))}
          </tbody>
        </table>
      </div>

      {pagination && <PaginationBar pagination={pagination} />}
    </div>
  );
}
