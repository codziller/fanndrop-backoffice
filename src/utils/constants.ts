export const APP_NAME = 'Fanndrop';
export const APP_TITLE = 'Fanndrop Admin';
export const DEMO_EMAIL = 'admin@fanndrop.com';
export const DEMO_PASSWORD = 'admin123';
export const AUTH_TOKEN_KEY = 'admin_token';
export const AUTH_USER_KEY = 'admin_user';

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ARTISTS: '/artists',
  ARTIST_DETAIL: '/artists/:id',
  FANS: '/fans',
  FAN_DETAIL: '/fans/:id',
  STAFF: '/staff',
  MARKETING: '/marketing',
  SETTINGS: '/settings',
} as const;

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { label: 'Artists', path: '/artists', icon: 'Music2' },
  { label: 'Fans', path: '/fans', icon: 'Users' },
  { label: 'Staff', path: '/staff', icon: 'Shield' },
  { label: 'Marketing', path: '/marketing', icon: 'Megaphone' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
] as const;

export const DATE_FILTER_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'Last 3 Months' },
  { value: 'all', label: 'All Time' },
] as const;

export const ARTIST_STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'pending', label: 'Unverified' },
] as const;

export const ARTIST_SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'followers', label: 'Most Followers' },
  { value: 'content', label: 'Most Content' },
  { value: 'revenue', label: 'Most Revenue' },
] as const;

export const GENRE_OPTIONS = [
  'Afrobeats', 'Afro-fusion', 'Highlife', 'Amapiano',
  'Gospel', 'Hip-Hop', 'R&B', 'Reggae', 'Dancehall', 'Afropop',
] as const;

export const STAFF_ROLE_OPTIONS = [
  { value: 'Admin', label: 'Admin' },
  { value: 'Moderator', label: 'Moderator' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Support', label: 'Support' },
] as const;

export const NOTIFICATION_TARGET_OPTIONS = [
  { value: 'all', label: 'All Users' },
  { value: 'artists', label: 'Artists Only' },
  { value: 'fans', label: 'Fans Only' },
  { value: 'specific', label: 'Specific Users' },
] as const;

export const TABLE_PAGE_SIZE = 25;
export const SEARCH_DEBOUNCE_MS = 300;
export const TOAST_DURATION_MS = 4000;
export const CHART_ANIMATION_DURATION = 800;
export const COUNT_UP_DURATION_MS = 1200;
