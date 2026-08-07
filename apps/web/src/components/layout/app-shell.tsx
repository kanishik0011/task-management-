'use client';

import { ClipboardList, LayoutDashboard, Menu, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeSwitcher } from '@/components/theme/theme-switcher';
import { cn } from '@/lib/utils';

export function AppShell({
  children,
  taskCount,
  onCreateTask,
  search,
  onSearchChange
}: {
  children: React.ReactNode;
  taskCount: number;
  onCreateTask: () => void;
  search: string;
  onSearchChange: (value: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text)]">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-72 border-r border-[var(--border)] bg-[var(--surface)] p-5 transition-transform lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-[var(--primary)] text-[var(--primary-contrast)]">
              <ClipboardList size={21} />
            </div>
            <div>
              <p className="text-base font-bold">Able Tasks</p>
              <p className="text-xs font-medium text-[var(--text-muted)]">Guest workspace</p>
            </div>
          </div>
          <Button
            aria-label="Close navigation"
            className="h-9 min-h-9 w-9 px-0 lg:hidden"
            variant="ghost"
            onClick={() => setMobileOpen(false)}
          >
            <X size={18} />
          </Button>
        </div>

        <nav className="mt-8 space-y-2" aria-label="Primary navigation">
          <a className="flex h-11 items-center gap-3 rounded-md bg-[var(--surface-muted)] px-3 text-sm font-semibold text-[var(--text)]" href="#">
            <LayoutDashboard size={18} />
            Dashboard
          </a>
        </nav>

        <div className="mt-8 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-4">
          <p className="text-sm font-bold">Today</p>
          <p className="mt-2 text-3xl font-bold">{taskCount}</p>
          <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">tasks in this guest session</p>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          aria-label="Close navigation overlay"
          className="fixed inset-0 z-30 bg-black/35 lg:hidden"
          type="button"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[var(--app-bg)]/95 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-3">
              <Button
                aria-label="Open navigation"
                className="h-10 min-h-10 w-10 px-0 lg:hidden"
                variant="secondary"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={18} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold tracking-normal md:text-3xl">Task Management</h1>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  Plan, prioritize, and move work forward.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <label className="relative block md:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={17} />
                <span className="sr-only">Search tasks</span>
                <input
                  className="h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] pl-10 pr-3 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                  placeholder="Search tasks"
                  value={search}
                  onChange={(event) => onSearchChange(event.target.value)}
                />
              </label>
              <ThemeSwitcher />
              <Button type="button" onClick={onCreateTask}>
                <Plus size={18} />
                New task
              </Button>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}
