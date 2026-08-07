'use client';

import { CalendarDays, CheckCircle2, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Task, TaskStatus } from '@/types/task';
import { PriorityBadge, StatusBadge, statusLabel } from './status-badge';

const nextStatus: Record<TaskStatus, TaskStatus> = {
  TODO: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: 'TODO'
};

export function TaskCard({
  task,
  isUpdating,
  onEdit,
  onDelete,
  onStatusChange
}: {
  task: Task;
  isUpdating: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}) {
  const statusToApply = nextStatus[task.status];

  return (
    <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)] transition-transform duration-150 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="break-words text-base font-bold leading-6 text-[var(--text)]">{task.title}</h3>
          <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-[var(--text-muted)]">
            {task.description || 'No description added.'}
          </p>
        </div>
        <MoreVertical aria-hidden className="mt-1 shrink-0 text-[var(--text-muted)]" size={18} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <StatusBadge status={task.status} />
        <PriorityBadge priority={task.priority} />
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <CalendarDays aria-hidden size={16} />
        <span>{formatDate(task.dueDate)}</span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto_auto] gap-2">
        <Button
          className="px-3"
          disabled={isUpdating}
          type="button"
          variant="secondary"
          onClick={() => onStatusChange(task, statusToApply)}
        >
          <CheckCircle2 size={16} />
          <span className="truncate">{statusLabel(statusToApply)}</span>
        </Button>
        <Button
          aria-label={`Edit ${task.title}`}
          className="h-10 min-h-10 w-10 px-0"
          type="button"
          variant="ghost"
          onClick={() => onEdit(task)}
        >
          <Pencil size={16} />
        </Button>
        <Button
          aria-label={`Delete ${task.title}`}
          className="h-10 min-h-10 w-10 px-0 text-[var(--danger)]"
          type="button"
          variant="ghost"
          onClick={() => onDelete(task)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </article>
  );
}
