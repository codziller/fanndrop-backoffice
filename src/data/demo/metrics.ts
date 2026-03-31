import type {
  OverviewMetrics,
  RevenueDataPoint,
  UserAcquisitionDataPoint,
  ContentDistributionItem,
  TopArtist,
  TopCampaign,
  DropPackageSales,
  ContentEngagement,
  EngagementSnapshot,
  TransactionDataPoint,
  PaymentChannelBreakdown,
  ActivityEvent,
} from '@/types/models';

export const DEMO_OVERVIEW_METRICS: OverviewMetrics = {
  totalRevenue:     { value: 47_850_000, trend: 12.4, direction: 'up' },
  totalUsers:       { value: 28_412,     trend: 8.2,  direction: 'up' },
  activeArtists:    { value: 3_847,      trend: 5.1,  direction: 'up' },
  activeFans:       { value: 24_565,     trend: 9.3,  direction: 'up' },
  totalDropsSold:   { value: 1_248_900,  trend: 15.7, direction: 'up' },
  newSignups:       { value: 1_204,      trend: -2.3, direction: 'down' },
  contentPublished: { value: 18_742,     trend: 22.1, direction: 'up' },
  avgDau:           { value: 6_820,      trend: 4.8,  direction: 'up' },
};

// 30 days of daily revenue data
const today = new Date('2026-03-30');
export const DEMO_REVENUE_CHART: RevenueDataPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() - (29 - i));
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return {
    date: `${months[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')}`,
    revenue: Math.floor(800_000 + Math.sin(i * 0.4) * 400_000 + Math.random() * 600_000),
  };
});

// 12 weeks of user acquisition
export const DEMO_USER_ACQUISITION: UserAcquisitionDataPoint[] = Array.from({ length: 12 }, (_, i) => {
  const weekNum = 12 - i;
  return {
    week: `W${weekNum}`,
    artists: Math.floor(80 + Math.random() * 120),
    fans: Math.floor(300 + Math.random() * 500),
  };
}).reverse();

export const DEMO_CONTENT_DISTRIBUTION: ContentDistributionItem[] = [
  { type: 'Audio',    count: 8_241, percentage: 44.0 },
  { type: 'Video',    count: 4_820, percentage: 25.7 },
  { type: 'Campaign', count: 2_108, percentage: 11.3 },
  { type: 'Album',    count: 1_947, percentage: 10.4 },
  { type: 'Poll',     count: 1_626, percentage: 8.6  },
];

export const DEMO_TOP_ARTISTS: TopArtist[] = [
  { rank: 1, id: '1',  name: 'Davido Official',    username: 'davido_official',  avatar: 'https://picsum.photos/seed/a1/100/100',  followers: 487_200, trend: 'up' },
  { rank: 2, id: '2',  name: 'Burna Boy',          username: 'burnaboy',         avatar: 'https://picsum.photos/seed/a2/100/100',  followers: 423_800, trend: 'up' },
  { rank: 3, id: '3',  name: 'Wizkid FC',          username: 'wizkidfc',         avatar: 'https://picsum.photos/seed/a3/100/100',  followers: 398_500, trend: 'down' },
  { rank: 4, id: '4',  name: 'Tems Music',         username: 'tems_music',       avatar: 'https://picsum.photos/seed/a4/100/100',  followers: 312_700, trend: 'up' },
  { rank: 5, id: '5',  name: 'Rema Selena',        username: 'rema_official',    avatar: 'https://picsum.photos/seed/a5/100/100',  followers: 289_400, trend: 'up' },
  { rank: 6, id: '6',  name: 'Asake Music',        username: 'asake_music',      avatar: 'https://picsum.photos/seed/a6/100/100',  followers: 245_100, trend: 'neutral' },
  { rank: 7, id: '7',  name: 'Kizz Daniel',        username: 'kizz_daniel',      avatar: 'https://picsum.photos/seed/a7/100/100',  followers: 198_300, trend: 'up' },
  { rank: 8, id: '8',  name: 'Olamide BNXN',       username: 'olamide_bnxn',     avatar: 'https://picsum.photos/seed/a8/100/100',  followers: 176_900, trend: 'down' },
  { rank: 9, id: '9',  name: 'Fireboy DML',        username: 'fireboy_dml',      avatar: 'https://picsum.photos/seed/a9/100/100',  followers: 154_200, trend: 'up' },
  { rank: 10, id: '10', name: 'Ckay Music',        username: 'ckay_music',       avatar: 'https://picsum.photos/seed/a10/100/100', followers: 132_600, trend: 'neutral' },
];

