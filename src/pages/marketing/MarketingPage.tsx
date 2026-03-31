import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ColumnDef } from '@tanstack/react-table';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import {
  useNotificationHistory,
  useSendNotification,
} from '@/api/hooks/useMarketing';
import type { SendNotificationInput } from '@/api/hooks/useMarketing';
import type { PushNotification, NotificationTarget } from '@/types/models';
import { formatRelativeDate, formatPercent } from '@/utils/format';
import { cn } from '@/utils/helpers';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { DataTable } from '@/components/ui/DataTable';
import type { BadgeVariant } from '@/types/common';

// ─── Constants ────────────────────────────────────────────────────────────────

const TAB_ITEMS = [{ id: 'notifications', label: 'Push Notifications' }];

const TARGET_LABELS: Record<NotificationTarget, string> = {
  all: 'All Users',
  artists: 'Artists Only',
  fans: 'Fans Only',
  specific: 'Specific Users',
};

const TARGET_COUNT: Record<NotificationTarget, number> = {
  all: 28_412,
  artists: 3_847,
  fans: 24_565,
  specific: 0,
};

const STATUS_BADGE_MAP: Record<PushNotification['status'], BadgeVariant> = {
  sent: 'success',
  scheduled: 'gold',
  failed: 'danger',
};

// ─── Form schema ──────────────────────────────────────────────────────────────

const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Max 100 characters'),
  body: z.string().min(1, 'Body is required').max(500, 'Max 500 characters'),
  target: z.enum(['all', 'artists', 'fans', 'specific'] as const),
  schedule: z.enum(['now', 'later'] as const),
  scheduledAt: z.string().optional(),
});

type NotificationFormValues = z.infer<typeof notificationSchema>;

// ─── Notification history table ───────────────────────────────────────────────

function NotificationHistoryTable() {
  const { data: history = [], isLoading } = useNotificationHistory();

  const columns = useMemo<ColumnDef<PushNotification>[]>(
    () => [
      {
        id: 'title',
        header: 'Title',
        accessorKey: 'title',
        size: 200,
        cell: ({ getValue }) => (
          <span className="block text-text-sm text-t-bold truncate max-w-[180px]">
            {getValue<string>()}
          </span>
        ),
      },
      {
        id: 'target',
        header: 'Target',
        accessorKey: 'target',
        size: 110,
        cell: ({ getValue }) => (
          <span className="text-text-xs text-t-subtle">
            {TARGET_LABELS[getValue<NotificationTarget>()]}
          </span>
        ),
      },
      {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        size: 90,
        cell: ({ getValue }) => {
          const status = getValue<PushNotification['status']>();
          return (
            <Badge variant={STATUS_BADGE_MAP[status]} size="sm">
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          );
        },
      },
      {
        id: 'sentAt',
        header: 'Sent At',
        size: 120,
        cell: ({ row }) => {
          const date = row.original.sentAt ?? row.original.scheduledAt;
          return (
            <span className="text-text-xs text-t-subtle">
              {date ? formatRelativeDate(date) : '—'}
            </span>
          );
        },
      },
      {
        id: 'openRate',
        header: 'Open Rate',
        accessorKey: 'openRate',
        size: 90,
        cell: ({ row }) => {
          const { status, openRate } = row.original;
          if (status !== 'sent' || openRate == null) {
            return <span className="text-text-xs text-t-subtle">—</span>;
          }
          return (
            <span className="text-text-sm text-t-default font-medium">
              {formatPercent(openRate)}
            </span>
          );
        },
      },
    ],
    [],
  );

  return (
    <Card padding="none">
      <div className="px-6 py-4 border-b border-border-subtle">
        <h3 className="text-text-md font-semibold text-t-bold">History</h3>
      </div>
      <DataTable
        columns={columns}
        data={history}
        isLoading={isLoading}
        emptyMessage="No notifications sent yet."
      />
    </Card>
  );
}

