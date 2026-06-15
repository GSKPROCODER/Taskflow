import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getComments,
  createComment,
} from "../api/comments";

export function useComments(
  taskId: string
) {
  const queryClient =
    useQueryClient();

  const commentsQuery =
    useQuery({
      queryKey: [
        "comments",
        taskId,
      ],

      queryFn: () =>
        getComments(taskId),

      enabled: !!taskId,
    });

  const createMutation =
    useMutation({
      mutationFn: (
        content: string
      ) =>
        createComment(
          taskId,
          content
        ),

      onSuccess: () => {
        queryClient.invalidateQueries(
          {
            queryKey: [
              "comments",
              taskId,
            ],
          }
        );
      },
    });

  return {
    comments:
      commentsQuery.data ??
      [],

    isLoading:
      commentsQuery.isLoading,

    createComment:
      createMutation.mutate,
  };
}