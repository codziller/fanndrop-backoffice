import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, FileText, DollarSign, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  useArtist,
  useSuspendArtist,
  useUnsuspendArtist,
  useDeleteArtist,
  useVerifyArtist,
} from '@/api/hooks/useArtists';
import type { Artist } from '@/types/models';
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

type ArtistTab = 'overview' | 'content' | 'transactions' | 'engagement';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'content', label: 'Content' },
  { id: 'transactions', label: 'Transactions' },
  { id: 'engagement', label: 'Engagement' },
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
  pending: 'Unverified',
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
          <Skeleton height={320} />
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
  artist: Artist;
}

function OverviewTab({ artist }: OverviewTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Profile card */}
      <Card padding="md">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-4">
            <Avatar src={artist.avatar} name={artist.name} size="xl" />
            <div className="flex flex-col gap-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-heading-xs font-bold text-t-bold leading-tight">
                  {artist.name}
                </h2>
                {artist.verified && (
                  <CheckCircle2 size={16} className="text-brand flex-shrink-0" />
                )}
              </div>
              <span className="text-text-sm text-t-subtle">@{artist.username}</span>
              {artist.location && (
                <span className="text-text-sm text-t-subtle">{artist.location}</span>
              )}
            </div>
          </div>

          {artist.bio && (
            <p className="text-text-sm text-t-subtle leading-relaxed">{artist.bio}</p>
          )}

          {artist.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {artist.genres.map((g) => (
                <Badge key={g} variant="default" size="sm">
                  {g}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Stats row */}
      <Card padding="md">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <StatItem label="Followers" value={formatNumber(artist.followers)} />
          <StatItem label="Content" value={artist.contentCount.toLocaleString()} />
          <StatItem label="Revenue" value={formatCurrency(artist.revenue)} />
          <StatItem label="Drops Received" value={formatNumber(artist.dropsReceived)} />
        </div>
      </Card>
    </div>
  );
}

// ─── Actions panel ────────────────────────────────────────────────────────────

interface ActionsPanelProps {
  artist: Artist;
  onSuspend: () => void;
  onUnsuspend: () => void;
  onDelete: () => void;
  onVerify: () => void;
  isMutating: boolean;
}

function ActionsPanel({
  artist,
  onSuspend,
  onUnsuspend,
  onDelete,
  onVerify,
  isMutating,
}: ActionsPanelProps) {
  return (
    <Card padding="md">
      <div className="flex flex-col gap-3">
        {/* Status */}
        <div className="flex flex-col gap-2 pb-3 border-b border-border-subtle">
          <p className="text-text-sm font-semibold text-t-subtle">Status</p>
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_BADGE[artist.status] ?? 'default'}>
              {STATUS_LABEL[artist.status] ?? artist.status}
            </Badge>
            {artist.verified && (
              <div className="flex items-center gap-1 text-brand">
                <CheckCircle2 size={14} />
                <span className="text-text-xs font-medium">Verified</span>
              </div>
            )}
          </div>
          <p className="text-text-xs text-t-subtle">
            Joined {formatDate(artist.joinedAt)}
          </p>
        </div>

        {/* Action buttons */}
        <p className="text-text-sm font-semibold text-t-subtle">Actions</p>

        {!artist.verified && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={onVerify}
            disabled={isMutating}
          >
            Verify Artist
          </Button>
        )}

        {artist.status === 'suspended' ? (
          <Button
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={onUnsuspend}
            disabled={isMutating}
          >
            Unsuspend Artist
          </Button>
        ) : (
          <Button
            variant="danger"
            size="sm"
            className="w-full"
            onClick={onSuspend}
            disabled={isMutating || artist.status === 'suspended'}
          >
            Suspend Artist
          </Button>
        )}

        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={() => toast('Notification feature coming soon', { icon: 'ℹ️' })}
        >
          Send Notification
        </Button>

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

// ─── Tab content ──────────────────────────────────────────────────────────────

function ContentTab() {
  return (
    <Card padding="md">
      <EmptyState
        icon={FileText}
        title="Content management coming soon"
        description="Full content browsing and moderation will be available in a future update."
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
        description="Detailed transaction records for this artist will be available in a future update."
      />
    </Card>
  );
}

function EngagementTab() {
  return (
    <Card padding="md">
      <EmptyState
        icon={Activity}
        title="Engagement analytics coming soon"
        description="Detailed engagement metrics will be available in a future update."
      />
    </Card>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ArtistDetailPage() {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: artist, isLoading } = useArtist(id);
  const [activeTab, setActiveTab] = useState<ArtistTab>('overview');
  const [actionConfirm, setActionConfirm] = useState<ActionConfirmState>(CLOSED_ACTION);

  const suspendArtist = useSuspendArtist();
  const unsuspendArtist = useUnsuspendArtist();
  const deleteArtist = useDeleteArtist();
  const verifyArtist = useVerifyArtist();

  const isMutating =
    suspendArtist.isPending ||
    unsuspendArtist.isPending ||
    deleteArtist.isPending ||
    verifyArtist.isPending;

  const handleSuspend = useCallback(() => {
    setActionConfirm({ open: true, type: 'suspend' });
  }, []);

  const handleUnsuspend = useCallback(() => {
    setActionConfirm({ open: true, type: 'unsuspend' });
  }, []);

  const handleDelete = useCallback(() => {
    setActionConfirm({ open: true, type: 'delete' });
  }, []);

  const handleVerify = useCallback(() => {
    verifyArtist.mutate(id);
  }, [verifyArtist, id]);

  function handleConfirm() {
    if (!id) return;

    if (actionConfirm.type === 'suspend') {
      suspendArtist.mutate(id, { onSuccess: () => setActionConfirm(CLOSED_ACTION) });
    } else if (actionConfirm.type === 'unsuspend') {
      unsuspendArtist.mutate(id, { onSuccess: () => setActionConfirm(CLOSED_ACTION) });
    } else if (actionConfirm.type === 'delete') {
      deleteArtist.mutate(id, {
        onSuccess: () => {
          setActionConfirm(CLOSED_ACTION);
          navigate('/artists');
        },
      });
    }
  }

  const confirmConfig = (() => {
    if (actionConfirm.type === 'delete') {
      return {
        title: 'Delete Artist',
        message: `This will permanently delete the artist and all their content. This cannot be undone.`,
        confirmLabel: 'Delete',
        variant: 'danger' as const,
      };
    }
    if (actionConfirm.type === 'unsuspend') {
      return {
        title: 'Unsuspend Artist',
        message: `This artist's account will be restored and they will regain access to the platform.`,
        confirmLabel: 'Unsuspend',
        variant: 'warning' as const,
      };
    }
    return {
      title: 'Suspend Artist',
      message: `This will prevent the artist from accessing their account and publishing content.`,
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
  if (!artist) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <ErrorState message="Artist not found" onRetry={() => navigate('/artists')} />
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
      <PageHeader title={artist.name} subtitle="Artist Profile">
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
              onChange={(id) => setActiveTab(id as ArtistTab)}
            />
          </Card>

          <div>
            {activeTab === 'overview' && <OverviewTab artist={artist} />}
            {activeTab === 'content' && <ContentTab />}
            {activeTab === 'transactions' && <TransactionsTab />}
            {activeTab === 'engagement' && <EngagementTab />}
          </div>
        </div>

        {/* Right: actions panel */}
        <div className="lg:col-span-1">
          <ActionsPanel
            artist={artist}
            onSuspend={handleSuspend}
            onUnsuspend={handleUnsuspend}
            onDelete={handleDelete}
            onVerify={handleVerify}
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
