import { eachDayOfInterval, format, parseISO } from 'date-fns';

export function expandDateRange(startDate: string, endDate: string): string[] {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  return eachDayOfInterval({ start, end }).map((date) => format(date, 'yyyy-MM-dd'));
}

export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
