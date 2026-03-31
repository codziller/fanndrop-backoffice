import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import { DEMO_FANS } from '@/data/demo/fans';
import type { Fan, UserStatus } from '@/types/models';

const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true';
const LIST_STALE = 5 * 60 * 1000;

export interface FanFilters {
  search?: string;
  status?: UserStatus | 'all';
  sort?: string;
  page?: number;
  perPage?: number;
}

function filterFans(fans: Fan[], filters: FanFilters) {
  let result = [...fans];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.username.toLowerCase().includes(q) ||
        f.email.toLowerCase().includes(q)
    );
  }

  if (filters.status && filters.status !== 'all') {
    result = result.filter((f) => f.status === filters.status);
  }

  if (filters.sort === 'spent') result.sort((a, b) => b.totalSpent - a.totalSpent);
  else if (filters.sort === 'drops') result.sort((a, b) => b.dropsBalance - a.dropsBalance);
  else if (filters.sort === 'following') result.sort((a, b) => b.artistsFollowed - a.artistsFollowed);
  else result.sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime());

  const page = filters.page ?? 1;
  const perPage = filters.perPage ?? 25;
  const start = (page - 1) * perPage;

  return {
    items: result.slice(start, start + perPage),
    total: result.length,
    page,
    perPage,
    totalPages: Math.ceil(result.length / perPage),
  };
}

export function useFans(filters: FanFilters) {
  return useQuery({
    queryKey: ['fans', filters],
    queryFn: async () => {
      if (USE_DEMO) return filterFans(DEMO_FANS, filters);
      const { data } = await apiClient.get(ENDPOINTS.FANS.LIST, { params: filters });
      return data.data;
    },
    staleTime: LIST_STALE,
    placeholderData: (prev) => prev,
  });
}

export function useFan(id: string) {
  return useQuery({
    queryKey: ['fans', id],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_FANS.find((f) => f.id === id) ?? null;
      const { data } = await apiClient.get(ENDPOINTS.FANS.DETAIL(id));
      return data.data;
    },
    staleTime: LIST_STALE,
    enabled: !!id,
  });
}

export function useSuspendFan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_DEMO) return { success: true };
      const { data } = await apiClient.post(ENDPOINTS.FANS.SUSPEND(id));
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['fans'] });
      toast.success('Fan suspended successfully');
    },
    onError: () => toast.error('Failed to suspend fan'),
  });
}

export function useUnsuspendFan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_DEMO) return { success: true };
      const { data } = await apiClient.post(ENDPOINTS.FANS.UNSUSPEND(id));
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['fans'] });
      toast.success('Fan unsuspended successfully');
    },
    onError: () => toast.error('Failed to unsuspend fan'),
  });
}

export function useDeleteFan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_DEMO) return { success: true };
      const { data } = await apiClient.delete(ENDPOINTS.FANS.DELETE(id));
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['fans'] });
      toast.success('Fan deleted successfully');
    },
    onError: () => toast.error('Failed to delete fan'),
  });
}
