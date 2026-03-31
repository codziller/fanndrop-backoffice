import type { Staff } from '@/types/models';

export const DEMO_STAFF: Staff[] = [
  {
    id: '1',
    name: 'Adewale Ogundimu',
    email: 'admin@fanndrop.com',
    role: 'Admin',
    status: 'active',
    lastLogin: '2026-03-30T09:15:00Z',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Chidinma Okafor',
    email: 'mod@fanndrop.com',
    role: 'Moderator',
    status: 'active',
    lastLogin: '2026-03-29T14:30:00Z',
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '3',
    name: 'Emeka Nwosu',
    email: 'marketing@fanndrop.com',
    role: 'Marketing',
    status: 'active',
    lastLogin: '2026-03-28T11:00:00Z',
    createdAt: '2024-02-01T10:00:00Z',
  },
  {
    id: '4',
    name: 'Fatima Aliyu',
    email: 'support@fanndrop.com',
    role: 'Support',
    status: 'inactive',
    lastLogin: '2026-03-20T08:00:00Z',
    createdAt: '2024-03-01T10:00:00Z',
  },
];
