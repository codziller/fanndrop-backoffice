import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, DollarSign, Users } from 'lucide-react';
import {
  useFan,
  useSuspendFan,
  useUnsuspendFan,
  useDeleteFan,
} from '@/api/hooks/useFans';
import type { Fan } from '@/types/models';
import type { BadgeVariant } from '@/types/common';
import { formatCurrency, formatNumber, formatDate } from '@/utils/format';
import { PageHeader } from '@/components/layout/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Tabs } from '@/components/ui/Tabs';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorState } from '@/components/shared/ErrorState';

// ─── Types ────────────────────────────────────────────────────────────────────

type ActionConfirmType = 'suspend' | 'unsuspend' | 'delete';

interface ActionConfirmState {
  open: boolean;
  type: ActionConfirmType;
}

const CLOSED_ACTION: ActionConfirmState = { open: false, type: 'suspend' };

type FanTab = 'overview' | 'activity' | 'transactions' | 'followed';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'activity', label: 'Activity' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'followed', label: 'Followed Artists' },
] as const;

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

// ─── Skeleton layout ──────────────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton width={80} height={32} />
        <Skeleton width={200} height={28} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Skeleton height={48} />
          <Skeleton height={300} />
        </div>
        <div className="lg:col-span-1">
          <Skeleton height={260} />
        </div>
      </div>
    </div>
  );
}

// ─── Stat item ────────────────────────────────────────────────────────────────

interface StatItemProps {
  label: string;
  value: string;
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-heading-xs font-bold text-t-bold">{value}</span>
      <span className="text-text-xs text-t-subtle">{label}</span>
    </div>
  );
}

// ─── Overview tab ─────────────────────────────────────────────────────────────

interface OverviewTabProps {
  fan: Fan;
}

function OverviewTab({ fan }: OverviewTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Profile card */}
      <Card padding="md">
        <div className="flex items-start gap-4">
          <Avatar src={fan.avatar} name={fan.name} size="xl" />
          <div className="flex flex-col gap-1 min-w-0">
            <h2 className="text-heading-xs font-bold text-t-bold leading-tight">
              {fan.name}
            </h2>
            <span className="text-text-sm text-t-subtle">@{fan.username}</span>
            <span className="text-text-sm text-t-subtle">
              Joined {formatDate(fan.joinedAt)}
            </span>
          </div>
        </div>
      </Card>

      {/* Stats row */}
      <Card padding="md">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <StatItem
            label="Drops Balance"
            value={`${formatNumber(fan.dropsBalance)} Drops`}
          />
          <StatItem label="Total Spent" value={formatCurrency(fan.totalSpent)} />
          <StatItem label="Artists Followed" value={fan.artistsFollowed.toString()} />
          <StatItem label="Posts Liked" value={fan.postsLiked.toLocaleString()} />
        </div>
      </Card>
    </div>
  );
}

// ─── Actions panel ────────────────────────────────────────────────────────────

interface ActionsPanelProps {
  fan: Fan;
  onSuspend: () => void;
  onUnsuspend: () => void;
  onDelete: () => void;
  isMutating: boolean;
}

