import { format, formatDistanceToNow, parseISO } from 'date-fns';

export function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `₦${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `₦${(value / 1_000).toFixed(1)}K`;
  }
  return `₦${value.toLocaleString('en-NG')}`;
}

export function formatCurrencyFull(value: number): string {
  return `₦${value.toLocaleString('en-NG')}`;
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toLocaleString('en-NG');
}

export function formatDate(dateStr: string, pattern = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateStr), pattern);
  } catch {
    return dateStr;
  }
}

export function formatRelativeDate(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
  } catch {
    return dateStr;
  }
}

export function formatTrend(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDrops(value: number): string {
  return `${formatNumber(value)} Drops`;
}
