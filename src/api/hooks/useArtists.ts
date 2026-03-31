import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import { DEMO_ARTISTS } from '@/data/demo/artists';
import type { Artist, UserStatus } from '@/types/models';

const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true';
const LIST_STALE = 5 * 60 * 1000;

export interface ArtistFilters {
  search?: string;
  status?: UserStatus | 'all';
  genre?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}

function filterArtists(artists: Artist[], filters: ArtistFilters) {
  let result = [...artists];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.username.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q)
    );
  }

  if (filters.status && filters.status !== 'all') {
    result = result.filter((a) => a.status === filters.status);
  }

  if (filters.genre && filters.genre !== 'all') {
    result = result.filter((a) => a.genres.includes(filters.genre!));
  }

  if (filters.sort === 'followers') result.sort((a, b) => b.followers - a.followers);
  else if (filters.sort === 'content') result.sort((a, b) => b.contentCount - a.contentCount);
  else if (filters.sort === 'revenue') result.sort((a, b) => b.revenue - a.revenue);
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

export function useArtists(filters: ArtistFilters) {
  return useQuery({
    queryKey: ['artists', filters],
    queryFn: async () => {
      if (USE_DEMO) return filterArtists(DEMO_ARTISTS, filters);
      const { data } = await apiClient.get(ENDPOINTS.ARTISTS.LIST, { params: filters });
      return data.data;
    },
    staleTime: LIST_STALE,
    placeholderData: (prev) => prev,
  });
}

export function useArtist(id: string) {
  return useQuery({
    queryKey: ['artists', id],
    queryFn: async () => {
      if (USE_DEMO) return DEMO_ARTISTS.find((a) => a.id === id) ?? null;
      const { data } = await apiClient.get(ENDPOINTS.ARTISTS.DETAIL(id));
      return data.data;
    },
    staleTime: LIST_STALE,
    enabled: !!id,
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
      void queryClient.invalidateQueries({ queryKey: ['artists'] });
      toast.success('Artist suspended successfully');
    },
    onError: () => toast.error('Failed to suspend artist'),
  });
}

export function useUnsuspendArtist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_DEMO) return { success: true };
      const { data } = await apiClient.post(ENDPOINTS.ARTISTS.UNSUSPEND(id));
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['artists'] });
      toast.success('Artist unsuspended successfully');
    },
    onError: () => toast.error('Failed to unsuspend artist'),
  });
}

export function useVerifyArtist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_DEMO) return { success: true };
      const { data } = await apiClient.post(ENDPOINTS.ARTISTS.VERIFY(id));
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['artists'] });
      toast.success('Artist verified successfully');
    },
    onError: () => toast.error('Failed to verify artist'),
  });
}

export function useDeleteArtist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_DEMO) return { success: true };
      const { data } = await apiClient.delete(ENDPOINTS.ARTISTS.DELETE(id));
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['artists'] });
      toast.success('Artist deleted successfully');
    },
    onError: () => toast.error('Failed to delete artist'),
  });
}
