import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { commentsByTask } from "@/lib/mock-data";
import type { Comment } from "@/types";

/**
 * Comments data (PRD §8.4). Queries Supabase; falls back to demo data when
 * empty or RLS-blocked.
 */
async function fetchComments(taskId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });
  if (error || !data || data.length === 0) return commentsByTask(taskId);
  return data as Comment[];
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
