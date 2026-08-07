import { Prisma, Priority, TaskStatus } from '@prisma/client';
import { describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../prisma/prisma.service';
import { TasksService } from './tasks.service';

function createService() {
  const prisma = {
    task: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    }
  };

  return {
    service: new TasksService(prisma as unknown as PrismaService),
    prisma
  };
}

describe('TasksService', () => {
  it('scopes task queries to the current guest', async () => {
    const { service, prisma } = createService();
    prisma.task.findMany.mockResolvedValue([]);

    await service.findAll('guest_a');

    expect(prisma.task.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { guestId: 'guest_a' }
      })
    );
  });

  it('creates a task with validated enum values and parsed due date', async () => {
    const { service, prisma } = createService();
    prisma.task.create.mockResolvedValue({ id: 'task_1' });

    await service.create('guest_a', {
      title: 'Ship assessment',
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      dueDate: '2026-08-10T00:00:00.000Z'
    });

    const [createArgs] = prisma.task.create.mock.calls[0] as [Prisma.TaskCreateArgs];
    expect(createArgs.data).toMatchObject({
      guestId: 'guest_a',
      title: 'Ship assessment',
      status: TaskStatus.TODO,
      priority: Priority.HIGH,
      dueDate: new Date('2026-08-10T00:00:00.000Z')
    });
  });

  it('prevents updates to tasks owned by another guest', async () => {
    const { service, prisma } = createService();
    prisma.task.findFirst.mockResolvedValue(null);

    await expect(service.update('guest_a', 'task_foreign', { title: 'Rename' })).rejects.toThrow(
      'Task was not found.'
    );
    expect(prisma.task.update).not.toHaveBeenCalled();
  });
});
