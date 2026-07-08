import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { Comment } from "@/types";
import type { CreateCommentInput } from "../../server/validators/comment.schema";

/**
 * Comments data (PRD §8.4). Connects to the Hono backend.
 */
async function fetchComments(taskId: string): Promise<Comment[]> {
  const res = await apiClient.get<Comment[]>(`/tasks/${taskId}/comments`);
  return res.data;
}

export function useComments(taskId: string | undefined) {
  const q = useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => fetchComments(taskId!),
    enabled: !!taskId,
  });
  return {
    data: q.data ?? [],
    isLoading: q.isLoading,
  } as const;
}

export function useCreateComment(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateCommentInput) => {
      const res = await apiClient.post<Comment>(`/tasks/${taskId}/comments`, input);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}
