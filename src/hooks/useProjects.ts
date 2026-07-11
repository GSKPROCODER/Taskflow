import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { projects as mockProjects, projectById } from "@/lib/mock-data";
import type { Project } from "@/types";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Projects data (PRD §8.2). Calls the TaskFlow API; falls back to demo data
 * if the request fails (e.g. no backend running yet in local dev).
 * limit: 100 keeps this a flat list for now — no pager UI exists yet.
 */
async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await apiClient.get<PaginatedResponse<Project>>("/projects", {
      params: { page: 1, limit: 100 },
    });
    return res.data.data.length ? res.data.data : mockProjects;
  } catch {
    return mockProjects;
  }
}

export function useProjects() {
  const q = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  return { data: q.data ?? mockProjects, isLoading: q.isLoading } as const;
}

export function useProject(id: string | undefined) {
  const { data } = useProjects();
  return {
    data: id ? (data.find((p) => p.id === id) ?? projectById(id)) : undefined,
    isLoading: false,
  } as const;
}
