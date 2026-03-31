# Fanndrop Admin Dashboard — Persistent Project Context

## Overview
- React 18 + Vite web app, TypeScript throughout.
- Styling: Tailwind CSS v3 with custom design tokens mapped to Fanndrop's mobile design system.
- App state: React Context API (`AuthContext`, `AppContext`).
- Server/API state: TanStack Query (React Query) v5.
- Routing: React Router v6.
- Charts: Recharts. Tables: TanStack Table v8.
- Animations: Framer Motion (all transitions/mount animations).
- Forms: React Hook Form + Zod.
- Toasts: react-hot-toast.
- Dark theme only — matches the Fanndrop mobile app default.

## Structure and Patterns

- **Pages** live in `src/pages/<feature>/` — one file per page, named `<Feature>Page.tsx`.
- **Reusable UI components** live in `src/components/ui/` — use these before creating new UI.
- **Chart wrappers** live in `src/components/charts/` — thin wrappers over Recharts primitives.
- **Layout components** live in `src/components/layout/` — `Sidebar`, `Header`, `AppLayout`, `PageHeader`.
- **Shared feature-level components** live in `src/components/shared/` — `MetricCard`, `FilterBar`, `EmptyState`, `ErrorState`, `UserAvatar`.
- **Per-page subcomponents** live alongside the page file (e.g., `src/pages/artists/ArtistActions.tsx`).
- **API hooks** live in `src/api/hooks/use<Domain>.ts` — one file per domain.
- **API client** lives in `src/api/client.ts` (Axios instance with auth interceptors).
- **Endpoint constants** live in `src/api/endpoints.ts`.
- **Demo data** lives in `src/data/demo/<domain>.ts` — used when `VITE_USE_DEMO=true`.
- **Types** live in `src/types/` — `api.ts` (API response shapes), `models.ts` (domain models), `common.ts` (utility types).
- **Utilities** live in `src/utils/` — `format.ts` (number/currency/date formatters), `constants.ts`, `helpers.ts`.

## Design System (never hardcode values)

### Colors
Use Tailwind classes that map to Fanndrop's design tokens (defined in `tailwind.config.js`). **Never** use raw hex values in JSX. The token names are:

```
Backgrounds:   bg-app, bg-surface, surface-hover, surface-press, bg-input
Borders:       border, border-subtle, border-bold, border-focus
Text:          t-default, t-bold, t-subtle, t-disabled
Brand:         brand, brand-hover, brand-press, brand-subtle
Status text:   success, danger, warning, info, gold
Status bg:     success-bg, danger-bg, warning-bg, info-bg, gold-bg
```

Full token → hex mapping is in `tailwind.config.js` and documented in `admin_plan.md`.

### Typography
- **Display/Brand:** `font-display` (Paytone One) — logo, hero headings only.
- **Everything else:** `font-body` (Hanken Grotesk, also the `font-sans` default).
- Use size classes defined in `tailwind.config.js`: `text-sm` (14px), `text-md` (16px), `text-lg` (18px), `text-xl` (20px), `heading-xs` (24px), `heading-sm` (30px), etc.
- Font weights: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 900 (heading-sm only).

### Border Radius
- **0px everywhere** (no rounded corners). This is the Fanndrop design system standard.
- **Exceptions only:** `rounded-full` for avatar images and badge/status pills.
- Do NOT apply `rounded`, `rounded-md`, `rounded-lg`, etc. to cards, buttons, inputs, modals, or dropdowns.

### Icons
Use **Lucide React** for all icons. Import individually (tree-shaking):
```tsx
import { Users, Music2, TrendingUp } from 'lucide-react';
```
- Sidebar nav: 20px
- Table row actions: 16px
- Metric card icons: 24px
- Inline text icons: 14–16px

### Spacing
- Base unit: 4px. Prefer steps: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- Card padding: 24px (`p-6`).
- Section gaps: 24px (`gap-6`) between cards, 32px (`gap-8`) between sections.

## API / State Management Patterns

### Demo Mode
`VITE_USE_DEMO=true` in `.env` makes all hooks return data from `src/data/demo/`. Set to `false` to hit real endpoints. No page code changes needed.

```ts
// Pattern for every hook:
const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true';

export function useArtists(filters: ArtistFilters) {
  return useQuery({
    queryKey: ['artists', filters],
    queryFn: async () => {
      if (USE_DEMO) return filterArtists(DEMO_ARTISTS, filters);
      const { data } = await apiClient.get(ENDPOINTS.ARTISTS.LIST, { params: filters });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
}
```

