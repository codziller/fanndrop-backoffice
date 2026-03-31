import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import {
  DEMO_OVERVIEW_METRICS,
  DEMO_REVENUE_CHART,
  DEMO_USER_ACQUISITION,
  DEMO_CONTENT_DISTRIBUTION,
  DEMO_TOP_ARTISTS,
  DEMO_TOP_CAMPAIGNS,
  DEMO_DROP_PACKAGE_SALES,
  DEMO_TOP_CONTENT,
  DEMO_ENGAGEMENT_SNAPSHOT,
  DEMO_TRANSACTIONS,
  DEMO_PAYMENT_CHANNELS,
  DEMO_ACTIVITY_FEED,
} from '@/data/demo/metrics';
import type { DateFilter } from '@/types/api';

const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true';
const METRICS_STALE = 2 * 60 * 1000;

export function useOverviewMetrics(filter: DateFilter) {
  return useQuery({
    queryKey: ['metrics', 'overview', filter],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_OVERVIEW_METRICS;
      const { data } = await apiClient.get(ENDPOINTS.METRICS.OVERVIEW, { params: filter });
      return data.data;
    },
    staleTime: METRICS_STALE,
  });
}

export function useRevenueChart(filter: DateFilter) {
  return useQuery({
    queryKey: ['metrics', 'revenue', filter],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_REVENUE_CHART;
      const { data } = await apiClient.get(ENDPOINTS.METRICS.REVENUE, { params: filter });
      return data.data;
    },
    staleTime: METRICS_STALE,
  });
}

export function useUserAcquisition(filter: DateFilter) {
  return useQuery({
    queryKey: ['metrics', 'user-acquisition', filter],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_USER_ACQUISITION;
      const { data } = await apiClient.get(ENDPOINTS.METRICS.USER_ACQUISITION, { params: filter });
      return data.data;
    },
    staleTime: METRICS_STALE,
  });
}

export function useContentDistribution(filter: DateFilter) {
  return useQuery({
    queryKey: ['metrics', 'content-distribution', filter],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_CONTENT_DISTRIBUTION;
      const { data } = await apiClient.get(ENDPOINTS.METRICS.CONTENT_DISTRIBUTION, { params: filter });
      return data.data;
    },
    staleTime: METRICS_STALE,
  });
}

export function useTopArtists(filter: DateFilter) {
  return useQuery({
    queryKey: ['metrics', 'top-artists', filter],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_TOP_ARTISTS;
      const { data } = await apiClient.get(ENDPOINTS.METRICS.TOP_ARTISTS, { params: filter });
      return data.data;
    },
    staleTime: METRICS_STALE,
  });
}

export function useTopCampaigns(filter: DateFilter) {
  return useQuery({
    queryKey: ['metrics', 'top-campaigns', filter],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_TOP_CAMPAIGNS;
      const { data } = await apiClient.get(ENDPOINTS.METRICS.TOP_CAMPAIGNS, { params: filter });
      return data.data;
    },
    staleTime: METRICS_STALE,
  });
}

export function useDropPackageSales(filter: DateFilter) {
  return useQuery({
    queryKey: ['metrics', 'drop-package-sales', filter],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_DROP_PACKAGE_SALES;
      const { data } = await apiClient.get(ENDPOINTS.METRICS.DROP_PACKAGE_SALES, { params: filter });
      return data.data;
    },
    staleTime: METRICS_STALE,
  });
}

export function useTopContent(filter: DateFilter) {
  return useQuery({
    queryKey: ['metrics', 'top-content', filter],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_TOP_CONTENT;
      const { data } = await apiClient.get(ENDPOINTS.METRICS.ENGAGEMENT, { params: filter });
      return data.data;
    },
    staleTime: METRICS_STALE,
  });
}

export function useEngagementSnapshot(filter: DateFilter) {
  return useQuery({
    queryKey: ['metrics', 'engagement-snapshot', filter],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_ENGAGEMENT_SNAPSHOT;
      const { data } = await apiClient.get(ENDPOINTS.METRICS.ENGAGEMENT, { params: filter });
      return data.data;
    },
    staleTime: METRICS_STALE,
  });
}

export function useTransactions(filter: DateFilter) {
  return useQuery({
    queryKey: ['metrics', 'transactions', filter],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_TRANSACTIONS;
      const { data } = await apiClient.get(ENDPOINTS.METRICS.TRANSACTIONS, { params: filter });
      return data.data;
    },
    staleTime: METRICS_STALE,
  });
}

export function usePaymentChannels(filter: DateFilter) {
  return useQuery({
    queryKey: ['metrics', 'payment-channels', filter],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_PAYMENT_CHANNELS;
      const { data } = await apiClient.get(ENDPOINTS.METRICS.PAYMENT_CHANNELS, { params: filter });
      return data.data;
    },
    staleTime: METRICS_STALE,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ['metrics', 'activity'],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_ACTIVITY_FEED;
      const { data } = await apiClient.get(ENDPOINTS.METRICS.RECENT_ACTIVITY);
      return data.data;
    },
    staleTime: 60 * 1000,
  });
}
