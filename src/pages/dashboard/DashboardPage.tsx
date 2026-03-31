import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Users,
  Music2,
  Heart,
  Coins,
  UserPlus,
  FileText,
  Activity,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Share2,
  Bookmark,
} from 'lucide-react';

import { PageHeader } from '@/components/layout/PageHeader';
import { MetricCard } from '@/components/shared/MetricCard';
import { StatBadge } from '@/components/shared/StatBadge';
import { AreaChart } from '@/components/charts/AreaChart';
import { LineChart } from '@/components/charts/LineChart';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/ui/Avatar';
import { useApp } from '@/context/AppContext';
import {
  useOverviewMetrics,
  useRevenueChart,
  useUserAcquisition,
  useContentDistribution,
  useTopArtists,
  useTopCampaigns,
  useDropPackageSales,
  useTopContent,
  useEngagementSnapshot,
  useTransactions,
  usePaymentChannels,
  useRecentActivity,
} from '@/api/hooks/useMetrics';
import { formatCurrency, formatNumber, formatRelativeDate } from '@/utils/format';
import type { ContentType, ActivityEventType } from '@/types/models';
import type { BadgeVariant } from '@/types/common';
import type { DateFilter } from '@/types/api';

// ─── Shared card header ──────────────────────────────────────────────────────

interface CardTitleProps {
  title: string;
}

const CardTitle = React.memo(function CardTitle({ title }: CardTitleProps) {
  return (
    <h2 className="text-text-sm font-semibold text-t-bold mb-4">{title}</h2>
  );
});

// ─── Section 1: KPI MetricCards ──────────────────────────────────────────────

interface MetricSectionProps {
  dateFilter: DateFilter;
}

const MetricSection = React.memo(function MetricSection({ dateFilter }: MetricSectionProps) {
  const { data, isLoading } = useOverviewMetrics(dateFilter);

  const cards = useMemo(
    () => [
      {
        title: 'Total Revenue',
        icon: DollarSign,
        accentColor: '#E0C196',
        key: 'totalRevenue' as const,
        formatter: formatCurrency,
      },
      {
        title: 'Total Users',
        icon: Users,
        accentColor: '#769FF2',
        key: 'totalUsers' as const,
        formatter: formatNumber,
      },
      {
        title: 'Active Artists',
        icon: Music2,
        accentColor: '#6ACDA3',
        key: 'activeArtists' as const,
        formatter: formatNumber,
      },
      {
        title: 'Active Fans',
        icon: Heart,
        accentColor: '#F26283',
        key: 'activeFans' as const,
        formatter: formatNumber,
      },
      {
        title: 'Total Drops Sold',
        icon: Coins,
        accentColor: '#E0C196',
        key: 'totalDropsSold' as const,
        formatter: formatCurrency,
      },
      {
        title: 'New Signups',
        icon: UserPlus,
        accentColor: '#6ACDA3',
        key: 'newSignups' as const,
        formatter: formatNumber,
      },
      {
        title: 'Content Published',
        icon: FileText,
        accentColor: '#769FF2',
        key: 'contentPublished' as const,
        formatter: formatNumber,
      },
      {
        title: 'Avg. Daily Users',
        icon: Activity,
        accentColor: '#F9B05A',
        key: 'avgDau' as const,
        formatter: formatNumber,
      },
    ],
    [],
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => {
        const metric = data?.[card.key];
        return (
          <MetricCard
            key={card.key}
            title={card.title}
            value={metric?.value ?? 0}
            trend={metric?.trend}
            direction={metric?.direction}
            icon={card.icon}
            accentColor={card.accentColor}
            formatter={card.formatter}
            isLoading={isLoading}
          />
        );
      })}
    </div>
  );
});

// ─── Section 2: Revenue Chart ─────────────────────────────────────────────────

interface RevenueSectionProps {
  dateFilter: DateFilter;
}

const RevenueSection = React.memo(function RevenueSection({ dateFilter }: RevenueSectionProps) {
  const { data, isLoading } = useRevenueChart(dateFilter);

  return (
    <Card>
      <CardTitle title="Revenue Over Time" />
      <AreaChart data={data ?? []} isLoading={isLoading} />
    </Card>
  );
});

// ─── Section 3: Acquisition + Distribution ───────────────────────────────────

interface AcquisitionSectionProps {
  dateFilter: DateFilter;
}

