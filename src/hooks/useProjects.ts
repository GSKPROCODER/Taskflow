import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    if (!res.data || res.data.data.length === 0) {
      return [...mockProjects];
    }
    return res.data.data;
  } catch {
    return [...mockProjects];
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

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: { name: string; description?: string }) => {
      try {
        const { data } = await apiClient.post<Project>("/projects", project);
        return data;
      } catch {
        // Fallback to local mock data update
        const newProject: Project = {
          id: `p-${Date.now()}`,
          name: project.name || "New Project",
          description: project.description || "",
          status: "active",
          created_by: "u-1", // mock user id
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockProjects.push(newProject);
        return newProject;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: { name?: string; description?: string } }) => {
      const { data } = await apiClient.put<Project>(`/projects/${id}`, updates);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useArchiveProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await apiClient.patch<Project>(`/projects/${id}/archive`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
