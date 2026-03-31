# Fanndrop Admin Dashboard — Implementation Plan

## 1. Project Overview

The Fanndrop Admin Dashboard is an internal web tool for managing all aspects of the Fanndrop platform — a music/creator social app where artists publish audio, video, albums, campaigns, and polls; fans discover and support them using a virtual currency called "Drops". The dashboard surfaces operational metrics and controls for platform administrators, staff, and marketing teams.

**Goals:**
- Provide real-time operational visibility (revenue, engagement, user growth).
- Enable artist and fan management (view, suspend, verify, manage).
- Manage staff accounts and permissions.
- Run marketing campaigns and push notification broadcasts.
- Control app configuration (forced updates, versioning, feature flags).

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Styling | Tailwind CSS v3 with custom design tokens |
| App State | React Context API |
| Server/API State | TanStack Query (React Query) v5 |
| Routing | React Router v6 |
| Charts | Recharts |
| Tables | TanStack Table v8 |
| Icons | Lucide React |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Notifications | react-hot-toast |
| Date Utilities | date-fns |
| HTTP Client | Axios |

---

## 3. Design System

The dashboard mirrors the Fanndrop mobile app's design language. All visual decisions derive from the tokens documented below.

### 3.1 Color Palette

The dashboard runs in **dark mode only**, matching the mobile app's default.

#### Primitive Palette (Raw Hex Values)

```
-- Green (Brand Primary) --
green-50:   #E9F8F1
green-100:  #BAE8D5
green-200:  #99DDC0
green-300:  #6ACDA3
green-400:  #4DC491
green-500:  #21B576  ← Primary brand / CTA
green-600:  #1EA56B
green-700:  #178154
green-800:  #126441
green-900:  #0E4C32
green-950:  #092F1F
green-1000: #020D10

-- Red (Danger) --
red-50:    #FEF0F3
red-100:   #F9B6C6
red-200:   #F48BAA
red-300:   #F26283
red-500:   #EB1446  ← Danger primary
red-600:   #D61240
red-700:   #A70E32
red-800:   #810B27
red-900:   #610820
red-950:   #470615

-- Blue (Information) --
blue-50:   #EBF1FD
blue-100:  #BFD3F9
blue-200:  #A1BDF6
blue-300:  #769FF2
blue-400:  #5B8DF0
blue-500:  #3270EC  ← Info primary
blue-700:  #2450A8
blue-800:  #1C3E82
blue-950:  #10244C

-- Gold (Premium/Featured) --
gold-50:   #FAF6EF
gold-100:  #F0E2CF
gold-200:  #E9D5B7
gold-300:  #E0C196
gold-400:  #D9B582
gold-500:  #D0A363  ← Gold primary
gold-700:  #947446
gold-800:  #725A36
gold-950:  #413320

-- Orange (Warning) --
orange-100: #FCDAB3
orange-200: #FBC98E
orange-300: #F9B05A
orange-500: #F68909  ← Warning primary
orange-700: #AF6106
orange-800: #874B05
orange-900: #673A04
orange-950: #532F03

-- Grey (Neutrals) --
grey-50:   #F6F8FA
grey-100:  #EEF2F6
grey-200:  #E3E8EF
grey-300:  #CDD5DF
grey-400:  #9AA4B2
grey-500:  #697586
grey-600:  #4B5565
grey-700:  #364152
grey-800:  #202939
grey-850:  #172128
grey-900:  #121926
grey-950:  #0D121C  ← App background (darkest)
```

#### Semantic Tokens (Dark Theme — Use These, Not Primitives)

```css
/* Backgrounds */
--bg-app:            #0D121C   /* Page background */
--bg-surface:        #121926   /* Cards, panels */
--bg-surface-hover:  #202939   /* Hovered cards */
--bg-surface-press:  #364152   /* Pressed state */
--bg-secondary:      #0D121C   /* Secondary surfaces */
--bg-input:          #121926   /* Form inputs */
--bg-disabled:       #364152

/* Borders */
--border-default:    #697586
--border-subtle:     #4B5565
--border-bold:       #9AA4B2
--border-focus:      #21B576
--border-input:      #697586
--border-disabled:   #364152

/* Text */
--text-default:      #CDD5DF   /* Body text */
--text-bold:         #EEF2F6   /* Headings */
--text-subtle:       #9AA4B2   /* Muted/secondary */
--text-disabled:     #697586
--text-on-btn:       #0D121C   /* Text on green button */
--text-selected:     #21B576
--text-inverse:      #202939

/* Status Text */
--text-success:      #6ACDA3
--text-danger:       #F26283
--text-warning:      #F9B05A
--text-info:         #769FF2
--text-gold:         #E0C196

/* Icons */
--icon-default:      #9AA4B2
--icon-bold:         #EEF2F6
--icon-subtle:       #697586
--icon-success:      #6ACDA3
--icon-danger:       #F26283
--icon-warning:      #F9B05A
--icon-info:         #769FF2
--icon-gold:         #E0C196
--icon-disabled:     #364152

/* Status Backgrounds */
--bg-success:        #092F1F   /* with #6ACDA3 text */
--bg-success-subtle: #126441
--bg-danger:         #470615   /* with #F26283 text */
--bg-danger-subtle:  #810B27
--bg-warning:        #532F03   /* with #F9B05A text */
--bg-warning-subtle: #874B05
--bg-info:           #10244C   /* with #769FF2 text */
--bg-info-subtle:    #1C3E82
--bg-gold:           #413320   /* with #E0C196 text */
--bg-gold-subtle:    #725A36

/* Primary Action */
--btn-primary:       #21B576
--btn-primary-hover: #4DC491
--btn-primary-press: #1EA56B
--btn-disabled:      #364152
```

### 3.2 Typography

**Font Families:**
- **Display/Brand:** `Paytone One` (Google Fonts) — used for logo, hero titles
- **Body/UI:** `Hanken Grotesk` (Google Fonts) — all other text

Load both via `@import` in `index.css` or via `<link>` in `index.html`.

**Type Scale:**

