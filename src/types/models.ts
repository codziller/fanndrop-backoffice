export type UserStatus = 'active' | 'suspended' | 'pending' | 'inactive';
export type StaffRole = 'Admin' | 'Moderator' | 'Marketing' | 'Support';
export type ContentType = 'Audio' | 'Video' | 'Album' | 'Campaign' | 'Poll';
export type NotificationTarget = 'all' | 'artists' | 'fans' | 'specific';
export type NotificationStatus = 'sent' | 'scheduled' | 'failed';
export type ActivityEventType =
  | 'signup'
  | 'content_published'
  | 'campaign_funded'
  | 'withdrawal'
  | 'drop_purchase'
  | 'content_removed';

export interface Artist {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  banner?: string;
  bio?: string;
  genres: string[];
  vibes?: string[];
  location?: string;
  followers: number;
  contentCount: number;
  revenue: number;
  dropsReceived: number;
  status: UserStatus;
  verified: boolean;
  joinedAt: string;
}

export interface Fan {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  dropsBalance: number;
  totalSpent: number;
  artistsFollowed: number;
  postsLiked: number;
  status: UserStatus;
  joinedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export interface DropPackage {
  id: string;
  name: string;
  drops: number;
  priceNaira: number;
  chargesNaira: number;
  active: boolean;
}

export interface FeatureFlags {
  enable_stories: boolean;
  enable_polls: boolean;
  enable_campaigns: boolean;
  enable_video_feed: boolean;
}

export interface AppVersionSettings {
  ios: string;
  android: string;
}

export interface ForceUpdateSettings {
  enabled: boolean;
  iosMinVersion: string;
  androidMinVersion: string;
  iosUpdateUrl?: string;
  androidUpdateUrl?: string;
  updateMessage?: string;
}

export interface MaintenanceModeSettings {
  enabled: boolean;
  message: string;
  scheduledStart?: string;
  scheduledEnd?: string;
}

export interface GeneralSettings {
  platformName: string;
  supportEmail: string;
  tosUrl: string;
  privacyUrl: string;
}

export interface AppSettings {
  appVersion: AppVersionSettings;
  forceUpdate: ForceUpdateSettings;
  maintenanceMode: MaintenanceModeSettings;
  featureFlags: FeatureFlags;
  dropPackages: DropPackage[];
  general: GeneralSettings;
}

export interface MetricValue {
  value: number;
  trend: number;
  direction: 'up' | 'down';
}

export interface OverviewMetrics {
  totalRevenue: MetricValue;
  totalUsers: MetricValue;
  activeArtists: MetricValue;
  activeFans: MetricValue;
  totalDropsSold: MetricValue;
  newSignups: MetricValue;
  contentPublished: MetricValue;
  avgDau: MetricValue;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface UserAcquisitionDataPoint {
  week: string;
  artists: number;
  fans: number;
}

export interface ContentDistributionItem {
  type: ContentType;
  count: number;
  percentage: number;
}

export interface TopArtist {
  rank: number;
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface TopCampaign {
  id: string;
  title: string;
  artistName: string;
  coverArt: string;
  raised: number;
  goal: number;
}

export interface DropPackageSales {
  name: string;
  sold: number;
}

export interface ContentEngagement {
  id: string;
  title: string;
  type: ContentType;
  artistName: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  total: number;
}

export interface EngagementSnapshot {
  totalLikes: MetricValue;
  totalComments: MetricValue;
  totalShares: MetricValue;
  totalSaves: MetricValue;
}

export interface TransactionDataPoint {
  period: string;
  deposits: number;
  withdrawals: number;
  dropSales: number;
}

export interface PaymentChannelBreakdown {
  channel: string;
  volume: number;
  percentage: number;
}

export interface ActivityEvent {
  id: string;
  type: ActivityEventType;
  actorName: string;
  actorAvatar?: string;
  description: string;
  amount?: number;
  timestamp: string;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  target: NotificationTarget;
  targetCount: number;
  sentAt?: string;
  scheduledAt?: string;
  sentCount?: number;
  openedCount?: number;
  openRate?: number;
  status: NotificationStatus;
}