const AcquisitionSection = React.memo(function AcquisitionSection({ dateFilter }: AcquisitionSectionProps) {
  const { data: acquisitionData, isLoading: acquisitionLoading } = useUserAcquisition(dateFilter);
  const { data: distributionData, isLoading: distributionLoading } = useContentDistribution(dateFilter);

  return (
    <div className="lg:grid lg:grid-cols-5 gap-6 space-y-6 lg:space-y-0">
      <div className="lg:col-span-3">
        <Card>
          <CardTitle title="User Acquisition" />
          <LineChart data={acquisitionData ?? []} isLoading={acquisitionLoading} />
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardTitle title="Content Distribution" />
          <PieChart data={distributionData ?? []} isLoading={distributionLoading} />
        </Card>
      </div>
    </div>
  );
});

// ─── Section 4 helpers ────────────────────────────────────────────────────────

interface TopArtistsSectionProps {
  dateFilter: DateFilter;
}

const TopArtistsCard = React.memo(function TopArtistsCard({ dateFilter }: TopArtistsSectionProps) {
  const { data, isLoading } = useTopArtists(dateFilter);

  return (
    <Card padding="none">
      <div className="p-6 pb-2">
        <CardTitle title="Top Artists" />
      </div>
      <div className="px-6 pb-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0">
                <Skeleton width={20} height={16} />
                <Skeleton width={32} height={32} className="rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton width={120} height={14} className="mb-1" />
                  <Skeleton width={80} height={12} />
                </div>
                <Skeleton width={50} height={14} />
              </div>
            ))
          : (data ?? []).map((artist) => (
              <div
                key={artist.id}
                className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0"
              >
                <span className="text-text-xs text-t-disabled w-5 flex-shrink-0 text-right">
                  {artist.rank}
                </span>
                <Avatar src={artist.avatar} name={artist.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-text-sm font-medium text-t-bold leading-tight truncate">
                    {artist.name}
                  </p>
                  <p className="text-text-xs text-t-subtle leading-tight truncate mt-0.5">
                    @{artist.username}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
                  <span className="text-text-sm text-t-subtle">
                    {formatNumber(artist.followers)}
                  </span>
                  {artist.trend === 'up' && <TrendingUp size={13} className="text-success" />}
                  {artist.trend === 'down' && <TrendingDown size={13} className="text-danger" />}
                  {artist.trend === 'neutral' && (
                    <span className="text-text-xs text-t-disabled">—</span>
                  )}
                </div>
              </div>
            ))}
      </div>
    </Card>
  );
});

interface TopCampaignsSectionProps {
  dateFilter: DateFilter;
}