```
Display (Paytone One):
  display-xxl: 72px / line-height 80px / tracking -1.45px
  display-xl:  60px / line-height 68px / tracking -1.21px
  display-lg:  48px / line-height 60px / tracking -0.96px
  display-md:  36px / line-height 44px / tracking -0.73px
  display-sm:  30px / line-height 38px
  display-xs:  24px / line-height 32px

Headings (Hanken Grotesk):
  heading-sm:  30px / line-height 38px / weight 900
  heading-xs:  24px / line-height 32px / weight 400 or 700

Body (Hanken Grotesk):
  text-xl:  20px / line-height 30px
  text-lg:  18px / line-height 27px
  text-md:  16px / line-height 24px
  text-sm:  14px / line-height 21px
  text-xs:  12px / line-height 18px
  text-xxs: 10px / line-height 15px

  Weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
```

**Tailwind custom classes to define:**
```js
// tailwind.config.js
fontFamily: {
  display: ['Paytone One', 'serif'],
  body: ['Hanken Grotesk', 'sans-serif'],
},
fontSize: {
  'display-xxl': ['72px', { lineHeight: '80px', letterSpacing: '-1.45px' }],
  'display-xl':  ['60px', { lineHeight: '68px', letterSpacing: '-1.21px' }],
  'display-lg':  ['48px', { lineHeight: '60px', letterSpacing: '-0.96px' }],
  'display-md':  ['36px', { lineHeight: '44px', letterSpacing: '-0.73px' }],
  'display-sm':  ['30px', { lineHeight: '38px' }],
  'display-xs':  ['24px', { lineHeight: '32px' }],
  'heading-sm':  ['30px', { lineHeight: '38px' }],
  'heading-xs':  ['24px', { lineHeight: '32px' }],
  'text-xl':     ['20px', { lineHeight: '30px' }],
  'text-lg':     ['18px', { lineHeight: '27px' }],
  'text-md':     ['16px', { lineHeight: '24px' }],
  'text-sm':     ['14px', { lineHeight: '21px' }],
  'text-xs':     ['12px', { lineHeight: '18px' }],
  'text-xxs':    ['10px', { lineHeight: '15px' }],
},
```

### 3.3 Spacing & Layout

- Base unit: **4px** (Tailwind default)
- Prefer 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 spacing steps
- Sidebar width: **256px** (collapsed: **64px**)
- Header height: **64px**
- Content max-width: **1440px** with 24px horizontal padding
- Card padding: **24px**
- Section gaps: **24px** between cards, **32px** between sections

### 3.4 Border Radius

Fanndrop uses **0px radius** everywhere (sharp corners). Apply globally:

```css
/* Reset all border-radius */
* { border-radius: 0 !important; }
```

Exceptions (override only where needed):
- Avatar images: `rounded-full` (circular avatars only)
- Progress bars: `rounded-full`
- Charts (Recharts): keep as-is internally

### 3.5 Shadows & Elevation

```css
--shadow-card:     0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2);
--shadow-elevated: 0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3);
--shadow-modal:    0 20px 25px rgba(0,0,0,0.5), 0 8px 10px rgba(0,0,0,0.4);
```

### 3.6 Icons

Use **Lucide React** throughout. Map conceptually to the mobile app's HugeIcons usage:
- Navigation: `LayoutDashboard`, `Users`, `Music`, `Megaphone`, `Settings`, `Bell`, `LogOut`
- Content: `Music2`, `Video`, `Image`, `FileText`, `BookOpen`
- Actions: `Plus`, `Edit2`, `Trash2`, `Eye`, `Download`, `Upload`
- Status: `CheckCircle2`, `XCircle`, `AlertTriangle`, `Info`, `Clock`
- Finance: `DollarSign`, `TrendingUp`, `TrendingDown`, `Wallet`, `CreditCard`
- Users: `UserCheck`, `UserX`, `Shield`, `Crown`
- Charts: `BarChart2`, `PieChart`, `Activity`, `LineChart`
- Misc: `Search`, `Filter`, `ChevronDown`, `ChevronRight`, `ArrowUpRight`, `MoreVertical`, `X`, `Menu`

Icon size convention:
- Sidebar nav: 20px
- Table actions: 16px
- Metric card icons: 24px
- Inline text icons: 14–16px

---

## 4. Project Architecture

```
src/
├── api/
│   ├── client.ts          # Axios instance with interceptors
│   ├── endpoints.ts       # All API endpoint constants
│   └── hooks/             # React Query custom hooks per domain
│       ├── useMetrics.ts
│       ├── useArtists.ts
│       ├── useFans.ts
│       ├── useStaff.ts
│       ├── useMarketing.ts
│       └── useSettings.ts
├── context/
│   ├── AuthContext.tsx     # Auth state (token, user, login, logout)
│   └── AppContext.tsx      # Global UI state (sidebar collapsed, theme)
├── components/
│   ├── ui/                # Atomic design system components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Table.tsx
│   │   ├── Avatar.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Spinner.tsx
│   │   ├── Tabs.tsx
│   │   ├── Toast.tsx
│   │   └── DateRangePicker.tsx
│   ├── charts/            # Reusable chart wrappers
│   │   ├── LineChart.tsx
│   │   ├── BarChart.tsx
│   │   ├── PieChart.tsx
│   │   └── AreaChart.tsx
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── PageHeader.tsx
│   │   └── AppLayout.tsx
│   └── shared/
│       ├── MetricCard.tsx
│       ├── FilterBar.tsx
│       ├── EmptyState.tsx
│       ├── ErrorState.tsx
│       ├── StatBadge.tsx
│       └── UserAvatar.tsx
├── pages/
│   ├── auth/
│   │   └── LoginPage.tsx
│   ├── dashboard/
│   │   └── DashboardPage.tsx
│   ├── artists/
│   │   ├── ArtistsPage.tsx
│   │   └── ArtistDetailPage.tsx
│   ├── fans/
│   │   ├── FansPage.tsx
│   │   └── FanDetailPage.tsx
│   ├── staff/
│   │   └── StaffPage.tsx
│   ├── marketing/
│   │   └── MarketingPage.tsx
│   └── settings/
│       └── SettingsPage.tsx
├── data/
│   └── demo/              # All demo/mock data
│       ├── metrics.ts
│       ├── artists.ts
│       ├── fans.ts
│       ├── staff.ts
│       ├── transactions.ts
│       └── notifications.ts
├── types/
│   ├── api.ts             # API response types
│   ├── models.ts          # Domain model types
│   └── common.ts          # Shared utility types
├── utils/
│   ├── format.ts          # Number, currency, date formatters
│   ├── constants.ts       # App-wide constants
│   └── helpers.ts
├── App.tsx
├── main.tsx
└── index.css
```

