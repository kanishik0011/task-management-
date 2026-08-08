import { Task, TaskCreateInput, TaskUpdateInput } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const TOKEN_KEY = 'assessment_guest_token';
const LOCAL_TASKS_KEY = 'assessment_local_tasks';
const LOCAL_TOKEN_PREFIX = 'local_guest_';

type GuestResponse = {
  accessToken: string;
  guest: { id: string };
};

type ApiErrorBody = {
  message?: string | string[];
};

export function getStoredToken() {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(TOKEN_KEY);
}

export function clearStoredToken() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(LOCAL_TASKS_KEY);
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers
    }
  });

  if (!response.ok) {
    let message = 'Request failed. Please try again.';
    try {
      const body = (await response.json()) as ApiErrorBody;
      if (Array.isArray(body.message)) {
        message = body.message.join(' ');
      } else if (body.message) {
        message = body.message;
      }
    } catch {
      message = response.statusText || message;
    }
    throw new Error(message);
  }

  const text = await response.text();

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

function isNetworkError(error: unknown) {
  return error instanceof TypeError;
}

function createLocalGuest() {
  const guestId = `${LOCAL_TOKEN_PREFIX}${crypto.randomUUID()}`;
  window.localStorage.setItem(TOKEN_KEY, guestId);
  window.localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(createDemoTasks(guestId)));

  return {
    accessToken: guestId,
    guest: { id: guestId }
  };
}

function getLocalGuestId() {
  const token = getStoredToken();
  return token?.startsWith(LOCAL_TOKEN_PREFIX) ? token : null;
}

function ensureLocalTasks() {
  const guestId = getLocalGuestId() ?? createLocalGuest().guest.id;
  const storedTasks = window.localStorage.getItem(LOCAL_TASKS_KEY);

  if (storedTasks) {
    return JSON.parse(storedTasks) as Task[];
  }

  const tasks = createDemoTasks(guestId);
  saveLocalTasks(tasks);
  return tasks;
}

function saveLocalTasks(tasks: Task[]) {
  window.localStorage.setItem(LOCAL_TASKS_KEY, JSON.stringify(tasks));
}

function createDemoTasks(guestId: string): Task[] {
  const now = new Date().toISOString();

  return [
    createLocalTask(guestId, {
      title: 'Review product requirements',
      description: 'Clarify scope, empty states, and review criteria before implementation.',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: daysFromNow(1)
    }),
    createLocalTask(guestId, {
      title: 'Build task CRUD flow',
      description: 'Create, edit, update status, and delete with safe confirmations.',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: daysFromNow(3)
    }),
    {
      ...createLocalTask(guestId, {
        title: 'Document deployment steps',
        description: 'Capture environment variables, API URLs, and production checks.',
        status: 'DONE',
        priority: 'LOW',
        dueDate: daysFromNow(5)
      }),
      createdAt: now,
      updatedAt: now
    }
  ];
}

function createLocalTask(guestId: string, input: TaskInputWithDefaults): Task {
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    title: input.title,
    description: input.description ?? null,
    status: input.status ?? 'TODO',
    priority: input.priority ?? 'MEDIUM',
    dueDate: input.dueDate ?? null,
    createdAt: now,
    updatedAt: now,
    guestId
  };
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

type TaskInputWithDefaults = TaskCreateInput & Required<Pick<TaskCreateInput, 'title'>>;

export const authApi = {
  async createGuest() {
    try {
      const result = await request<GuestResponse>('/auth/guest', {
        method: 'POST'
      });
      window.localStorage.setItem(TOKEN_KEY, result.accessToken);
      return result;
    } catch (error) {
      if (isNetworkError(error)) {
        return createLocalGuest();
      }
      throw error;
    }
  }
};

export const taskApi = {
  async getAll() {
    if (getLocalGuestId()) {
      return ensureLocalTasks();
    }

    try {
      return await request<Task[]>('/tasks');
    } catch (error) {
      if (isNetworkError(error)) {
        return ensureLocalTasks();
      }
      throw error;
    }
  },
  async create(input: TaskCreateInput) {
    if (getLocalGuestId()) {
      const task = createLocalTask(getLocalGuestId() ?? createLocalGuest().guest.id, input);
      saveLocalTasks([task, ...ensureLocalTasks()]);
      return task;
    }

    try {
      return await request<Task>('/tasks', {
        method: 'POST',
        body: JSON.stringify(input)
      });
    } catch (error) {
      if (isNetworkError(error)) {
        const task = createLocalTask(getLocalGuestId() ?? createLocalGuest().guest.id, input);
        saveLocalTasks([task, ...ensureLocalTasks()]);
        return task;
      }
      throw error;
    }
  },
  async update(id: string, input: TaskUpdateInput, currentTask?: Task) {
    if (getLocalGuestId()) {
      return updateLocalTask(id, input, currentTask);
    }

    try {
      return await request<Task>(`/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(input)
      });
    } catch (error) {
      if (isNetworkError(error)) {
        return updateLocalTask(id, input, currentTask);
      }
      throw error;
    }
  },
  async delete(id: string) {
    if (getLocalGuestId()) {
      saveLocalTasks(ensureLocalTasks().filter((task) => task.id !== id));
      return;
    }

    try {
      await request<void>(`/tasks/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      if (isNetworkError(error)) {
        saveLocalTasks(ensureLocalTasks().filter((task) => task.id !== id));
        return;
      }
      throw error;
    }
  }
};

function updateLocalTask(id: string, input: TaskUpdateInput, currentTask?: Task) {
  let updatedTask: Task | undefined;
  const tasks = ensureLocalTasks().map((task) => {
    if (task.id !== id) {
      return task;
    }

    updatedTask = {
      ...task,
      ...input,
      description: input.description ?? task.description,
      dueDate: input.dueDate ?? task.dueDate,
      updatedAt: new Date().toISOString()
    };
    return updatedTask;
  });

  if (!updatedTask && currentTask) {
    updatedTask = {
      ...currentTask,
      ...input,
      description: input.description ?? currentTask.description,
      dueDate: input.dueDate ?? currentTask.dueDate,
      updatedAt: new Date().toISOString()
    };
    saveLocalTasks([updatedTask, ...tasks.filter((task) => task.id !== id)]);
    return updatedTask;
  }

  if (!updatedTask) {
    throw new Error('Task was not found in this workspace.');
  }

  saveLocalTasks(tasks);
  return updatedTask;
}
