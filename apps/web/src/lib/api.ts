import { Task, TaskCreateInput, TaskUpdateInput } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
const TOKEN_KEY = 'assessment_guest_token';

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

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const authApi = {
  async createGuest() {
    const result = await request<GuestResponse>('/auth/guest', {
      method: 'POST'
    });
    window.localStorage.setItem(TOKEN_KEY, result.accessToken);
    return result;
  }
};

export const taskApi = {
  getAll: () => request<Task[]>('/tasks'),
  create: (input: TaskCreateInput) =>
    request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(input)
    }),
  update: (id: string, input: TaskUpdateInput) =>
    request<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input)
    }),
  delete: (id: string) =>
    request<void>(`/tasks/${id}`, {
      method: 'DELETE'
    })
};