export const DEMO_TOP_CAMPAIGNS: TopCampaign[] = [
  { id: 'c1', title: 'Afrobeats World Tour 2026',  artistName: 'Davido Official', coverArt: 'https://picsum.photos/seed/c1/80/80', raised: 12_450_000, goal: 15_000_000 },
  { id: 'c2', title: 'New Album "Gratitude"',      artistName: 'Tems Music',      coverArt: 'https://picsum.photos/seed/c2/80/80', raised: 8_230_000,  goal: 10_000_000 },
  { id: 'c3', title: 'Studio Sessions Vol. 3',     artistName: 'Burna Boy',       coverArt: 'https://picsum.photos/seed/c3/80/80', raised: 6_780_000,  goal: 8_000_000  },
  { id: 'c4', title: 'Calm Down Part II',          artistName: 'Rema Selena',     coverArt: 'https://picsum.photos/seed/c4/80/80', raised: 5_100_000,  goal: 6_000_000  },
  { id: 'c5', title: 'Highlife Reborn',            artistName: 'Kizz Daniel',     coverArt: 'https://picsum.photos/seed/c5/80/80', raised: 3_940_000,  goal: 5_000_000  },
  { id: 'c6', title: 'Gospel Meets Afro',          artistName: 'Ckay Music',      coverArt: 'https://picsum.photos/seed/c6/80/80', raised: 2_650_000,  goal: 4_000_000  },
  { id: 'c7', title: 'YBNL Compilation 2026',      artistName: 'Olamide BNXN',    coverArt: 'https://picsum.photos/seed/c7/80/80', raised: 1_870_000,  goal: 3_000_000  },
  { id: 'c8', title: 'Acoustic Vibes EP',          artistName: 'Fireboy DML',     coverArt: 'https://picsum.photos/seed/c8/80/80', raised: 1_240_000,  goal: 2_000_000  },
];

export const DEMO_DROP_PACKAGE_SALES: DropPackageSales[] = [
  { name: 'Starter (50)',    sold: 18_420 },
  { name: 'Basic (200)',     sold: 12_780 },
  { name: 'Standard (500)', sold: 9_340  },
  { name: 'Premium (1K)',   sold: 5_210  },
  { name: 'Ultra (5K)',     sold: 1_890  },
];

export const DEMO_TOP_CONTENT: ContentEngagement[] = [
  { id: 'co1', title: 'Feel (Official Video)',        type: 'Video',    artistName: 'Davido Official', likes: 48_200, comments: 12_400, shares: 8_900,  saves: 6_700, total: 76_200 },
  { id: 'co2', title: 'Ye (Acoustic)',                type: 'Audio',    artistName: 'Burna Boy',       likes: 41_800, comments: 9_800,  shares: 7_200,  saves: 5_400, total: 64_200 },
  { id: 'co3', title: 'Calm Down (Remix)',            type: 'Audio',    artistName: 'Rema Selena',     likes: 38_900, comments: 8_700,  shares: 6_800,  saves: 4_900, total: 59_300 },
  { id: 'co4', title: 'Free Mind Visual',             type: 'Video',    artistName: 'Tems Music',      likes: 34_600, comments: 7_900,  shares: 6_100,  saves: 4_200, total: 52_800 },
  { id: 'co5', title: 'Sungba (Live)',                type: 'Video',    artistName: 'Asake Music',     likes: 29_400, comments: 6_800,  shares: 5_400,  saves: 3_800, total: 45_400 },
  { id: 'co6', title: 'Essence (Studio Cut)',         type: 'Audio',    artistName: 'Wizkid FC',       likes: 27_800, comments: 5_900,  shares: 4_700,  saves: 3_200, total: 41_600 },
  { id: 'co7', title: 'Afrobeats World Tour 2026',   type: 'Campaign', artistName: 'Davido Official', likes: 22_100, comments: 4_800,  shares: 3_900,  saves: 2_700, total: 33_500 },
  { id: 'co8', title: 'God\'s Timing (Gospel Mix)',  type: 'Audio',    artistName: 'Ckay Music',      likes: 18_400, comments: 4_100,  shares: 3_200,  saves: 2_300, total: 28_000 },
  { id: 'co9', title: 'Testimony Album',             type: 'Album',    artistName: 'Kizz Daniel',     likes: 16_700, comments: 3_800,  shares: 2_900,  saves: 1_900, total: 25_300 },
  { id: 'co10', title: 'Best Afrobeat Poll 2026',    type: 'Poll',     artistName: 'Fireboy DML',     likes: 14_300, comments: 3_200,  shares: 2_400,  saves: 1_600, total: 21_500 },
];