function ActionsPanel({
  fan,
  onSuspend,
  onUnsuspend,
  onDelete,
  isMutating,
}: ActionsPanelProps) {
  return (
    <Card padding="md">
      <div className="flex flex-col gap-3">
        {/* Status */}
        <div className="flex flex-col gap-2 pb-3 border-b border-border-subtle">
          <p className="text-text-sm font-semibold text-t-subtle">Status</p>
          <Badge variant={STATUS_BADGE[fan.status] ?? 'default'}>
            {STATUS_LABEL[fan.status] ?? fan.status}
          </Badge>
          <p className="text-text-xs text-t-subtle">
            Joined {formatDate(fan.joinedAt)}
          </p>
        </div>

        {/* Action buttons */}
        <p className="text-text-sm font-semibold text-t-subtle">Actions</p>

        {fan.status === 'suspended' ? (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={onUnsuspend}
            disabled={isMutating}
          >
            Unsuspend Fan
          </Button>
        ) : (
          <Button
            variant="danger"
            size="sm"
            className="w-full"
            onClick={onSuspend}
            disabled={isMutating}
          >
            Suspend Fan
          </Button>
        )}

        <div className="border-t border-border-subtle pt-3">
          <Button
            variant="danger"
            size="sm"
            className="w-full"
            onClick={onDelete}
            disabled={isMutating}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ─── Tab placeholders ─────────────────────────────────────────────────────────

function ActivityTab() {
  return (
    <Card padding="md">
      <EmptyState
        icon={Activity}
        title="Activity feed coming soon"
        description="Fan activity history will be available in a future update."
      />
    </Card>
  );
}

function TransactionsTab() {
  return (
    <Card padding="md">
      <EmptyState
        icon={DollarSign}
        title="Transaction history coming soon"
        description="Detailed transaction records for this fan will be available in a future update."
      />
    </Card>
  );
}

function FollowedArtistsTab() {
  return (
    <Card padding="md">
      <EmptyState
        icon={Users}
        title="Followed artists coming soon"
        description="The list of artists this fan follows will be available in a future update."
      />
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function FanDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: fan, isLoading } = useFan(id);
  const [activeTab, setActiveTab] = useState<FanTab>('overview');
  const [actionConfirm, setActionConfirm] = useState<ActionConfirmState>(CLOSED_ACTION);

  const suspendFan = useSuspendFan();
  const unsuspendFan = useUnsuspendFan();
  const deleteFan = useDeleteFan();

  const isMutating =
    suspendFan.isPending || unsuspendFan.isPending || deleteFan.isPending;

  const handleSuspend = useCallback(() => {
    setActionConfirm({ open: true, type: 'suspend' });
  }, []);

  const handleUnsuspend = useCallback(() => {
    setActionConfirm({ open: true, type: 'unsuspend' });
  }, []);

  const handleDelete = useCallback(() => {
    setActionConfirm({ open: true, type: 'delete' });
  }, []);

  function handleConfirm() {
    if (!id) return;

    if (actionConfirm.type === 'suspend') {
      suspendFan.mutate(id, { onSuccess: () => setActionConfirm(CLOSED_ACTION) });
    } else if (actionConfirm.type === 'unsuspend') {
      unsuspendFan.mutate(id, { onSuccess: () => setActionConfirm(CLOSED_ACTION) });
    } else if (actionConfirm.type === 'delete') {
      deleteFan.mutate(id, {
        onSuccess: () => {
          setActionConfirm(CLOSED_ACTION);
          navigate('/fans');
        },
      });
    }
  }

  const confirmConfig = (() => {
    if (actionConfirm.type === 'delete') {
      return {
        title: 'Delete Fan',
        message: `This will permanently delete this fan account and all associated data. This cannot be undone.`,
        confirmLabel: 'Delete',
        variant: 'danger' as const,
      };
    }
    if (actionConfirm.type === 'unsuspend') {
      return {
        title: 'Unsuspend Fan',
        message: `This fan's account will be restored and they will regain access to the platform.`,
        confirmLabel: 'Unsuspend',
        variant: 'warning' as const,
      };
    }
    return {
      title: 'Suspend Fan',
      message: `This will prevent the fan from accessing their account.`,
      confirmLabel: 'Suspend',
      variant: 'danger' as const,
    };
  })();

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <DetailSkeleton />
      </motion.div>
    );
  }

  // Not found
  if (!fan) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ErrorState message="Fan not found" onRetry={() => navigate('/fans')} />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-6"
    >
      <PageHeader title={fan.name} subtitle="Fan Profile">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft size={14} />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: tabs content */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          <Card padding="none">
            <Tabs
              tabs={[...TABS]}
              activeTab={activeTab}
              onChange={(tabId) => setActiveTab(tabId as FanTab)}
            />
          </Card>

          <div>
            {activeTab === 'overview' && <OverviewTab fan={fan} />}
            {activeTab === 'activity' && <ActivityTab />}
            {activeTab === 'transactions' && <TransactionsTab />}
            {activeTab === 'followed' && <FollowedArtistsTab />}
          </div>
        </div>

        {/* Right: actions panel */}
        <div className="lg:col-span-1">
          <ActionsPanel
            fan={fan}
            onSuspend={handleSuspend}
            onUnsuspend={handleUnsuspend}
            onDelete={handleDelete}
            isMutating={isMutating}
          />
        </div>
      </div>

      <ConfirmModal
        open={actionConfirm.open}
        onClose={() => setActionConfirm(CLOSED_ACTION)}
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
