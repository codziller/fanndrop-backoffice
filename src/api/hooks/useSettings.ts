import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import { DEMO_SETTINGS } from '@/data/demo/settings';
import type { AppSettings, DropPackage } from '@/types/models';

const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true';
const SETTINGS_STALE = 30 * 60 * 1000;

let demoSettings: AppSettings = { ...DEMO_SETTINGS };

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      if (USE_DEMO) return { ...demoSettings };
      const { data } = await apiClient.get(ENDPOINTS.SETTINGS.GET);
      return data.data as AppSettings;
    },
    staleTime: SETTINGS_STALE,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (updates: Partial<AppSettings>) => {
      if (USE_DEMO) {
        await new Promise((r) => setTimeout(r, 500));
        demoSettings = { ...demoSettings, ...updates };
        return demoSettings;
      }
      const { data } = await apiClient.put(ENDPOINTS.SETTINGS.UPDATE, updates);
      return data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings saved successfully');
    },
    onError: () => toast.error('Failed to save settings'),
  });
}

export function useUpdateFeatureFlag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ flag, enabled }: { flag: string; enabled: boolean }) => {
      if (USE_DEMO) {
        await new Promise((r) => setTimeout(r, 300));
        demoSettings = {
          ...demoSettings,
          featureFlags: { ...demoSettings.featureFlags, [flag]: enabled },
        };
        return demoSettings.featureFlags;
      }
      const { data } = await apiClient.put(ENDPOINTS.SETTINGS.FEATURE_FLAGS, { flag, enabled });
      return data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Feature flag updated');
    },
    onError: () => toast.error('Failed to update feature flag'),
  });
}

export function useUpdateDropPackage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pkg: DropPackage) => {
      if (USE_DEMO) {
        await new Promise((r) => setTimeout(r, 400));
        const existing = demoSettings.dropPackages.findIndex((p) => p.id === pkg.id);
        if (existing >= 0) {
          demoSettings = {
            ...demoSettings,
            dropPackages: demoSettings.dropPackages.map((p) => (p.id === pkg.id ? pkg : p)),
          };
        } else {
          demoSettings = {
            ...demoSettings,
            dropPackages: [...demoSettings.dropPackages, { ...pkg, id: String(Date.now()) }],
          };
        }
        return pkg;
      }
      const { data } = await apiClient.put(`${ENDPOINTS.SETTINGS.DROP_PACKAGES}/${pkg.id}`, pkg);
      return data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Drop package updated');
    },
    onError: () => toast.error('Failed to update drop package'),
  });
}
