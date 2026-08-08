'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, ClipboardPlus, Loader2, RefreshCw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { authApi, clearStoredToken, getStoredToken, taskApi } from '@/lib/api';
import { Task, TaskUpdateInput, TASK_STATUSES, TaskStatus } from '@/types/task';
import { TaskCard } from './task-card';
import { TaskForm } from './task-form';
import { statusLabel } from './status-badge';

const TASKS_QUERY_KEY = ['tasks'] as const;

export function TaskDashboard() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const guestMutation = useMutation({
    mutationFn: authApi.createGuest,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY })
  });

  const tasksQuery = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: async () => {
      if (!getStoredToken()) {
        await authApi.createGuest();
      }
      return taskApi.getAll();
    }
  });

  const createMutation = useMutation({
    mutationFn: taskApi.create,
    onSuccess: () => {
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      input,
      currentTask
    }: {
      id: string;
      input: TaskUpdateInput;
      currentTask?: Task;
    }) => taskApi.update(id, input, currentTask),
    onMutate: async ({ id, input }) => {
      await queryClient.cancelQueries({ queryKey: TASKS_QUERY_KEY });
      const previousTasks = queryClient.getQueryData<Task[]>(TASKS_QUERY_KEY);

      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (currentTasks) =>
        currentTasks?.map((task) =>
          task.id === id
            ? {
                ...task,
                ...input,
                updatedAt: new Date().toISOString()
              }
            : task
        )
      );

      return { previousTasks };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(TASKS_QUERY_KEY, context.previousTasks);
      }
    },
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (currentTasks) =>
        currentTasks?.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      setEditingTask(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: taskApi.delete,
    onSuccess: () => {
      setDeletingTask(null);
      queryClient.invalidateQueries({ queryKey: TASKS_QUERY_KEY });
    }
  });

  const tasks = tasksQuery.data ?? [];
  const filteredTasks = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      return tasks;
    }
    return tasks.filter((task) =>
      [task.title, task.description ?? '', task.priority, task.status]
        .join(' ')
        .toLowerCase()
        .includes(normalized)
    );
  }, [search, tasks]);

  const groupedTasks = useMemo(
    () =>
      TASK_STATUSES.map((status) => ({
        status,
        tasks: filteredTasks.filter((task) => task.status === status)
      })),
    [filteredTasks]
  );

  const resetGuest = async () => {
    createMutation.reset();
    updateMutation.reset();
    deleteMutation.reset();
    guestMutation.reset();
    clearStoredToken();
    await guestMutation.mutateAsync();
  };

  const actionError =
    createMutation.error?.message ||
    updateMutation.error?.message ||
    deleteMutation.error?.message ||
    guestMutation.error?.message;
  const visibleActionError =
    actionError === 'Failed to fetch' && tasks.length > 0 ? undefined : actionError;

  return (
    <AppShell
      search={search}
      taskCount={tasks.length}
      onCreateTask={() => setIsCreateOpen(true)}
      onSearchChange={setSearch}
    >
      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <Metric label="Total tasks" value={tasks.length} />
        <Metric label="In progress" value={tasks.filter((task) => task.status === 'IN_PROGRESS').length} />
        <Metric label="Completed" value={tasks.filter((task) => task.status === 'DONE').length} />
      </section>

      {tasksQuery.isLoading ? <LoadingState /> : null}
      {tasksQuery.isError ? (
        <ErrorState message={tasksQuery.error.message} onRetry={() => tasksQuery.refetch()} />
      ) : null}

      {visibleActionError ? (
        <div className="mb-5 flex items-start gap-3 rounded-lg border border-[var(--danger)]/40 bg-[var(--surface)] p-4 text-sm text-[var(--danger)]">
          <AlertCircle className="mt-0.5 shrink-0" size={18} />
          <p>{visibleActionError}</p>
        </div>
      ) : null}

      {!tasksQuery.isLoading && !tasksQuery.isError && tasks.length === 0 ? (
        <EmptyState onCreateTask={() => setIsCreateOpen(true)} />
      ) : null}

      {!tasksQuery.isLoading && !tasksQuery.isError && tasks.length > 0 ? (
        <div className="grid gap-4 xl:grid-cols-3">
          {groupedTasks.map((group) => (
            <TaskColumn
              key={group.status}
              status={group.status}
              tasks={group.tasks}
              isUpdating={updateMutation.isPending}
              updatingTaskId={updateMutation.variables?.id}
              onDelete={setDeletingTask}
              onEdit={setEditingTask}
              onStatusChange={(task, status) => {
                updateMutation.reset();
                updateMutation.mutate({ id: task.id, input: { status }, currentTask: task });
              }}
            />
          ))}
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <Button disabled={guestMutation.isPending} type="button" variant="ghost" onClick={resetGuest}>
          <RefreshCw size={16} />
          New guest session
        </Button>
      </div>

      <Dialog
        description="Add the right amount of context so the next action is obvious."
        open={isCreateOpen}
        title="Create task"
        onClose={() => setIsCreateOpen(false)}
      >
        <TaskForm
          isSubmitting={createMutation.isPending}
          onCancel={() => setIsCreateOpen(false)}
          onSubmit={(input) => {
            createMutation.reset();
            updateMutation.reset();
            deleteMutation.reset();
            createMutation.mutate(input);
          }}
        />
      </Dialog>

      <Dialog
        description="Keep the task accurate without losing its history."
        open={Boolean(editingTask)}
        title="Edit task"
        onClose={() => setEditingTask(null)}
      >
        {editingTask ? (
          <TaskForm
            task={editingTask}
            isSubmitting={updateMutation.isPending}
            onCancel={() => setEditingTask(null)}
            onSubmit={(input) => {
              updateMutation.reset();
              updateMutation.mutate({ id: editingTask.id, input, currentTask: editingTask });
            }}
          />
        ) : null}
      </Dialog>

      <Dialog
        description="This removes the task from the current guest workspace."
        open={Boolean(deletingTask)}
        title="Delete task?"
        onClose={() => setDeletingTask(null)}
      >
        <div className="rounded-md bg-[var(--surface-muted)] p-4 text-sm leading-6 text-[var(--text-muted)]">
          {deletingTask?.title}
        </div>
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={() => setDeletingTask(null)}>
            Cancel
          </Button>
          <Button
            disabled={deleteMutation.isPending || !deletingTask}
            type="button"
            variant="danger"
            onClick={() => {
              if (!deletingTask) {
                return;
              }
              createMutation.reset();
              updateMutation.reset();
              deleteMutation.reset();
              deleteMutation.mutate(deletingTask.id);
            }}
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete task'}
          </Button>
        </div>
      </Dialog>
    </AppShell>
  );
}

function TaskColumn({
  status,
  tasks,
  isUpdating,
  updatingTaskId,
  onEdit,
  onDelete,
  onStatusChange
}: {
  status: TaskStatus;
  tasks: Task[];
  isUpdating: boolean;
  updatingTaskId?: string;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}) {
  return (
    <section className="min-h-48 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-normal text-[var(--text-muted)]">
          {statusLabel(status)}
        </h2>
        <span className="rounded-full bg-[var(--surface)] px-2.5 py-1 text-xs font-bold text-[var(--text-muted)]">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.length ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              isUpdating={isUpdating && updatingTaskId === task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
              onStatusChange={onStatusChange}
            />
          ))
        ) : (
          <p className="rounded-md border border-dashed border-[var(--border)] bg-[var(--surface)] p-4 text-sm leading-6 text-[var(--text-muted)]">
            No tasks here.
          </p>
        )}
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow)]">
      <p className="text-sm font-semibold text-[var(--text-muted)]">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="grid min-h-80 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex items-center gap-3 text-sm font-semibold text-[var(--text-muted)]">
        <Loader2 className="animate-spin" size={18} />
        Loading your guest workspace
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="grid min-h-80 place-items-center rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
      <div>
        <AlertCircle className="mx-auto text-[var(--danger)]" size={32} />
        <h2 className="mt-3 text-lg font-bold">Unable to load tasks</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">{message}</p>
        <Button className="mt-5" type="button" variant="secondary" onClick={onRetry}>
          <RefreshCw size={16} />
          Retry
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ onCreateTask }: { onCreateTask: () => void }) {
  return (
    <div className="grid min-h-80 place-items-center rounded-lg border border-dashed border-[var(--border)] bg-[var(--surface)] p-6 text-center">
      <div>
        <ClipboardPlus className="mx-auto text-[var(--primary)]" size={36} />
        <h2 className="mt-3 text-lg font-bold">Create your first task</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--text-muted)]">
          Start with a clear title, priority, and due date so the board becomes useful immediately.
        </p>
        <Button className="mt-5" type="button" onClick={onCreateTask}>
          Create task
        </Button>
      </div>
    </div>
  );
}
