<<<<<<< HEAD
// Projects data hook (PRD §9). Implemented with TanStack Query in Phase 2.
export function useProjects() {
  return { data: undefined, isLoading: false } as const;
}
=======
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProjects,
  createProject,
} from "../api/projects";

export function useProjects() {
  const queryClient =
    useQueryClient();

  const projectsQuery =
    useQuery({
      queryKey: ["projects"],
      queryFn: getProjects,
    });

  const createMutation =
    useMutation({
      mutationFn:
        createProject,

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "projects",
            ],
          }
        );
      },
    });

  return {
    projects:
      projectsQuery.data ??
      [],

    isLoading:
      projectsQuery.isLoading,

    createProject:
      createMutation.mutate,

    creating:
      createMutation.isPending,
  };
}
>>>>>>> faiz
