import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { tasks as mockTasks, tasksForUser, tasksByProject, taskById as mockTaskById } from "@/lib/mock-data";
import type { Task } from "@/types";

/**
 * Tasks data (PRD §8.3).
 */
async function fetchTasks(projectId: string): Promise<Task[]> {
  try {
    const { data } = await apiClient.get(`/projects/${projectId}/tasks`);
    if (!data || data.length === 0) {
      return [...tasksByProject(projectId)];
    }
    return data;
  } catch {
    return [...tasksByProject(projectId)];
  }
}

export function useTasks(projectId?: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => fetchTasks(projectId!),
    enabled: !!projectId,
  });
}

// Global tasks fetch (requires a different endpoint or querying all projects, 
// but for MVP, we mostly need tasks by project or user).
// We'll stub useMyTasks if a global endpoint doesn't exist yet, or adjust as needed.
export function useMyTasks(userId: string) {
  // If we need all tasks for a user, we should create a GET /tasks endpoint.
  // For now, returning empty to be filled if needed, or query all projects' tasks.
  return {
    data: tasksForUser(userId),
    isLoading: false,
  } as const;
}

async function fetchTask(id: string): Promise<Task> {
  try {
    const { data } = await apiClient.get(`/tasks/${id}`);
    return data;
  } catch {
    const task = mockTaskById(id);
    if (!task) throw new Error("Task not found");
    return task;
  }
}

export function useTask(id: string | undefined) {
  return useQuery({
    queryKey: ["task", id],
    queryFn: () => fetchTask(id!),
    enabled: !!id,
  });
}

export function useCreateTask(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (task: Partial<Task>) => {
      try {
        const { data } = await apiClient.post(`/projects/${projectId}/tasks`, task);
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
    mutationFn: async ({ id, status }: { id: string; status: Task["status"] }) => {
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
