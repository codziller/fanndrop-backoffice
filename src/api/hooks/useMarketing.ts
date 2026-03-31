import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import { DEMO_NOTIFICATIONS } from '@/data/demo/notifications';
import type { PushNotification, NotificationTarget } from '@/types/models';

const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true';

export interface SendNotificationInput {
  title: string;
  body: string;
  target: NotificationTarget;
  specificUserIds?: string[];
  scheduledAt?: string;
}

let demoHistory: PushNotification[] = [...DEMO_NOTIFICATIONS];

export function useNotificationHistory() {
  return useQuery({
    queryKey: ['notifications', 'history'],
    queryFn: async () => {
      if (USE_DEMO) return [...demoHistory];
      const { data } = await apiClient.get(ENDPOINTS.NOTIFICATIONS.HISTORY);
      return data.data as PushNotification[];
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useSendNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: SendNotificationInput) => {
      if (USE_DEMO) {
        await new Promise((r) => setTimeout(r, 800));
        const isScheduled = !!input.scheduledAt;
        const newNotif: PushNotification = {
          id: `n${Date.now()}`,
          title: input.title,
          body: input.body,
          target: input.target,
          targetCount:
            input.target === 'all' ? 28_412 :
            input.target === 'artists' ? 3_847 :
            input.target === 'fans' ? 24_565 :
            (input.specificUserIds?.length ?? 1),
          sentAt: isScheduled ? undefined : new Date().toISOString(),
          scheduledAt: isScheduled ? input.scheduledAt : undefined,
          sentCount: isScheduled ? undefined : 0,
          openedCount: isScheduled ? undefined : 0,
          openRate: isScheduled ? undefined : 0,
          status: isScheduled ? 'scheduled' : 'sent',
        };
        demoHistory = [newNotif, ...demoHistory];
        return newNotif;
      }
      const { data } = await apiClient.post(ENDPOINTS.NOTIFICATIONS.SEND, input);
      return data.data;
    },
    onSuccess: (_, vars) => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
      if (vars.scheduledAt) {
        toast.success('Notification scheduled successfully');
      } else {
        toast.success('Notification sent successfully');
      }
    },
    onError: () => toast.error('Failed to send notification'),
  });
}