export const DEMO_ENGAGEMENT_SNAPSHOT: EngagementSnapshot = {
  totalLikes:    { value: 2_847_400, trend: 18.2, direction: 'up' },
  totalComments: { value: 892_300,   trend: 12.7, direction: 'up' },
  totalShares:   { value: 634_800,   trend: 9.4,  direction: 'up' },
  totalSaves:    { value: 418_200,   trend: -3.1, direction: 'down' },
};

export const DEMO_TRANSACTIONS: TransactionDataPoint[] = [
  { period: 'Oct', deposits: 8_200_000,  withdrawals: 2_100_000, dropSales: 4_800_000 },
  { period: 'Nov', deposits: 9_400_000,  withdrawals: 2_800_000, dropSales: 5_600_000 },
  { period: 'Dec', deposits: 14_200_000, withdrawals: 3_200_000, dropSales: 8_900_000 },
  { period: 'Jan', deposits: 10_800_000, withdrawals: 2_900_000, dropSales: 6_200_000 },
  { period: 'Feb', deposits: 11_600_000, withdrawals: 3_400_000, dropSales: 7_100_000 },
  { period: 'Mar', deposits: 13_400_000, withdrawals: 3_800_000, dropSales: 8_200_000 },
];

export const DEMO_PAYMENT_CHANNELS: PaymentChannelBreakdown[] = [
  { channel: 'Paystack',    volume: 28_400_000, percentage: 59.4 },
  { channel: 'Stripe',      volume: 12_100_000, percentage: 25.3 },
  { channel: 'Interswitch', volume: 7_350_000,  percentage: 15.3 },
];

