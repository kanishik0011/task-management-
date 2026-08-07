'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from './button';

export function Dialog({
  open,
  title,
  description,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4"
      role="dialog"
    >
      <div className="w-full max-w-xl rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--text)]">{title}</h2>
            {description ? (
              <p className="mt-1 text-sm leading-6 text-[var(--text-muted)]">{description}</p>
            ) : null}
          </div>
          <Button aria-label="Close dialog" className="h-9 min-h-9 w-9 px-0" variant="ghost" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
