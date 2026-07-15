import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { Project } from "@/types";

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Projects data (PRD §8.2). Calls the TaskFlow API.
 * Errors propagate to TanStack Query's error state — no silent mock fallbacks.
 * limit: 100 keeps this a flat list for now — no pager UI exists yet.
 */
async function fetchProjects(): Promise<Project[]> {
  const res = await apiClient.get<PaginatedResponse<Project>>("/projects", {
    params: { page: 1, limit: 100 },
  });
  return res.data.data;
}

export function useProjects() {
  const q = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  return { data: q.data ?? [], isLoading: q.isLoading, error: q.error } as const;
}

export function useProject(id: string | undefined) {
  const q = useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await apiClient.get<Project>(`/projects/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
  return {
    data: q.data,
    isLoading: q.isLoading,
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
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: { name?: string; description?: string };
    }) => {
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
      const { data } = await apiClient.patch<Project>(
        `/projects/${id}/archive`,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}
