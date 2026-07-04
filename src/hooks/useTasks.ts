import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import {
  tasks as mockTasks,
  tasksByProject,
  taskById,
  tasksForUser,
} from "@/lib/mock-data";
import type { Task } from "@/types";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Tasks data (PRD §8.3). Calls the TaskFlow API; falls back to demo data if
 * the request fails (e.g. no backend running yet in local dev).
 * projectId given → GET /projects/:id/tasks (Kanban board, capped at 200).
 * no projectId → GET /tasks (dashboard-wide stats, paginated).
 */
async function fetchTasks(projectId?: string): Promise<Task[]> {
  try {
    if (projectId) {
      const res = await apiClient.get<Task[]>(
        `/projects/${projectId}/tasks`,
      );
      return res.data.length ? res.data : tasksByProject(projectId);
    }
    const res = await apiClient.get<PaginatedResponse<Task>>("/tasks", {
      params: { page: 1, limit: 500 },
    });
    return res.data.data.length ? res.data.data : mockTasks;
  } catch {
    return projectId ? tasksByProject(projectId) : mockTasks;
  }
}

export function useTasks(projectId?: string) {
  const q = useQuery({
    queryKey: ["tasks", projectId ?? "all"],
    queryFn: () => fetchTasks(projectId),
  });
  const fallback = projectId ? tasksByProject(projectId) : mockTasks;
  return { data: q.data ?? fallback, isLoading: q.isLoading } as const;
}

/** GET /tasks/:id — single task fetch, no longer over-fetches the full list. */
async function fetchTask(id: string): Promise<Task | undefined> {
  try {
    const res = await apiClient.get<Task>(`/tasks/${id}`);
    return res.data;
  } catch {
    return taskById(id);
  }
}

export function useTask(id: string | undefined) {
  const q = useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTask(id!),
    enabled: !!id,
  });
  return {
    data: q.data ?? (id ? taskById(id) : undefined),
    isLoading: q.isLoading,
  } as const;
}

/** GET /tasks/mine — server scopes this to the authenticated user's own tasks. */
async function fetchMyTasks(): Promise<Task[]> {
  try {
    const res = await apiClient.get<PaginatedResponse<Task>>("/tasks/mine", {
      params: { page: 1, limit: 100 },
    });
    return res.data.data;
  } catch {
    return [];
  }
}

export function useMyTasks(userId: string) {
  const q = useQuery({
    queryKey: ["tasks", "mine", userId],
    queryFn: fetchMyTasks,
    enabled: !!userId,
  });
  const fallback = tasksForUser(userId);
  const data = q.data?.length ? q.data : fallback;
  return { data, isLoading: q.isLoading } as const;
}
