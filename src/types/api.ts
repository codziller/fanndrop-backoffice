export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface DateFilter {
  period: 'today' | 'week' | 'month' | 'quarter' | 'all';
  startDate?: string;
  endDate?: string;
}
