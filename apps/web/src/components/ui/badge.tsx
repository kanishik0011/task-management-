import { cn } from '@/lib/utils';

type BadgeTone = 'neutral' | 'blue' | 'green' | 'amber' | 'red';

const tones: Record<BadgeTone, string> = {
  neutral: 'bg-[var(--surface-muted)] text-[var(--text-muted)]',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-400/15 dark:text-blue-200',
  green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-400/15 dark:text-emerald-200',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-400/15 dark:text-amber-200',
  red: 'bg-red-100 text-red-700 dark:bg-red-400/15 dark:text-red-200'
};

export function Badge({
  children,
  tone = 'neutral',
  className
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex min-h-6 items-center rounded-full px-2.5 text-xs font-semibold',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