export const DEMO_ACTIVITY_FEED: ActivityEvent[] = [
  { id: 'ev1',  type: 'signup',            actorName: 'Amaka Okafor',    actorAvatar: 'https://picsum.photos/seed/u1/40/40',  description: 'New artist signed up', timestamp: '2026-03-30T09:42:00Z' },
  { id: 'ev2',  type: 'drop_purchase',     actorName: 'Emeka Nwosu',     actorAvatar: 'https://picsum.photos/seed/u2/40/40',  description: 'Purchased 200 Drops package', amount: 1800, timestamp: '2026-03-30T09:38:00Z' },
  { id: 'ev3',  type: 'content_published', actorName: 'Tems Music',      actorAvatar: 'https://picsum.photos/seed/a4/40/40',  description: 'Published new audio track "Tears of Gold"', timestamp: '2026-03-30T09:31:00Z' },
  { id: 'ev4',  type: 'campaign_funded',   actorName: 'Chidi Eze',       actorAvatar: 'https://picsum.photos/seed/u4/40/40',  description: 'Funded "Afrobeats World Tour" campaign', amount: 50000, timestamp: '2026-03-30T09:25:00Z' },
  { id: 'ev5',  type: 'withdrawal',        actorName: 'Burna Boy',       actorAvatar: 'https://picsum.photos/seed/a2/40/40',  description: 'Withdrawal requested', amount: 2_500_000, timestamp: '2026-03-30T09:18:00Z' },
  { id: 'ev6',  type: 'signup',            actorName: 'Fatima Aliyu',    actorAvatar: 'https://picsum.photos/seed/u6/40/40',  description: 'New fan signed up', timestamp: '2026-03-30T09:10:00Z' },
  { id: 'ev7',  type: 'content_published', actorName: 'Asake Music',     actorAvatar: 'https://picsum.photos/seed/a6/40/40',  description: 'Published new video "YOGA (Live)"', timestamp: '2026-03-30T09:02:00Z' },
  { id: 'ev8',  type: 'drop_purchase',     actorName: 'Ngozi Adeyemi',   actorAvatar: 'https://picsum.photos/seed/u8/40/40',  description: 'Purchased 500 Drops package', amount: 4000, timestamp: '2026-03-30T08:55:00Z' },
  { id: 'ev9',  type: 'content_removed',   actorName: 'Chidinma Okafor', actorAvatar: 'https://picsum.photos/seed/u9/40/40',  description: 'Content removed: violates community guidelines', timestamp: '2026-03-30T08:48:00Z' },
  { id: 'ev10', type: 'campaign_funded',   actorName: 'Seun Adebayo',    actorAvatar: 'https://picsum.photos/seed/u10/40/40', description: 'Funded "New Album Gratitude" campaign', amount: 75000, timestamp: '2026-03-30T08:40:00Z' },
  { id: 'ev11', type: 'signup',            actorName: 'Yetunde Bello',   actorAvatar: 'https://picsum.photos/seed/u11/40/40', description: 'New artist signed up', timestamp: '2026-03-30T08:32:00Z' },
  { id: 'ev12', type: 'drop_purchase',     actorName: 'Biodun Ogunleye', actorAvatar: 'https://picsum.photos/seed/u12/40/40', description: 'Purchased Starter 50 Drops package', amount: 500, timestamp: '2026-03-30T08:24:00Z' },
  { id: 'ev13', type: 'content_published', actorName: 'Fireboy DML',     actorAvatar: 'https://picsum.photos/seed/a9/40/40',  description: 'Published album "Apollo II"', timestamp: '2026-03-30T08:16:00Z' },
  { id: 'ev14', type: 'withdrawal',        actorName: 'Rema Selena',     actorAvatar: 'https://picsum.photos/seed/a5/40/40',  description: 'Withdrawal processed', amount: 1_800_000, timestamp: '2026-03-30T08:08:00Z' },
  { id: 'ev15', type: 'signup',            actorName: 'Aisha Mohammed',  actorAvatar: 'https://picsum.photos/seed/u15/40/40', description: 'New fan signed up', timestamp: '2026-03-30T08:00:00Z' },
  { id: 'ev16', type: 'drop_purchase',     actorName: 'Kelechi Obi',     actorAvatar: 'https://picsum.photos/seed/u16/40/40', description: 'Purchased Premium 1000 Drops package', amount: 7500, timestamp: '2026-03-30T07:52:00Z' },
  { id: 'ev17', type: 'campaign_funded',   actorName: 'Tunde Adeleke',   actorAvatar: 'https://picsum.photos/seed/u17/40/40', description: 'Funded "Highlife Reborn" campaign', amount: 25000, timestamp: '2026-03-30T07:44:00Z' },
  { id: 'ev18', type: 'content_published', actorName: 'Kizz Daniel',     actorAvatar: 'https://picsum.photos/seed/a7/40/40',  description: 'Published new audio "Buga (2026 Version)"', timestamp: '2026-03-30T07:36:00Z' },
  { id: 'ev19', type: 'signup',            actorName: 'Chinonso Dike',   actorAvatar: 'https://picsum.photos/seed/u19/40/40', description: 'New artist signed up', timestamp: '2026-03-30T07:28:00Z' },
  { id: 'ev20', type: 'drop_purchase',     actorName: 'Precious Okoye',  actorAvatar: 'https://picsum.photos/seed/u20/40/40', description: 'Purchased Basic 200 Drops package', amount: 1800, timestamp: '2026-03-30T07:20:00Z' },
];