// ─── Notification preview ─────────────────────────────────────────────────────

interface NotificationPreviewProps {
  title: string;
  body: string;
}

function NotificationPreview({ title, body }: NotificationPreviewProps) {
  return (
    <div className="bg-[#1a1a1a] p-4 border border-border-subtle">
      <p className="text-text-xs text-t-subtle mb-2 uppercase tracking-wide">Preview</p>
      <div className="bg-[#2a2a2a] border border-white/10 p-3 flex gap-3 items-start">
        <div className="w-8 h-8 bg-brand flex items-center justify-center flex-shrink-0">
          <Bell size={14} className="text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-text-sm font-semibold text-white leading-tight truncate">
            {title || 'Notification title'}
          </p>
          <p className="text-text-xs text-white/70 mt-1 line-clamp-2 leading-relaxed">
            {body || 'Notification body text will appear here…'}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Compose form ─────────────────────────────────────────────────────────────

interface ComposeFormProps {
  onSend: (values: NotificationFormValues) => void;
  isSending: boolean;
}

function ComposeForm({ onSend, isSending }: ComposeFormProps) {
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      body: '',
      target: 'all',
      schedule: 'now',
      scheduledAt: '',
    },
  });

  const titleValue = watch('title');
  const bodyValue = watch('body');
  const targetValue = watch('target');
  const scheduleValue = watch('schedule');

  const targetOptions: { value: NotificationTarget; label: string }[] = [
    { value: 'all', label: 'All Users' },
    { value: 'artists', label: 'Artists Only' },
    { value: 'fans', label: 'Fans Only' },
  ];

  return (
    <form onSubmit={handleSubmit(onSend)} noValidate className="flex flex-col gap-5">
      {/* Title with counter */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-text-sm text-t-subtle font-medium">Title</label>
          <span
            className={cn(
              'text-text-xs tabular-nums',
              titleValue.length > 90 ? 'text-warning' : 'text-t-subtle',
            )}
          >
            {titleValue.length}/100
          </span>
        </div>
        <input
          type="text"
          placeholder="Enter notification title"
          maxLength={100}
          {...register('title')}
          className={cn(
            'w-full h-11 bg-bg-surface border text-t-default text-text-sm',
            'placeholder:text-t-subtle rounded-none px-3',
            'transition-colors duration-150 focus:outline-none',
            'focus:border-border-focus focus:shadow-focus-brand',
            errors.title ? 'border-danger' : 'border-border',
          )}
        />
        {errors.title && (
          <p className="text-text-xs text-danger">{errors.title.message}</p>
        )}
      </div>

      {/* Body with counter */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <label className="text-text-sm text-t-subtle font-medium">Body</label>
          <span
            className={cn(
              'text-text-xs tabular-nums',
              bodyValue.length > 450 ? 'text-warning' : 'text-t-subtle',
            )}
          >
            {bodyValue.length}/500
          </span>
        </div>
        <textarea
          placeholder="Enter notification body"
          maxLength={500}
          {...register('body')}
          className={cn(
            'w-full h-28 bg-bg-surface border text-t-default text-text-sm',
            'placeholder:text-t-subtle rounded-none px-3 py-2.5 resize-none',
            'transition-colors duration-150 focus:outline-none',
            'focus:border-border-focus focus:shadow-focus-brand',
            errors.body ? 'border-danger' : 'border-border',
          )}
        />
        {errors.body && (
          <p className="text-text-xs text-danger">{errors.body.message}</p>
        )}
      </div>

      {/* Target audience */}
      <Controller
        name="target"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            <label className="text-text-sm text-t-subtle font-medium">Target Audience</label>
            <div className="flex gap-3 flex-wrap">
              {targetOptions.map((opt) => {
                const isActive = field.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      'flex-1 min-w-[100px] px-3 py-2 border text-text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'border-brand bg-brand/8 text-brand'
                        : 'border-border text-t-subtle hover:border-border-focus hover:text-t-default',
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      />

      {/* Schedule */}
      <Controller
        name="schedule"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            <label className="text-text-sm text-t-subtle font-medium">Schedule</label>
            <div className="flex gap-3">
              {(
                [
                  { value: 'now', label: 'Send Now' },
                  { value: 'later', label: 'Schedule for Later' },
                ] as const
              ).map((opt) => {
                const isActive = field.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      'flex-1 px-3 py-2 border text-text-sm font-medium transition-colors duration-150',
                      isActive
                        ? 'border-brand bg-brand/8 text-brand'
                        : 'border-border text-t-subtle hover:border-border-focus hover:text-t-default',
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Date-time input when scheduling */}
            <AnimatePresence>
              {scheduleValue === 'later' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <input
                    type="datetime-local"
                    {...register('scheduledAt')}
                    className={cn(
                      'w-full h-11 bg-bg-surface border border-border text-t-default text-text-sm',
                      'placeholder:text-t-subtle rounded-none px-3 mt-2',
                      'transition-colors duration-150 focus:outline-none',
                      'focus:border-border-focus focus:shadow-focus-brand',
                    )}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      />

      {/* Preview */}
      <NotificationPreview title={titleValue} body={bodyValue} />

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="md"
        loading={isSending}
        className="self-start"
      >
        Send Notification
      </Button>

      {/* Target count hint */}
      <p className="text-text-xs text-t-subtle -mt-3">
        Will reach approximately{' '}
        <strong className="text-t-default">
          {(TARGET_COUNT[targetValue] ?? 0).toLocaleString('en-NG')}
        </strong>{' '}
        users
      </p>
    </form>
  );
}

// ─── Push notifications tab ───────────────────────────────────────────────────

function PushNotificationsTab() {
  const sendNotification = useSendNotification();
  const [confirmData, setConfirmData] = useState<NotificationFormValues | null>(null);

  function handleFormSubmit(values: NotificationFormValues) {
    setConfirmData(values);
  }

  function handleConfirmSend() {
    if (!confirmData) return;

    const input: SendNotificationInput = {
      title: confirmData.title,
      body: confirmData.body,
      target: confirmData.target,
      scheduledAt:
        confirmData.schedule === 'later' && confirmData.scheduledAt
          ? confirmData.scheduledAt
          : undefined,
    };

    sendNotification.mutate(input, {
      onSuccess: () => setConfirmData(null),
    });
  }

  const targetCount = confirmData ? (TARGET_COUNT[confirmData.target] ?? 0) : 0;

  return (
    <>
      <div className="lg:grid lg:grid-cols-5 gap-6 flex flex-col">
        {/* Left: Compose */}
        <div className="lg:col-span-3">
          <Card>
            <h3 className="text-text-md font-semibold text-t-bold mb-5">
              Compose Notification
            </h3>
            <ComposeForm
              onSend={handleFormSubmit}
              isSending={sendNotification.isPending}
            />
          </Card>
        </div>

        {/* Right: History */}
        <div className="lg:col-span-2">
          <NotificationHistoryTable />
        </div>
      </div>

      {/* Confirm send modal */}
      <ConfirmModal
        open={!!confirmData}
        onClose={() => setConfirmData(null)}
        onConfirm={handleConfirmSend}
        title="Confirm Send Notification"
        message={`Send "${confirmData?.title ?? ''}" to ${targetCount.toLocaleString('en-NG')} users?`}
        confirmLabel={
          confirmData?.schedule === 'later' ? 'Schedule' : 'Send Now'
        }
        isLoading={sendNotification.isPending}
        variant="warning"
      />
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('notifications');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-0">
        <h1 className="text-heading-xs font-bold text-t-bold mb-4">Marketing</h1>
        <Tabs tabs={TAB_ITEMS} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div>
        {activeTab === 'notifications' && <PushNotificationsTab />}
      </div>
    </motion.div>
  );
}