---

## 5. Pages & Features

### 5.1 Login Page (`/login`)

**Layout:** Centered card (480px wide) on full dark background (`#0D121C`).

**Components:**
- Fanndrop logo (Paytone One, `#21B576` brand color) at top
- "Admin Dashboard" subtitle in `text-subtle`
- Email input
- Password input (with show/hide toggle)
- "Sign In" primary button (full width, green)
- Error message display

**Behavior:**
- On submit: call `POST /auth/admin/login` (demo: accept `admin@fanndrop.com` / `admin123`)
- Store token in `AuthContext` + `localStorage`
- Redirect to `/dashboard`
- Show shake animation + error toast on failure

**Validation (Zod):**
```ts
const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
```

**Micro-interactions:**
- Button loading spinner while authenticating
- Input border glows green on focus (`--border-focus`)
- Subtle fade-in animation on card mount (Framer Motion)

---

### 5.2 App Layout

**Sidebar** (persistent, collapsible):
- Width: 256px expanded / 64px collapsed
- Background: `#121926` (`--bg-surface`)
- Top: Fanndrop logo + "Admin" label
- Nav items with icons (active: green left border + green text + subtle green bg)
- Bottom: logged-in user avatar + name + logout button
- Smooth expand/collapse animation (Framer Motion `AnimatePresence`)

**Header** (fixed, 64px):
- Background: `#121926` with border-bottom `#4B5565`
- Left: Page title (dynamic)
- Right: Global date filter, notification bell, user menu

**Navigation Items:**
```
Dashboard       /dashboard
Artists         /artists
Fans            /fans
Staff           /staff
Marketing       /marketing
Settings        /settings
```

---

### 5.3 Dashboard Page (`/dashboard`)

The home page provides a comprehensive overview of platform health.

#### Date Filter
A persistent filter at the top right of the page header:
- **Options:** Today | This Week | This Month | Last 3 Months | All Time
- Affects all metrics, charts, and tables on the page
- Implemented as a controlled `<select>` or segmented control with green active state

#### Section 1 — KPI Metric Cards (top row)

8 cards in a responsive grid (4 columns on desktop, 2 on tablet, 1 on mobile):

