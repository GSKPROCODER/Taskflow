import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { commentsByTask } from "@/lib/mock-data";
import type { Comment } from "@/types";

interface CursorResponse<T> {
  data: T[];
  nextCursor: string | null;
}

/**
 * Comments data (PRD §8.4). Calls the TaskFlow API; falls back to demo data
 * if the request fails (e.g. no backend running yet in local dev).
 * Fetches the first page only for now (limit: 100) — "load older comments"
 * infinite-scroll can consume `nextCursor` once the feed UI exists.
 */
async function fetchComments(taskId: string): Promise<Comment[]> {
  try {
    const res = await apiClient.get<CursorResponse<Comment>>(
      `/tasks/${taskId}/comments`,
      { params: { limit: 100 } },
    );
    return res.data.data.length ? res.data.data : commentsByTask(taskId);
  } catch {
    return commentsByTask(taskId);
  }
}

export function useComments(taskId: string | undefined) {
  const q = useQuery({
    queryKey: ["comments", taskId],
    queryFn: () => fetchComments(taskId!),
    enabled: !!taskId,
  });
  return {
    data: q.data ?? (taskId ? commentsByTask(taskId) : []),
    isLoading: q.isLoading,
  } as const;
}
