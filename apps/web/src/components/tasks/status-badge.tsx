import { Badge } from '@/components/ui/badge';
import { Priority, TaskStatus } from '@/types/task';

const statusLabels: Record<TaskStatus, string> = {
  TODO: 'To do',
  IN_PROGRESS: 'In progress',
  DONE: 'Done'
};

const priorityLabels: Record<Priority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const tone = status === 'DONE' ? 'green' : status === 'IN_PROGRESS' ? 'blue' : 'neutral';
  return <Badge tone={tone}>{statusLabels[status]}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const tone = priority === 'HIGH' ? 'red' : priority === 'MEDIUM' ? 'amber' : 'green';
  return <Badge tone={tone}>{priorityLabels[priority]}</Badge>;
}

export function statusLabel(status: TaskStatus) {
  return statusLabels[status];
}

export function priorityLabel(priority: Priority) {
  return priorityLabels[priority];
}
