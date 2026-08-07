'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { fromDateInputValue, toDateInputValue } from '@/lib/utils';
import { Priority, PRIORITIES, Task, TaskCreateInput, TASK_STATUSES, TaskStatus } from '@/types/task';
import { priorityLabel, statusLabel } from './status-badge';

const taskSchema = z.object({
  title: z.string().trim().min(2, 'Title must be at least 2 characters.').max(120),
  description: z.string().trim().max(800).optional(),
  status: z.enum(TASK_STATUSES),
  priority: z.enum(PRIORITIES),
  dueDate: z.string().optional()
});

type TaskFormValues = z.infer<typeof taskSchema>;

export function TaskForm({
  task,
  isSubmitting,
  onSubmit,
  onCancel
}: {
  task?: Task;
  isSubmitting: boolean;
  onSubmit: (input: TaskCreateInput) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      status: task?.status ?? 'TODO',
      priority: task?.priority ?? 'MEDIUM',
      dueDate: toDateInputValue(task?.dueDate)
    }
  });

  const submit = (values: TaskFormValues) => {
    onSubmit({
      title: values.title,
      description: values.description || undefined,
      status: values.status,
      priority: values.priority,
      dueDate: fromDateInputValue(values.dueDate)
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(submit)}>
      <Field label="Task title" error={errors.title?.message}>
        <input
          className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          placeholder="e.g. Prepare sprint notes"
          {...register('title')}
        />
      </Field>

      <Field label="Description" error={errors.description?.message}>
        <textarea
          className="min-h-28 w-full resize-y rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm leading-6 outline-none transition-colors focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
          placeholder="Add the important context for this task"
          {...register('description')}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Status" error={errors.status?.message}>
          <select
            className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            {...register('status')}
          >
            {TASK_STATUSES.map((status: TaskStatus) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Priority" error={errors.priority?.message}>
          <select
            className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            {...register('priority')}
          >
            {PRIORITIES.map((priority: Priority) => (
              <option key={priority} value={priority}>
                {priorityLabel(priority)}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Due date" error={errors.dueDate?.message}>
          <input
            className="h-11 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 text-sm outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            type="date"
            {...register('dueDate')}
          />
        </Field>
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : task ? 'Save changes' : 'Create task'}
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[var(--text)]">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs font-medium text-[var(--danger)]">{error}</span> : null}
    </label>
  );
}
