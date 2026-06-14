import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  tasks as mockTasks,
  tasksByProject,
  taskById,
  tasksForUser,
} from "@/lib/mock-data";
import type { Task } from "@/types";

/**
 * Tasks data (PRD §8.3). Queries Supabase; falls back to demo data when empty
 * or RLS-blocked. Live data takes over automatically once rows exist.
 */
async function fetchTasks(projectId?: string): Promise<Task[]> {
  let query = supabase.from("tasks").select("*");
  if (projectId) query = query.eq("project_id", projectId);
  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    return projectId ? tasksByProject(projectId) : mockTasks;
  }
  return data as Task[];
}

export function useTasks(projectId?: string) {
  const q = useQuery({
    queryKey: ["tasks", projectId ?? "all"],
    queryFn: () => fetchTasks(projectId),
  });
  const fallback = projectId ? tasksByProject(projectId) : mockTasks;
  return { data: q.data ?? fallback, isLoading: q.isLoading } as const;
}

export function useTask(id: string | undefined) {
  const { data: all } = useTasks();
  return {
    data: id ? (all.find((t) => t.id === id) ?? taskById(id)) : undefined,
    isLoading: false,
  } as const;
}

export function useMyTasks(userId: string) {
  const { data: all } = useTasks();
  const mine = all.filter((t) => t.assignee_id === userId);
  return {
    data: mine.length ? mine : tasksForUser(userId),
    isLoading: false,
  } as const;
}
