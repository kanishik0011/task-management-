import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(value: string | null) {
  if (!value) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(value));
}

export function toDateInputValue(value: string | null | undefined) {
  if (!value) {
    return '';
  }
  return value.slice(0, 10);
}

export function fromDateInputValue(value: string | undefined) {
  if (!value) {
    return undefined;
  }
  return new Date(`${value}T00:00:00.000Z`).toISOString();
}