| Metric | Icon | Color Accent |
|---|---|---|
| Total Revenue | `DollarSign` | Gold (#E0C196) |
| Total Users | `Users` | Blue (#769FF2) |
| Active Artists | `Music2` | Green (#6ACDA3) |
| Active Fans | `Heart` | Red (#F26283) |
| Total Drops Sold | `Coins` | Gold (#E0C196) |
| New Signups (period) | `UserPlus` | Green (#6ACDA3) |
| Total Content Published | `FileText` | Blue (#769FF2) |
| Avg. Daily Active Users | `Activity` | Orange (#F9B05A) |

Each `MetricCard` shows:
- Icon (top left, colored background square)
- Metric name (subtle text, text-sm)
- Big number (heading-xs bold, white)
- Trend indicator: `▲ 12.4%` (green) or `▼ 3.1%` (red) vs previous period
- Subtle bottom border with the accent color

#### Section 2 — Revenue Chart

`AreaChart` showing revenue over time (by day/week/month depending on filter).
- X-axis: dates
- Y-axis: revenue in ₦ (or USD — use ₦ as primary)
- Gradient fill using green (#21B576 → transparent)
- Tooltip showing exact revenue on hover
- Title: "Revenue Over Time"
- Period selector chips: Day / Week / Month

#### Section 3 — Two-column row

**Left: User Acquisition Chart (60% width)**
- `LineChart` with two lines: Artists (green) and Fans (blue)
- Shows new signups per period
- Legend at bottom
- Title: "User Acquisition"

**Right: Content Type Breakdown (40% width)**
- `PieChart` / `DonutChart`
- Segments: Audio, Video, Album, Campaign, Poll
- Colors: green, blue, gold, orange, red
- Legend: shows type + count + %
- Title: "Content Distribution"

#### Section 4 — Three-column row

**Left: Top Artists by Followers (33% width)**
- Simple ranked list (top 10)
- Each row: rank number, avatar, name, handle, follower count
- Trend arrow (up/down vs previous period)

**Center: Top Campaigns by Raised Amount (33% width)**
- Simple ranked list (top 10)
- Each row: cover art thumbnail, title, artist name, raised/goal amounts, progress bar (green)

**Right: Drop Packages Sales (33% width)**
- `BarChart` showing which drop packages sell most
- X-axis: package names (e.g., "50 Drops", "200 Drops", "500 Drops")
- Y-axis: units sold
- Title: "Top Drop Packages"

#### Section 5 — Engagement Metrics Row

**Left: Top Content by Engagement (60% width)**
- Table: Title | Type | Artist | Likes | Comments | Shares | Saves | Total
- Sortable by any column
- Pagination (show 10)
- Type badge (Audio/Video/Campaign etc.)

**Right: Platform Engagement Snapshot (40% width)**
- Four stat rows: Total Likes, Total Comments, Total Shares, Total Saves
- Each row has an icon, label, big number, and trend

#### Section 6 — Financial Overview

**Left: Transaction Volume Chart (50%)**
- `BarChart` stacked: Deposits vs Withdrawals vs Drop Sales
- X-axis: time periods

**Right: Payment Channel Breakdown (50%)**
- `PieChart`: Paystack / Stripe / Interswitch
- Shows ₦ volume per channel + % share

#### Section 7 — Recent Activity Feed (bottom)

A compact table of last 20 platform events:
- Columns: Time | Event Type | Actor | Description | Amount (if applicable)
- Event Types: New Signup, Content Published, Campaign Funded, Withdrawal, Drop Purchase, Content Removed
- Color-coded event type badges

---

### 5.4 Artists Page (`/artists`)

**Page Header:** "Artists" + total count badge + "Invite Artist" button (outlined)

**Filter Bar:**
- Search input (search by name, username, email)
- Status filter: All | Active | Suspended | Unverified
- Genre filter: multi-select dropdown
- Sort: Newest | Most Followers | Most Content | Most Revenue

**Artists Table (TanStack Table):**

Columns:
| Column | Notes |
|---|---|
| Artist | Avatar + Name + @handle |
| Email | |
| Genres | Up to 3 genre badges |
| Followers | Number with K/M suffix |
| Content | Total posts count |
| Revenue | Total ₦ earned through drops/campaigns |
| Joined | Date |
| Status | Badge: Active (green) / Suspended (red) / Pending (gold) |
| Actions | `...` menu: View, Suspend/Unsuspend, Send Notification, Delete |

Features:
- Column sorting
- Pagination (25 per page)
- Row click → navigate to Artist Detail page
- Bulk selection + bulk actions (Suspend All, Export)

**Artist Detail Page (`/artists/:id`)**

Tabbed layout:
- **Overview Tab:** Profile header (avatar, banner, name, handle, bio, genres, vibes, join date, location), Key stats row (followers, total content, total revenue, drops sent), recent content list
- **Content Tab:** All content by artist — filterable by type (Audio/Video/Album/Campaign/Poll), with engagement stats per post
- **Transactions Tab:** All financial transactions related to the artist — deposits, withdrawals, drop sales, campaign funding received
- **Engagement Tab:** Follower growth chart, most liked/commented content, engagement rate over time
- **Actions Panel (right sidebar):** Verify artist, Suspend/Unsuspend, Send push notification, Delete account (with confirmation modal)

---

### 5.5 Fans Page (`/fans`)

**Similar structure to Artists page but for fans.**

**Fans Table Columns:**
| Column | Notes |
|---|---|
| Fan | Avatar + Name + @handle |
| Email | |
| Drops Balance | Current wallet balance |
| Total Spent | Cumulative ₦ spent |
| Artists Followed | Count |
| Joined | Date |
| Status | Active / Suspended |
| Actions | View, Suspend, Notify, Delete |

**Fan Detail Page (`/fans/:id`)**

Tabs:
- **Overview:** Profile info, key stats (drops balance, total spent, artists followed, posts liked)
- **Activity:** Feed of fan actions (drops sent, campaigns supported, polls voted, content liked)
- **Transactions:** Wallet transaction history (deposits, drop purchases, drops sent)
- **Followed Artists:** List of followed artists

---

### 5.6 Staff Page (`/staff`)

**Staff Management for admin users of the dashboard.**

**Staff Table Columns:**
| Column | Notes |
|---|---|
| Name | Avatar + Name |
| Email | |
| Role | Admin / Moderator / Marketing / Support |
| Status | Active / Inactive |
| Last Login | Date |
| Actions | Edit, Deactivate, Delete |

**Add Staff Modal:**
- Name, Email, Role (select), Password (auto-generated or manual)
- Send invite email checkbox

**Role Permissions Matrix:**

| Permission | Admin | Moderator | Marketing | Support |
|---|---|---|---|---|
| View Dashboard | ✓ | ✓ | ✓ | ✓ |
| Manage Artists/Fans | ✓ | ✓ | - | ✓ (view only) |
| Delete Content | ✓ | ✓ | - | - |
| Send Notifications | ✓ | - | ✓ | - |
| Manage Staff | ✓ | - | - | - |
| Manage Settings | ✓ | - | - | - |

---

### 5.7 Marketing Page (`/marketing`)

Tabbed interface with tabs:
1. **Push Notifications**
2. *(Future tabs placeholder: Email Campaigns, Promotions, Banners)*

#### Push Notifications Tab

**Left Panel — Compose Notification (60%)**

Form fields:
- **Title** — text input (max 100 chars) + character counter
- **Body** — textarea (max 500 chars) + character counter
- **Target Audience:**
  - Radio: All Users / Artists Only / Fans Only / Specific Users
  - If "Specific Users": multi-select user search (search by name/email, shows chips)
- **Schedule:**
  - Radio: Send Now / Schedule for Later
  - If "Schedule": datetime picker
- **Preview** panel (below form): shows how notification appears on iOS and Android

**Right Panel — Notification History (40%)**

Table:
| Column | Notes |
|---|---|
| Title | |
| Target | All / Artists / Fans / N users |
| Sent At | Date |
| Sent | Delivery count |
| Opened | Open rate % |
| Status | Sent (green) / Scheduled (gold) / Failed (red) |
| Actions | View, Duplicate, Cancel (if scheduled) |

**Send Notification Modal (confirmation before send):**
- Shows notification preview
- Shows target count ("This will be sent to 12,480 users")
- Confirm / Cancel buttons

---

### 5.8 Settings Page (`/settings`)

Tabbed:
1. **App Version & Updates**
2. **Feature Flags**
3. **Drop Packages**
4. **General**

#### App Version & Updates Tab

- **Current App Version** display (iOS / Android separately)
- **Force Update Toggle** — enables/disables forced update prompt
  - iOS minimum version input
  - Android minimum version input
  - Update URL (App Store / Play Store)
  - Update message (shown to users in the update dialog)
- **Maintenance Mode Toggle** — shows maintenance screen to all users
  - Maintenance message input
  - Scheduled start/end time
- Save button

#### Feature Flags Tab

Table of flags:
| Flag Name | Description | Status Toggle | Last Updated |
|---|---|---|---|
| `enable_stories` | Enable/disable Stories feature | Toggle | Date |
| `enable_polls` | Enable/disable Polls | Toggle | Date |
| `enable_campaigns` | Enable/disable Campaigns | Toggle | Date |
| `enable_video_feed` | Enable/disable Video Reel | Toggle | Date |

#### Drop Packages Tab

Table of drop packages with Edit capability:
| Package | Drops | Price (₦) | Charges (₦) | Status | Actions |
|---|---|---|---|---|---|
| Starter | 50 | ₦500 | ₦50 | Active | Edit |
| Basic | 200 | ₦1,800 | ₦150 | Active | Edit |
| Standard | 500 | ₦4,000 | ₦300 | Active | Edit |
| Premium | 1000 | ₦7,500 | ₦500 | Active | Edit |
| Ultra | 5000 | ₦35,000 | ₦2,000 | Active | Edit |

"Add Package" button → modal form.

#### General Tab

- Platform name
- Support email
- Terms of Service URL
- Privacy Policy URL
- Save button

---

## 6. Component Library Specifications

### 6.1 Button

```tsx
// Variants: primary | secondary | danger | ghost | link
// Sizes: sm (32px) | md (40px) | lg (48px)
// States: default | hover | active | disabled | loading

<Button variant="primary" size="md" loading={isLoading}>
  Sign In
</Button>
```

**Styles:**
- Primary: bg `#21B576`, text `#0D121C`, hover `#4DC491`, active `#1EA56B`
- Secondary: bg `#121926`, border `#4B5565`, text `#CDD5DF`, hover bg `#202939`
- Danger: bg `#470615`, border `#F26283`, text `#F26283`, hover bg `#810B27`
- Ghost: bg transparent, text `#9AA4B2`, hover bg `#202939`
- All: no border-radius, 600 font weight, 14px font size
- Loading: spinner replaces or prefixes text, button disabled

### 6.2 Badge / Status Chip

```tsx
// Variants: success | danger | warning | info | gold | default
// Sizes: sm | md

<Badge variant="success">Active</Badge>
<Badge variant="danger">Suspended</Badge>
```

Styles: small capsule pill with colored bg (10% opacity of color) + colored text. Use `rounded-full` for badges (exception to 0 radius rule).

### 6.3 MetricCard

```tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: { value: number; direction: 'up' | 'down' };
  icon: LucideIcon;
  accentColor: string;
  isLoading?: boolean;
}
```

Styles: bg `#121926`, border `#4B5565`, 24px padding. Icon in 40x40 square (accent color bg at 10% opacity, icon at 100% accent color). Value in `text-xl font-bold text-bold`. Trend: green for positive, red for negative.

### 6.4 DataTable

Wraps TanStack Table. Features:
- Column sorting (click header, arrow indicators)
- Pagination (prev/next, page numbers, items per page select)
- Loading skeleton rows (shimmer effect)
- Empty state with icon and message
- Row hover highlight (`#202939`)
- Checkbox column for bulk select
- Sticky header on scroll

### 6.5 Modal

Framer Motion animated overlay + panel.
- Overlay: `rgba(0,0,0,0.7)` backdrop
- Panel: bg `#121926`, border `#4B5565`, max-width 480px (sm) or 640px (md) or 800px (lg)
- Header: title (bold white) + X close button
- Body: content slot
- Footer: action buttons (right-aligned)
- Opens with scale + fade animation, closes in reverse

### 6.6 Input / Form Fields

```tsx
<Input
  label="Email Address"
  placeholder="admin@fanndrop.com"
  error="Enter a valid email"
  leftIcon={<Mail size={16} />}
/>
```

- bg `#121926`, border `#697586`
- Focus: border `#21B576` (glow effect: `box-shadow: 0 0 0 3px rgba(33,181,118,0.2)`)
- Error: border `#F26283`, error text below
- Height: 44px (matches mobile app min button height)
- Label: 14px, `#9AA4B2`
- Placeholder: `#697586`

### 6.7 Select / Dropdown

Same styling as Input. Custom-styled (not native select) with Framer Motion dropdown animation.

### 6.8 Tabs

Underline style (no filled background unless active):
- Inactive: `#697586`
- Active: white text + green 2px underline
- Hover: `#9AA4B2`
- Animated indicator slide (Framer Motion `layoutId`)

### 6.9 Skeleton Loader

Shimmer animation using CSS `@keyframes shimmer`. bg `#202939` with highlight sweep. Used in all loading states as exact shape of the real content.

### 6.10 Avatar

- Circular only (`rounded-full`)
- Sizes: xs (24px), sm (32px), md (40px), lg (48px), xl (64px)
- Fallback: initials on `#364152` background in brand green text
- Online indicator: small green dot overlay (bottom right)

### 6.11 Toast Notifications

`react-hot-toast` styled to match design:
- bg `#121926`, border `#4B5565`
- Success: green icon (#6ACDA3)
- Error: red icon (#F26283)
- Info: blue icon (#769FF2)
- Position: bottom-right
- Duration: 4000ms

### 6.12 Sidebar Nav Item

```tsx
// Active state:
// - left 3px solid #21B576 border
// - bg rgba(33,181,118,0.08)
// - text + icon: #21B576

// Inactive hover:
// - bg #202939
// - text: #CDD5DF

// Inactive:
// - text + icon: #697586
```

---

## 7. API Infrastructure

All API code lives in `src/api/`. When real endpoints become available, only this layer needs updating — pages consume React Query hooks which abstract everything.

### 7.1 Axios Client (`src/api/client.ts`)

```ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://api.fanndrop.com/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor: handle 401 (token expired → logout)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 7.2 Endpoints (`src/api/endpoints.ts`)

```ts
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/auth/login',
    LOGOUT: '/admin/auth/logout',
    ME: '/admin/auth/me',
  },
  METRICS: {
    OVERVIEW: '/admin/metrics/overview',
    REVENUE: '/admin/metrics/revenue',
    USER_ACQUISITION: '/admin/metrics/users/acquisition',
    CONTENT_DISTRIBUTION: '/admin/metrics/content/distribution',
    ENGAGEMENT: '/admin/metrics/engagement',
    TOP_ARTISTS: '/admin/metrics/artists/top',
    TOP_CAMPAIGNS: '/admin/metrics/campaigns/top',
    TRANSACTIONS: '/admin/metrics/transactions',
    RECENT_ACTIVITY: '/admin/metrics/activity',
  },
  ARTISTS: {
    LIST: '/admin/artists',
    DETAIL: (id: string) => `/admin/artists/${id}`,
    SUSPEND: (id: string) => `/admin/artists/${id}/suspend`,
    UNSUSPEND: (id: string) => `/admin/artists/${id}/unsuspend`,
    DELETE: (id: string) => `/admin/artists/${id}`,
    CONTENT: (id: string) => `/admin/artists/${id}/content`,
    TRANSACTIONS: (id: string) => `/admin/artists/${id}/transactions`,
  },
  FANS: {
    LIST: '/admin/fans',
    DETAIL: (id: string) => `/admin/fans/${id}`,
    SUSPEND: (id: string) => `/admin/fans/${id}/suspend`,
    DELETE: (id: string) => `/admin/fans/${id}`,
  },
  STAFF: {
    LIST: '/admin/staff',
    CREATE: '/admin/staff',
    UPDATE: (id: string) => `/admin/staff/${id}`,
    DELETE: (id: string) => `/admin/staff/${id}`,
  },
  NOTIFICATIONS: {
    SEND: '/admin/notifications/send',
    HISTORY: '/admin/notifications/history',
  },
  SETTINGS: {
    GET: '/admin/settings',
    UPDATE: '/admin/settings',
    DROP_PACKAGES: '/admin/settings/drop-packages',
    FEATURE_FLAGS: '/admin/settings/feature-flags',
  },
};
```

### 7.3 React Query Hooks Pattern

Each domain has its own hooks file. Pattern:

```ts
// src/api/hooks/useArtists.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import { DEMO_ARTISTS } from '../../data/demo/artists';

const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true' || true;

export function useArtists(filters: ArtistFilters) {
  return useQuery({
    queryKey: ['artists', filters],
    queryFn: async () => {
      if (USE_DEMO) return filterArtists(DEMO_ARTISTS, filters);
      const { data } = await apiClient.get(ENDPOINTS.ARTISTS.LIST, { params: filters });
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSuspendArtist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_DEMO) return { success: true };
      const { data } = await apiClient.post(ENDPOINTS.ARTISTS.SUSPEND(id));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artists'] });
    },
  });
}
```

**Demo mode switch:** Set `VITE_USE_DEMO=true` in `.env`. When `true`, all hooks return demo data from `src/data/demo/`. When `false`, real API calls are made. This single flag enables seamless API integration without touching page-level code.

### 7.4 API Response Types

```ts
// src/types/api.ts
export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface DateFilter {
  period: 'today' | 'week' | 'month' | 'quarter' | 'all';
  startDate?: string;
  endDate?: string;
}
```

---

## 8. Demo Data

All demo data is in `src/data/demo/`. It must be realistic, rich, and varied.

### 8.1 Demo Metrics (`metrics.ts`)

```ts
export const DEMO_OVERVIEW_METRICS = {
  totalRevenue: { value: 47_850_000, trend: 12.4, direction: 'up' },           // ₦47.85M
  totalUsers: { value: 28_412, trend: 8.2, direction: 'up' },
  activeArtists: { value: 3_847, trend: 5.1, direction: 'up' },
  activeFans: { value: 24_565, trend: 9.3, direction: 'up' },
  totalDropsSold: { value: 1_248_900, trend: 15.7, direction: 'up' },
  newSignups: { value: 1_204, trend: -2.3, direction: 'down' },
  contentPublished: { value: 18_742, trend: 22.1, direction: 'up' },
  avgDau: { value: 6_820, trend: 4.8, direction: 'up' },
};

// Revenue over time (30 days of daily data)
export const DEMO_REVENUE_CHART = Array.from({ length: 30 }, (_, i) => ({
  date: format(subDays(new Date(), 29 - i), 'MMM dd'),
  revenue: Math.floor(800_000 + Math.random() * 1_200_000),
}));

// User acquisition (artists vs fans by week)
export const DEMO_USER_ACQUISITION = [...]; // 12 weeks of data

// Content distribution
export const DEMO_CONTENT_DISTRIBUTION = [
  { type: 'Audio', count: 8_241, percentage: 44 },
  { type: 'Video', count: 4_820, percentage: 25.7 },
  { type: 'Campaign', count: 2_108, percentage: 11.3 },
  { type: 'Album', count: 1_947, percentage: 10.4 },
  { type: 'Poll', count: 1_626, percentage: 8.6 },
];
```

### 8.2 Demo Artists (`artists.ts`)

50 realistic artists with:
- Nigerian/African names and usernames
- Genres: Afrobeats, Afro-fusion, Highlife, Amapiano, Gospel, Hip-Hop, R&B, Reggae
- Follower counts (100 to 500,000)
- Various statuses
- Cover art placeholder URLs (use `https://picsum.photos/seed/{id}/400/400`)
- Revenue amounts proportional to followers
- Join dates spread over 2 years

### 8.3 Demo Fans (`fans.ts`)

100 realistic fans with:
- Drops balances (0 to 50,000)
- Total spent amounts
- Artists followed (1 to 50)
- Realistic Nigerian names

### 8.4 Demo Staff (`staff.ts`)

```ts
export const DEMO_STAFF = [
  { id: '1', name: 'Adewale Ogundimu', email: 'admin@fanndrop.com', role: 'Admin', status: 'active', lastLogin: '2026-03-28T09:15:00Z' },
  { id: '2', name: 'Chidinma Okafor', email: 'mod@fanndrop.com', role: 'Moderator', status: 'active', lastLogin: '2026-03-27T14:30:00Z' },
  { id: '3', name: 'Emeka Nwosu', email: 'marketing@fanndrop.com', role: 'Marketing', status: 'active', lastLogin: '2026-03-26T11:00:00Z' },
  { id: '4', name: 'Fatima Aliyu', email: 'support@fanndrop.com', role: 'Support', status: 'inactive', lastLogin: '2026-03-20T08:00:00Z' },
];
```

### 8.5 Demo Notifications History (`notifications.ts`)

20 past notifications with realistic Fanndrop messaging:
- "🎵 New music just dropped! Check out [Artist]'s latest track"
- "💰 Exclusive drop package — 2x drops this weekend only!"
- "🔥 Top trending artists this week — see who's rising fast"
- Delivered counts, open rates (15–45%), timestamps

### 8.6 Demo Settings

```ts
export const DEMO_SETTINGS = {
  appVersion: { ios: '2.4.1', android: '2.4.1' },
  forceUpdate: { enabled: false, iosMinVersion: '2.0.0', androidMinVersion: '2.0.0' },
  maintenanceMode: { enabled: false, message: 'We\'ll be back shortly!' },
  featureFlags: {
    enable_stories: true,
    enable_polls: true,
    enable_campaigns: true,
    enable_video_feed: true,
  },
  dropPackages: [
    { id: '1', name: 'Starter', drops: 50, priceNaira: 500, chargesNaira: 50, active: true },
    { id: '2', name: 'Basic', drops: 200, priceNaira: 1800, chargesNaira: 150, active: true },
    { id: '3', name: 'Standard', drops: 500, priceNaira: 4000, chargesNaira: 300, active: true },
    { id: '4', name: 'Premium', drops: 1000, priceNaira: 7500, chargesNaira: 500, active: true },
    { id: '5', name: 'Ultra', drops: 5000, priceNaira: 35000, chargesNaira: 2000, active: true },
  ],
};
```

---

## 9. Performance Optimization Strategies

### 9.1 React
- Use `React.memo` on all table row components, metric cards, and chart wrappers.
- Use `useCallback` for event handlers passed to child components.
- Use `useMemo` for expensive computations (filtered/sorted table data).
- Lazy-load all page components with `React.lazy` + `Suspense`:
  ```tsx
  const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
  ```
- Avoid prop drilling — use Context only for truly global state. Per-page state stays local.

### 9.2 React Query
- Set appropriate `staleTime` (metrics: 2 min, artist/fan lists: 5 min, settings: 30 min).
- Use `keepPreviousData: true` for paginated tables (prevents flicker on page change).
- Prefetch next page on hover over "Next" pagination button.
- Use `select` option to transform/slice data in-query to avoid re-renders.

### 9.3 Charts (Recharts)
- Wrap charts in `React.memo`.
- Use `isAnimationActive={false}` on charts with large datasets (>100 points).
- Debounce chart resize handlers.
- Cap data points to 365 (daily), 52 (weekly), 24 (monthly) to prevent overloading SVG.

### 9.4 Tables (TanStack Table)
- Enable virtual scrolling (TanStack Virtual) for tables exceeding 100 rows.
- Debounce search input (300ms) before triggering filter.
- Memoize column definitions with `useMemo`.

### 9.5 Assets
- Lazy-load images with `loading="lazy"`.
- Use `srcset` for avatars.
- All user-uploaded images go through CDN (Cloudflare, as used in mobile app).

### 9.6 Bundle
- Use Vite's code splitting. Each route gets its own chunk.
- Analyze bundle with `rollup-plugin-visualizer`.
- Tree-shake Lucide icons (import individually: `import { Users } from 'lucide-react'`).

---

## 10. Coding Standards & Patterns

### 10.1 Principles
- **SRP (Single Responsibility):** Each component does one thing. Extract sub-components aggressively.
- **OCP (Open/Closed):** Components accept variant/config props instead of hardcoded conditionals. Use variant maps.
- **DRY:** Extract repeated patterns into shared components, hooks, and utility functions.
- **No barrel files** (`index.ts` re-exports): import from the actual file path.

### 10.2 Component Structure

```tsx
// ✅ Correct structure for a page component
import { useState, useMemo } from 'react';
import { Users } from 'lucide-react';
import { useArtists } from '@/api/hooks/useArtists';
import { PageHeader } from '@/components/layout/PageHeader';
import { DataTable } from '@/components/ui/DataTable';
import { FilterBar } from '@/components/shared/FilterBar';
import { ArtistActions } from './ArtistActions'; // local to page
import { artistColumns } from './artistColumns';  // local to page
import type { ArtistFilters } from '@/types/models';

export function ArtistsPage() {
  const [filters, setFilters] = useState<ArtistFilters>({ status: 'all', page: 1 });

  const { data, isLoading, isError } = useArtists(filters);

  const columns = useMemo(() => artistColumns, []);

  return (
    <div className="space-y-6">
      <PageHeader title="Artists" count={data?.total} />
      <FilterBar filters={filters} onChange={setFilters} />
      <DataTable columns={columns} data={data?.items ?? []} isLoading={isLoading} />
    </div>
  );
}
```

### 10.3 TypeScript
- All components have explicit prop types (interfaces, not `any`).
- All API responses have typed interfaces in `src/types/`.
- Use discriminated unions for status/variant props.
- Never use `as any` — use type guards or proper generics.

### 10.4 Tailwind CSS
- Use design tokens as CSS variables in `tailwind.config.js` — never hardcode hex colors in JSX.
- Define a custom color palette that maps exactly to the Fanndrop token names:
  ```js
  colors: {
    'bg-app': '#0D121C',
    'bg-surface': '#121926',
    'bg-surface-hover': '#202939',
    'border-default': '#697586',
    'border-subtle': '#4B5565',
    'text-default': '#CDD5DF',
    'text-bold': '#EEF2F6',
    'text-subtle': '#9AA4B2',
    'brand': '#21B576',
    'brand-hover': '#4DC491',
    'brand-press': '#1EA56B',
    'danger': '#F26283',
    'warning': '#F9B05A',
    'success': '#6ACDA3',
    'info': '#769FF2',
    'gold': '#E0C196',
    // ... all tokens
  }
  ```
- Group related classes logically in JSX (layout → spacing → color → typography → interactive → animation).

### 10.5 File Naming
- Components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Utils: `camelCase.ts`
- Types: `camelCase.ts`
- Demo data: `camelCase.ts`

### 10.6 Error Handling
- All React Query `useQuery` calls handle `isError` state — show `<ErrorState />` component.
- Mutations show success/error toasts via `react-hot-toast`.
- Destructive actions (delete, suspend) require confirmation modal before execution.
- Network errors show retry button in error state.

---

## 11. Micro-interactions & Animations

All animations use **Framer Motion**. Follow these patterns:

### 11.1 Page Transitions
```tsx
// Wrap page content in:
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.2, ease: 'easeOut' }}
>
```

### 11.2 Metric Card Counter Animation
Numbers count up from 0 to final value on initial load using Framer Motion's `useMotionValue` + `useTransform`, or a simple custom `useCountUp` hook with `requestAnimationFrame`. Duration: 1.2s, easing: easeOut.

### 11.3 Sidebar
- Expand/collapse: `width` animation, `AnimatePresence` for label fade.
- Active indicator: sliding left border using `layoutId`.

### 11.4 Modal
```tsx
// Overlay
initial={{ opacity: 0 }} animate={{ opacity: 1 }}

// Panel
initial={{ opacity: 0, scale: 0.95, y: 20 }}
animate={{ opacity: 1, scale: 1, y: 0 }}
transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
```

### 11.5 Table Rows
- New rows fade in: `opacity: 0 → 1`, `translateX: -8px → 0` with staggered delay.
- Row hover: bg transition 150ms.
- Delete: row fades out + collapses height.

### 11.6 Button States
- Hover: color transition 150ms.
- Active/press: scale `0.98` with 100ms spring.
- Loading: spinner fade in, text opacity 0.6.

### 11.7 Chart Entry
Charts animate in on mount:
- Recharts built-in `isAnimationActive` for bar/line charts.
- Duration: 800ms, easing: easeInOut.

### 11.8 Badge/Status Pill
Color change (e.g., after suspend) transitions over 300ms.

### 11.9 Skeleton → Content Transition
Content fades in over 300ms replacing skeleton when data loads.

### 11.10 Toast Notifications
- Slide in from bottom-right with spring physics.
- Progress bar depletes over `duration` ms.
- Hover pauses the progress bar (pause auto-dismiss).

### 11.11 Form Validation Feedback
- Error message slides down with `height: 0 → auto` animation.
- Input border transitions red on error, green on valid.

### 11.12 Filter/Search
- Filter result count updates with fade transition.
- Empty state animates in when no results.

---

## 12. Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Paytone One', 'serif'],
        body: ['Hanken Grotesk', 'sans-serif'],
        sans: ['Hanken Grotesk', 'sans-serif'], // override default
      },
      colors: {
        // Semantic tokens (primary usage)
        'bg-app':          '#0D121C',
        'bg-surface':      '#121926',
        'surface-hover':   '#202939',
        'surface-press':   '#364152',
        'border':          '#697586',
        'border-subtle':   '#4B5565',
        'border-bold':     '#9AA4B2',
        'border-focus':    '#21B576',
        't-default':       '#CDD5DF',
        't-bold':          '#EEF2F6',
        't-subtle':        '#9AA4B2',
        't-disabled':      '#697586',
        // Brand
        'brand':           '#21B576',
        'brand-hover':     '#4DC491',
        'brand-press':     '#1EA56B',
        'brand-subtle':    '#092F1F',
        // Status
        'success':         '#6ACDA3',
        'success-bg':      '#092F1F',
        'danger':          '#F26283',
        'danger-bg':       '#470615',
        'warning':         '#F9B05A',
        'warning-bg':      '#532F03',
        'info':            '#769FF2',
        'info-bg':         '#10244C',
        'gold':            '#E0C196',
        'gold-bg':         '#413320',
        // Primitives (for edge cases)
        'green-500':       '#21B576',
        'red-500':         '#EB1446',
      },
      borderRadius: {
        DEFAULT: '0px',
        none: '0px',
        full: '9999px', // Only for avatars and badge pills
      },
      boxShadow: {
        card:     '0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
        elevated: '0 4px 6px rgba(0,0,0,0.4), 0 2px 4px rgba(0,0,0,0.3)',
        modal:    '0 20px 25px rgba(0,0,0,0.5), 0 8px 10px rgba(0,0,0,0.4)',
        'focus-brand': '0 0 0 3px rgba(33,181,118,0.2)',
      },
    },
  },
  plugins: [],
};
```

---

## 13. Environment Variables

```env
# .env (development)
VITE_API_BASE_URL=https://api.fanndrop.com/v1
VITE_USE_DEMO=true

# .env.production
VITE_API_BASE_URL=https://api.fanndrop.com/v1
VITE_USE_DEMO=false
```

---

## 14. Project Setup Commands

```bash
# Create project
npm create vite@latest fanndrop-admin -- --template react-ts
cd fanndrop-admin

# Install dependencies
npm install \
  react-router-dom \
  @tanstack/react-query \
  @tanstack/react-table \
  axios \
  framer-motion \
  react-hook-form \
  zod \
  @hookform/resolvers \
  recharts \
  lucide-react \
  react-hot-toast \
  date-fns \
  clsx \
  tailwind-merge

npm install -D \
  tailwindcss \
  postcss \
  autoprefixer \
  @types/node

npx tailwindcss init -p
```

---

## 15. Responsive Breakpoints

| Breakpoint | Width | Notes |
|---|---|---|
| Mobile | < 768px | Sidebar hidden, hamburger menu |
| Tablet | 768px–1023px | Sidebar collapsed (icons only) |
| Desktop | 1024px+ | Sidebar fully expanded |
| Wide | 1440px+ | Content capped at 1440px max-width |

The dashboard is primarily designed for **desktop** use but must be usable on tablets.

---

## 16. Accessibility

- All interactive elements have `aria-label` where icon-only.
- Color alone never conveys status — always pair with text/icon.
- Keyboard navigation: all dropdowns, modals, and forms are keyboard accessible.
- Focus states visible (`outline: 2px solid #21B576`).
- Tables have proper `<thead>`, `<th scope>`, `<caption>` markup.
- `aria-live` regions for toast notifications.

---

## 17. Key Implementation Notes

1. **No sign-up page.** Login only. Admin accounts are created through the Staff management page by existing admins.

2. **Demo → Real API switch:** The `VITE_USE_DEMO` env flag is the only switch needed. All React Query hooks check this flag and return demo data or call real endpoints accordingly. No page-level code changes required.

3. **Currency:** Primary currency is Nigerian Naira (₦). Format large numbers with `toLocaleString('en-NG')`. Show M/K suffixes on charts and metric cards for readability.

4. **Drops:** The platform's virtual currency. 1 Drop ≈ ₦10 in spend value. Show both Drops count and ₦ equivalent where relevant.

5. **Authentication guard:** All routes except `/login` are wrapped in a `<ProtectedRoute>` component that checks `AuthContext`. Unauthenticated users are redirected to `/login`.

6. **Date filter context:** The global date filter in the header is stored in `AppContext` and consumed by all dashboard sections. It passes `DateFilter` type to all React Query hooks.

7. **Sharp corners everywhere** (0px border radius) except circular avatars and badge pills.

8. **Font loading:** Load Paytone One and Hanken Grotesk from Google Fonts in `index.html`. Both are already used in the Fanndrop mobile app.

9. **Framer Motion** for all transitions — never use CSS `transition` alone for component mount/unmount (it doesn't work). Use Framer for page entry, modals, dropdowns.

10. **Chart colors:** Always use the semantic palette above. Primary metric charts: green (#21B576). Secondary: blue (#769FF2). Tertiary: gold (#E0C196). Status: red (#F26283), orange (#F9B05A).
