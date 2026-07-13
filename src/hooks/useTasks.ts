import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
      const res = await apiClient.get<Task[]>(`/projects/${projectId}/tasks`);
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
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => fetchTasks(projectId!),
    enabled: !!projectId,
  });
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

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Partial<Task>) => {
      try {
        const { data } = await apiClient.post(
          `/projects/${projectId}/tasks`,
          task,
        );
        return data;
      } catch {
        // Fallback to local mock data update
        const newTask: Task = {
          id: `t-${Date.now()}`,
          title: task.title || "New Task",
          description: task.description || "",
          status: task.status || "todo",
          priority: task.priority || "medium",
          project_id: projectId,
          assignee_id: task.assignee_id || "u-1", // mock user id
          created_by: "u-1", // mock user id
          due_date: task.due_date ?? null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockTasks.push(newTask);
        return newTask;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      const { data } = await apiClient.put(`/tasks/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: Task["status"];
    }) => {
      const { data } = await apiClient.patch(`/tasks/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Invalidate comments as system_log was added
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.delete(`/tasks/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
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
