'use client';

import { MonitorCog } from 'lucide-react';
import { ThemeName, useTheme } from '@/providers/theme-provider';

const themes: { value: ThemeName; label: string; swatch: string }[] = [
  { value: 'daylight', label: 'Daylight', swatch: 'bg-[#2864d9]' },
  { value: 'midnight', label: 'Midnight', swatch: 'bg-[#75a7ff]' },
  { value: 'sage', label: 'Sage', swatch: 'bg-[#326b5b]' }
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-1">
      <MonitorCog aria-hidden size={16} className="ml-2 text-[var(--text-muted)]" />
      {themes.map((item) => (
        <button
          key={item.value}
          aria-pressed={theme === item.value}
          className="flex h-8 items-center gap-2 rounded px-2 text-xs font-semibold text-[var(--text-muted)] outline-none transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] aria-pressed:bg-[var(--primary)] aria-pressed:text-[var(--primary-contrast)]"
          type="button"
          onClick={() => setTheme(item.value)}
        >
          <span className={`h-3 w-3 rounded-full ${item.swatch}`} />
          <span className="hidden sm:inline">{item.label}</span>
        </button>
      ))}
    </div>
  );
}
