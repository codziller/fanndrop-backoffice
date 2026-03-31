import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../client';
import { ENDPOINTS } from '../endpoints';
import { DEMO_STAFF } from '@/data/demo/staff';
import type { Staff, StaffRole } from '@/types/models';

const USE_DEMO = import.meta.env.VITE_USE_DEMO === 'true';
const LIST_STALE = 5 * 60 * 1000;

export interface CreateStaffInput {
  name: string;
  email: string;
  role: StaffRole;
  password: string;
  sendInvite: boolean;
}

export interface UpdateStaffInput {
  id: string;
  name?: string;
  role?: StaffRole;
  status?: 'active' | 'inactive';
}

// Local mutable copy for demo
let demoStaff: Staff[] = [...DEMO_STAFF];

export function useStaff() {
  return useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      if (USE_DEMO) return [...demoStaff];
      const { data } = await apiClient.get(ENDPOINTS.STAFF.LIST);
      return data.data as Staff[];
    },
    staleTime: LIST_STALE,
  });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateStaffInput) => {
      if (USE_DEMO) {
        await new Promise((r) => setTimeout(r, 500));
        const newMember: Staff = {
          id: String(Date.now()),
          name: input.name,
          email: input.email,
          role: input.role,
          status: 'active',
          lastLogin: '-',
          createdAt: new Date().toISOString(),
        };
        demoStaff = [...demoStaff, newMember];
        return newMember;
      }
      const { data } = await apiClient.post(ENDPOINTS.STAFF.CREATE, input);
      return data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member added successfully');
    },
    onError: () => toast.error('Failed to add staff member'),
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateStaffInput) => {
      if (USE_DEMO) {
        await new Promise((r) => setTimeout(r, 400));
        demoStaff = demoStaff.map((s) => (s.id === input.id ? { ...s, ...input } : s));
        return { success: true };
      }
      const { data } = await apiClient.put(ENDPOINTS.STAFF.UPDATE(input.id), input);
      return data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member updated');
    },
    onError: () => toast.error('Failed to update staff member'),
  });
}

export function useDeleteStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (USE_DEMO) {
        await new Promise((r) => setTimeout(r, 400));
        demoStaff = demoStaff.filter((s) => s.id !== id);
        return { success: true };
      }
      const { data } = await apiClient.delete(ENDPOINTS.STAFF.DELETE(id));
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast.success('Staff member removed');
    },
    onError: () => toast.error('Failed to remove staff member'),
  });
}
