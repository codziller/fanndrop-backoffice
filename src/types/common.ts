export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface PaginationConfig {
  page: number;
  perPage: number;
}

export interface SelectOption {
  value: string;
  label: string;
}

export type BadgeVariant = 'success' | 'danger' | 'warning' | 'info' | 'gold' | 'default';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ModalSize = 'sm' | 'md' | 'lg';
