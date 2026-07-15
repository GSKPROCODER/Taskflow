import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import type { Comment } from "@/types";
import type { CreateCommentInput } from "../../server/validators/comment.schema";

interface CursorResponse<T> {
  data: T[];
  nextCursor: string | null;
}

/**
 * Comments data (PRD §8.4). Calls the TaskFlow API.
 * Errors propagate to TanStack Query's error state — no silent mock fallbacks.
 * Fetches the first page only for now (limit: 100) — "load older comments"
 * infinite-scroll can consume `nextCursor` once the feed UI exists.
 */
async function fetchComments(taskId: string): Promise<Comment[]> {
  const res = await apiClient.get<CursorResponse<Comment>>(
    `/tasks/${taskId}/comments`,
    { params: { limit: 100 } },
  );
  return res.data.data;
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
      const res = await apiClient.post<Comment>(
        `/tasks/${taskId}/comments`,
        input,
      );
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments", taskId] });
    },
  });
}
