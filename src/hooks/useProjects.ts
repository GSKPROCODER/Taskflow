import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { projects as mockProjects, projectById } from "@/lib/mock-data";
import type { Project } from "@/types";

/**
 * Projects data (PRD §8.2).
 */
async function fetchProjects(): Promise<Project[]> {
  try {
    const { data } = await apiClient.get<Project[]>("/projects");
    if (!data || data.length === 0) return mockProjects;
    return data;
  } catch (error) {
    console.error("Failed to fetch projects, falling back to mock data", error);
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

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (project: { name: string; description?: string }) => {
      const { data } = await apiClient.post<Project>("/projects", project);
      return data;
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