const TopCampaignsCard = React.memo(function TopCampaignsCard({ dateFilter }: TopCampaignsSectionProps) {
  const { data, isLoading } = useTopCampaigns(dateFilter);

  return (
    <Card padding="none">
      <div className="p-6 pb-2">
        <CardTitle title="Top Campaigns" />
      </div>
      <div className="px-6 pb-4">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0">
                <Skeleton width={40} height={40} className="flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton width={140} height={14} className="mb-1" />
                  <Skeleton width={90} height={12} className="mb-2" />
                  <Skeleton width="100%" height={4} />
                </div>
              </div>
            ))
          : (data ?? []).map((campaign) => {
              const pct = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
              return (
                <div
                  key={campaign.id}
                  className="flex items-center gap-3 py-3 border-b border-border-subtle last:border-0"
                >
                  <img
                    src={campaign.coverArt}
                    alt={campaign.title}
                    width={40}
                    height={40}
                    loading="lazy"
                    className="object-cover flex-shrink-0"
                    style={{ width: 40, height: 40 }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-text-sm text-t-bold font-medium truncate leading-tight">
                      {campaign.title}
                    </p>
                    <p className="text-text-xs text-t-subtle leading-tight mt-0.5 truncate">
                      {campaign.artistName}
                    </p>
                    <div className="mt-1.5">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-text-xs text-t-subtle">
                          {formatCurrency(campaign.raised)}
                        </span>
                        <span className="text-text-xs text-t-disabled">
                          {formatCurrency(campaign.goal)}
                        </span>
                      </div>
                      <div className="h-1 bg-surface-press w-full">
                        <div
                          className="h-full bg-brand"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </Card>
  );
});

interface DropPackagesSectionProps {
  dateFilter: DateFilter;
}

const DropPackagesCard = React.memo(function DropPackagesCard({ dateFilter }: DropPackagesSectionProps) {
  const { data, isLoading } = useDropPackageSales(dateFilter);

  const chartData = useMemo(
    () => (data ?? []).map((d) => ({ name: d.name, sold: d.sold })),
    [data],
  );

  return (
    <Card>
      <CardTitle title="Top Drop Packages" />
      <BarChart
        data={chartData}
        bars={[{ dataKey: 'sold', color: '#21B576', name: 'Units Sold' }]}
        xAxisKey="name"
        isLoading={isLoading}
      />
    </Card>
  );
});

interface ThreeColumnSectionProps {
  dateFilter: DateFilter;
}

const ThreeColumnSection = React.memo(function ThreeColumnSection({ dateFilter }: ThreeColumnSectionProps) {
  return (
    <div className="lg:grid lg:grid-cols-3 gap-6 space-y-6 lg:space-y-0">
      <TopArtistsCard dateFilter={dateFilter} />
      <TopCampaignsCard dateFilter={dateFilter} />
      <DropPackagesCard dateFilter={dateFilter} />
    </div>
  );
});

// ─── Section 5: Engagement ────────────────────────────────────────────────────

const CONTENT_TYPE_VARIANT: Record<ContentType, BadgeVariant> = {
  Audio: 'info',
  Video: 'success',
  Campaign: 'gold',
  Album: 'warning',
  Poll: 'danger',
};

type SortKey = 'likes' | 'comments' | 'shares' | 'saves' | 'total';
type SortDir = 'asc' | 'desc';

interface TopContentTableProps {
  dateFilter: DateFilter;
}

const TopContentTable = React.memo(function TopContentTable({ dateFilter }: TopContentTableProps) {
  const { data, isLoading } = useTopContent(dateFilter);
  const [sortKey, setSortKey] = useState<SortKey>('total');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const sorted = useMemo(() => {
    if (!data) return [];
    return [...data]
      .sort((a, b) => {
        const diff = a[sortKey] - b[sortKey];
        return sortDir === 'desc' ? -diff : diff;
      })
      .slice(0, 10);
  }, [data, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const headers: { label: string; key: SortKey | null; align: string }[] = [
    { label: 'Title', key: null, align: 'text-left' },
    { label: 'Type', key: null, align: 'text-left' },
    { label: 'Artist', key: null, align: 'text-left' },
    { label: 'Likes', key: 'likes', align: 'text-right' },
    { label: 'Comments', key: 'comments', align: 'text-right' },
    { label: 'Shares', key: 'shares', align: 'text-right' },
    { label: 'Total', key: 'total', align: 'text-right' },
  ];

  return (
    <Card padding="none">
      <div className="p-6 pb-3">
        <CardTitle title="Top Content by Engagement" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-text-sm">
          <thead>
            <tr className="border-b border-border-subtle">
              {headers.map((h) => (
                <th
                  key={h.label}
                  className={`px-6 py-2 text-text-xs text-t-subtle font-medium ${h.align} ${
                    h.key ? 'cursor-pointer select-none hover:text-t-default' : ''
                  }`}
                  onClick={h.key ? () => handleSort(h.key as SortKey) : undefined}
                >
                  <span className="inline-flex items-center gap-1">
                    {h.label}
                    {h.key && sortKey === h.key && (
                      <span className="text-brand">
                        {sortDir === 'desc' ? '↓' : '↑'}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-border-subtle">
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} className="px-6 py-3">
                        <Skeleton width={j === 0 ? 140 : 60} height={14} />
                      </td>
                    ))}
                  </tr>
                ))
              : sorted.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border-subtle last:border-0 hover:bg-surface-hover transition-colors duration-100"
                  >
                    <td className="px-6 py-3 max-w-[180px]">
                      <span className="text-t-bold font-medium truncate block">
                        {row.title}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <Badge variant={CONTENT_TYPE_VARIANT[row.type]} size="sm">
                        {row.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-3 text-t-subtle max-w-[120px]">
                      <span className="truncate block">{row.artistName}</span>
                    </td>
                    <td className="px-6 py-3 text-right text-t-subtle">
                      {formatNumber(row.likes)}
                    </td>
                    <td className="px-6 py-3 text-right text-t-subtle">
                      {formatNumber(row.comments)}
                    </td>
                    <td className="px-6 py-3 text-right text-t-subtle">
                      {formatNumber(row.shares)}
                    </td>
                    <td className="px-6 py-3 text-right font-semibold text-t-bold">
                      {formatNumber(row.total)}
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
});

interface PlatformEngagementCardProps {
  dateFilter: DateFilter;
}

const PlatformEngagementCard = React.memo(function PlatformEngagementCard({ dateFilter }: PlatformEngagementCardProps) {
  const { data, isLoading } = useEngagementSnapshot(dateFilter);

  const rows = useMemo(
    () => [
      {
        icon: Heart,
        label: 'Total Likes',
        value: data?.totalLikes.value ?? 0,
        trend: data?.totalLikes.trend,
        direction: data?.totalLikes.direction,
      },
      {
        icon: MessageCircle,
        label: 'Total Comments',
        value: data?.totalComments.value ?? 0,
        trend: data?.totalComments.trend,
        direction: data?.totalComments.direction,
      },
      {
        icon: Share2,
        label: 'Total Shares',
        value: data?.totalShares.value ?? 0,
        trend: data?.totalShares.trend,
        direction: data?.totalShares.direction,
      },
      {
        icon: Bookmark,
        label: 'Total Saves',
        value: data?.totalSaves.value ?? 0,
        trend: data?.totalSaves.trend,
        direction: data?.totalSaves.direction,
      },
    ],
    [data],
  );

  return (
    <Card padding="none">
      <div className="p-6 pb-3">
        <CardTitle title="Platform Engagement" />
      </div>
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border-b border-border-subtle"
            >
              <Skeleton width={140} height={16} />
              <Skeleton width={80} height={16} />
            </div>
          ))
        : rows.map((row) => (
            <StatBadge
              key={row.label}
              icon={row.icon}
              label={row.label}
              value={row.value}
              trend={row.trend}
              direction={row.direction}
              formatter={formatNumber}
            />
          ))}
    </Card>
  );
});

interface EngagementSectionProps {
  dateFilter: DateFilter;
}

const EngagementSection = React.memo(function EngagementSection({ dateFilter }: EngagementSectionProps) {
  return (
    <div className="lg:grid lg:grid-cols-5 gap-6 space-y-6 lg:space-y-0">
      <div className="lg:col-span-3">
        <TopContentTable dateFilter={dateFilter} />
      </div>
      <div className="lg:col-span-2">
        <PlatformEngagementCard dateFilter={dateFilter} />
      </div>
    </div>
  );
});

// ─── Section 6: Financial Overview ───────────────────────────────────────────

interface TransactionCardProps {
  dateFilter: DateFilter;
}

const TransactionCard = React.memo(function TransactionCard({ dateFilter }: TransactionCardProps) {
  const { data, isLoading } = useTransactions(dateFilter);

  const chartData = useMemo(
    () =>
      (data ?? []).map((d) => ({
        period: d.period,
        deposits: d.deposits,
        withdrawals: d.withdrawals,
        dropSales: d.dropSales,
      })),
    [data],
  );

  return (
    <Card>
      <CardTitle title="Transaction Volume" />
      <BarChart
        data={chartData}
        bars={[
          { dataKey: 'deposits', color: '#21B576', name: 'Deposits' },
          { dataKey: 'withdrawals', color: '#F26283', name: 'Withdrawals' },
          { dataKey: 'dropSales', color: '#E0C196', name: 'Drop Sales' },
        ]}
        xAxisKey="period"
        stacked={true}
        isLoading={isLoading}
      />
    </Card>
  );
});

const CHANNEL_COLORS: Record<string, string> = {
  Paystack: '#21B576',
  Stripe: '#769FF2',
  Interswitch: '#F9B05A',
};

interface PaymentChannelsCardProps {
  dateFilter: DateFilter;
}

const PaymentChannelsCard = React.memo(function PaymentChannelsCard({ dateFilter }: PaymentChannelsCardProps) {
  const { data, isLoading } = usePaymentChannels(dateFilter);

  return (
    <Card>
      <CardTitle title="Payment Channels" />
      {isLoading
        ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-5">
              <div className="flex justify-between mb-2">
                <Skeleton width={100} height={14} />
                <Skeleton width={70} height={14} />
              </div>
              <Skeleton width="100%" height={8} />
            </div>
          ))
        : (data ?? []).map((channel) => {
            const color = CHANNEL_COLORS[channel.channel] ?? '#9AA4B2';
            return (
              <div key={channel.channel} className="mb-5 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-text-sm text-t-bold font-medium">
                      {channel.channel}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-sm text-t-subtle">
                      {formatCurrency(channel.volume)}
                    </span>
                    <span className="text-text-xs text-t-disabled w-10 text-right">
                      {channel.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-surface-press w-full">
                  <div
                    className="h-full transition-all duration-300"
                    style={{ width: `${channel.percentage}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
    </Card>
  );
});

interface FinancialSectionProps {
  dateFilter: DateFilter;
}

const FinancialSection = React.memo(function FinancialSection({ dateFilter }: FinancialSectionProps) {
  return (
    <div className="lg:grid lg:grid-cols-2 gap-6 space-y-6 lg:space-y-0">
      <TransactionCard dateFilter={dateFilter} />
      <PaymentChannelsCard dateFilter={dateFilter} />
    </div>
  );
});

// ─── Section 7: Recent Activity ───────────────────────────────────────────────

const EVENT_BADGE_VARIANT: Record<ActivityEventType, BadgeVariant> = {
  signup: 'info',
  content_published: 'success',
  campaign_funded: 'gold',
  withdrawal: 'warning',
  drop_purchase: 'default',
  content_removed: 'danger',
};

const EVENT_LABELS: Record<ActivityEventType, string> = {
  signup: 'New Signup',
  content_published: 'Content Published',
  campaign_funded: 'Campaign Funded',
  withdrawal: 'Withdrawal',
  drop_purchase: 'Drop Purchase',
  content_removed: 'Removed',
};

const ActivitySection = React.memo(function ActivitySection() {
  const { data, isLoading } = useRecentActivity();

  return (
    <Card padding="none">
      <div className="p-6 pb-3">
        <CardTitle title="Recent Activity" />
      </div>
      <div className="pb-2">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-6 py-3 border-b border-border-subtle"
              >
                <Skeleton width={100} height={20} />
                <div className="flex-1 min-w-0">
                  <Skeleton width={200} height={14} />
                </div>
                <Skeleton width={60} height={14} />
                <Skeleton width={70} height={12} />
              </div>
            ))
          : (data ?? []).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-4 px-6 py-3 border-b border-border-subtle last:border-0 hover:bg-surface-hover transition-colors duration-100"
              >
                <Badge variant={EVENT_BADGE_VARIANT[event.type]} size="sm">
                  {EVENT_LABELS[event.type]}
                </Badge>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {event.actorAvatar && (
                    <Avatar
                      src={event.actorAvatar}
                      name={event.actorName}
                      size="xs"
                    />
                  )}
                  <div className="min-w-0">
                    <span className="text-text-sm text-t-bold font-medium">
                      {event.actorName}
                    </span>
                    <span className="text-text-sm text-t-subtle ml-1.5">
                      {event.description}
                    </span>
                  </div>
                </div>
                {event.amount !== undefined && (
                  <span className="text-text-sm text-t-subtle flex-shrink-0">
                    {formatCurrency(event.amount)}
                  </span>
                )}
                <span className="text-text-xs text-t-disabled flex-shrink-0 ml-auto">
                  {formatRelativeDate(event.timestamp)}
                </span>
              </div>
            ))}
      </div>
    </Card>
  );
});

// ─── Page root ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { dateFilter } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <PageHeader
        title="Dashboard"
        subtitle="Platform overview and key metrics"
      />

      {/* Section 1 — KPI cards */}
      <MetricSection dateFilter={dateFilter} />

      {/* Section 2 — Revenue chart */}
      <RevenueSection dateFilter={dateFilter} />

      {/* Section 3 — User acquisition + Content distribution */}
      <AcquisitionSection dateFilter={dateFilter} />

      {/* Section 4 — Top artists / campaigns / drop packages */}
      <ThreeColumnSection dateFilter={dateFilter} />

      {/* Section 5 — Engagement table + Platform engagement */}
      <EngagementSection dateFilter={dateFilter} />

      {/* Section 6 — Transaction volume + Payment channels */}
      <FinancialSection dateFilter={dateFilter} />

      {/* Section 7 — Recent activity feed */}
      <ActivitySection />
    </motion.div>
  );
}
