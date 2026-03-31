import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Spinner } from '@/components/ui/Spinner';
import { TOAST_DURATION_MS } from '@/utils/constants';

// ── Lazy-loaded pages for code splitting ──
const LoginPage        = lazy(() => import('@/pages/auth/LoginPage'));
const DashboardPage    = lazy(() => import('@/pages/dashboard/DashboardPage'));
const ArtistsPage      = lazy(() => import('@/pages/artists/ArtistsPage'));
const ArtistDetailPage = lazy(() => import('@/pages/artists/ArtistDetailPage'));
const FansPage         = lazy(() => import('@/pages/fans/FansPage'));
const FanDetailPage    = lazy(() => import('@/pages/fans/FanDetailPage'));
const StaffPage        = lazy(() => import('@/pages/staff/StaffPage'));
const MarketingPage    = lazy(() => import('@/pages/marketing/MarketingPage'));
const SettingsPage     = lazy(() => import('@/pages/settings/SettingsPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageFallback() {
  return (
    <div className="flex items-center justify-center h-full min-h-[400px]">
      <Spinner size="lg" color="brand" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppProvider>
          <BrowserRouter>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Protected routes — AppLayout enforces auth */}
                <Route element={<AppLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard"        element={<DashboardPage />} />
                  <Route path="/artists"          element={<ArtistsPage />} />
                  <Route path="/artists/:id"      element={<ArtistDetailPage />} />
                  <Route path="/fans"             element={<FansPage />} />
                  <Route path="/fans/:id"         element={<FanDetailPage />} />
                  <Route path="/staff"            element={<StaffPage />} />
                  <Route path="/marketing"        element={<MarketingPage />} />
                  <Route path="/settings"         element={<SettingsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>

          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: TOAST_DURATION_MS,
              style: {
                background: '#121926',
                color: '#CDD5DF',
                border: '1px solid #4B5565',
                borderRadius: '0',
                fontSize: '14px',
              },
              success: {
                iconTheme: { primary: '#6ACDA3', secondary: '#121926' },
              },
              error: {
                iconTheme: { primary: '#F26283', secondary: '#121926' },
              },
            }}
          />
        </AppProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