### React Query Config
- `staleTime`: metrics 2min, lists 5min, settings 30min.
- `keepPreviousData: true` on all paginated table queries.
- Mutations: `onSuccess` → `queryClient.invalidateQueries` to refresh affected lists.
- All mutations show `toast.success()` / `toast.error()` via react-hot-toast.

### Auth Context
```ts
// Provided by AuthContext:
const { user, token, login, logout, isAuthenticated } = useAuth();
```
Token stored in `localStorage` as `admin_token`. All Axios requests attach it as `Authorization: Bearer <token>`. 401 responses trigger auto-logout + redirect to `/login`.

### App Context
```ts
// Provided by AppContext:
const { sidebarCollapsed, toggleSidebar, dateFilter, setDateFilter } = useApp();
```
`dateFilter` (type `DateFilter`) is global — all dashboard metric hooks consume it.

## Component Patterns

### Variant Maps (OCP — avoid large if/switch chains)
```tsx
const variantStyles = {
  success: 'bg-success-bg text-success border-success/20',
  danger:  'bg-danger-bg text-danger border-danger/20',
  warning: 'bg-warning-bg text-warning border-warning/20',
  info:    'bg-info-bg text-info border-info/20',
  gold:    'bg-gold-bg text-gold border-gold/20',
} as const;

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium border ${variantStyles[variant]}`}>
      {children}
    </span>
  );
}
```

### Compound Destructure Pattern
For components with subcomponents (e.g., `Table`), export as namespace:
```tsx
export const Table = { Root: TableRoot, Header: TableHeader, Body: TableBody, Row: TableRow, Cell: TableCell };
```

### Memoization
- Memoize column definitions: `const columns = useMemo(() => [...], [])`.
- Memoize expensive filter logic: `const filtered = useMemo(() => filter(data, filters), [data, filters])`.
- Wrap pure display components in `React.memo`.
- Use `useCallback` for handlers passed to memoized children.

## Animations (Framer Motion — always use this, not CSS keyframes for mount/unmount)

### Page entry
```tsx
<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
```

### Modal
```tsx
// overlay: opacity 0→1
// panel: opacity 0→1, scale 0.95→1, y 20→0, duration 0.2, ease [0.16, 1, 0.3, 1]
```

### Sidebar collapse
Animate `width` with Framer Motion. Use `AnimatePresence` for label fade. Active nav indicator uses `layoutId` for slide animation.

### Number counter (metric cards)
Use a `useCountUp(target, duration=1200)` custom hook with `requestAnimationFrame` to animate numbers from 0 to value on mount.

### Table rows
Fade + slide in on mount. Stagger with `delay: index * 0.03`. Fade out on delete.

All animation durations: 150ms (hover), 200ms (modal/page), 300ms (list stagger). Spring for press/scale effects.

## Performance Expectations

- Lazy-load all page components with `React.lazy` + `Suspense`.
- Virtual scrolling (TanStack Virtual) for tables over 100 rows.
- Debounce search inputs 300ms.
- `isAnimationActive={false}` on Recharts charts with >100 data points.
- Import Lucide icons individually (never `import * from 'lucide-react'`).
- No inline function definitions in JSX that cause unnecessary re-renders.
- Put yourself in the position of a senior world-class frontend engineer. The dashboard must be fast, smooth, and completely hitch-free.

## Coding Standards

- TypeScript strict mode. No `any`. No non-null assertions (`!`) without a comment justifying it.
- All component props typed with `interface`, not `type` aliases (except union types).
- SRP: one responsibility per component. Extract aggressively.
- OCP: extend via props/variants, not by modifying existing components.
- No hardcoded strings — use constants from `src/utils/constants.ts`.
- All currency values in Naira (₦) using `formatCurrency(value)` from `src/utils/format.ts`.
- All dates formatted via `formatDate(date, pattern)` from `src/utils/format.ts`.
- Destructive actions (delete, suspend, bulk actions) always require a confirmation modal before execution.
- All forms validated with Zod schemas co-located with the form component.

## Important

- No sign-up page. Login only. Staff accounts created by admins through the Staff page.
- `VITE_USE_DEMO=true` is the default. The app must be fully functional with demo data.
- Always read a component file before editing it. Do not guess at existing interfaces.
- When adding a new page: (1) create the page file, (2) add the route in `App.tsx`, (3) add the nav item in `Sidebar.tsx`.
- Do not run `npm run build` or lint — focus on implementing code correctly; the engineer will handle build validation.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Production build
npm run preview   # Preview production build
```
