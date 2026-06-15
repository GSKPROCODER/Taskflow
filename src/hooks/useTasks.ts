import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getProjectTasks,
  updateTaskStatus,
} from "../api/tasks";

import { TaskStatus } from "../types/task";

export function useTasks(
  projectId: string
) {
  const queryClient =
    useQueryClient();

  const tasksQuery =
    useQuery({
      queryKey: [
        "tasks",
        projectId,
      ],

      queryFn: () =>
        getProjectTasks(
          projectId
        ),

      enabled:
        !!projectId,
    });

  const updateMutation =
    useMutation({
      mutationFn: ({
        taskId,
        status,
      }: {
        taskId: string;
        status: TaskStatus;
      }) =>
        updateTaskStatus(
          taskId,
          status
        ),

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "tasks",
              projectId,
            ],
          }
        );
      },
    });

  return {
    tasks:
      tasksQuery.data ??
      [],

    isLoading:
      tasksQuery.isLoading,

    updateTaskStatus:
      updateMutation.mutate,
  };
}