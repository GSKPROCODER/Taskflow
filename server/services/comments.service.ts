import { supabaseAdmin } from "../db/client";
import { ForbiddenError, NotFoundError } from "../lib/errors";
import { decodeCursor, encodeCursor } from "../lib/pagination";
import type { Comment } from "../../src/types";
import type {
  CreateCommentInput,
  UpdateCommentInput,
} from "../validators/comment.schema";

export interface CursorResult<T> {
  data: T[];
  nextCursor: string | null;
}

// Comment business logic (PRD §5.4, Phase 4).

// ── helpers ───────────────────────────────────────────────────────────────────

async function findTaskOrFail(taskId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .select("id")
    .eq("id", taskId)
    .single();

  if (error || !data) throw new NotFoundError(`Task '${taskId}' not found`);
}

async function findCommentOrFail(id: string): Promise<Comment> {
  const { data, error } = await supabaseAdmin
    .from("comments")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw new NotFoundError(`Comment '${id}' not found`);
  return data as Comment;
}

// ── Service methods ───────────────────────────────────────────────────────────

/**
 * Fetch comments (user comments + system_log entries) for a task, cursor-paginated,
 * ordered chronologically for the activity feed.
 *
 * Pass the previous page's `nextCursor` to fetch the next page. `created_at`
 * alone isn't unique (see 0005_pagination.sql), so the cursor also carries
 * `id` as a tiebreaker: WHERE (created_at, id) > (cursor.createdAt, cursor.id).
 */
export async function listByTask(
  taskId: string,
  cursor?: string,
  limit = 20,
): Promise<CursorResult<Comment>> {
  await findTaskOrFail(taskId);

  let query = supabaseAdmin
    .from("comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(limit);

  if (cursor) {
    const { createdAt, id } = decodeCursor(cursor);
    query = query.or(
      `created_at.gt.${createdAt},and(created_at.eq.${createdAt},id.gt.${id})`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const rows = (data ?? []) as Comment[];
  const last = rows[rows.length - 1];
  // Only offer a nextCursor if this page was full — a partial page means we
  // reached the end of the feed.
  const nextCursor =
    rows.length === limit && last ? encodeCursor(last) : null;

  return { data: rows, nextCursor };
}

/**
 * Post a user comment on a task.
 * type is always 'comment' — system_log entries are written only by the
 * tasks.service.updateStatus() path (not directly by users).
 */
export async function create(
  taskId: string,
  input: CreateCommentInput,
  userId: string,
): Promise<Comment> {
  await findTaskOrFail(taskId);

  const { data, error } = await supabaseAdmin
    .from("comments")
    .insert({
      task_id: taskId,
      user_id: userId,
      content: input.content,
      type: "comment", // users can only post regular comments
    })
    .select()
    .single();

  if (error || !data)
    throw new Error(error?.message ?? "Failed to create comment");
  return data as Comment;
}

/**
 * Edit an existing comment.
 * Only the original author may edit their own comment (ownership check).
 * System_log entries cannot be edited.
 */
export async function update(
  id: string,
  input: UpdateCommentInput,
  userId: string,
): Promise<Comment> {
  const comment = await findCommentOrFail(id);

  if (comment.type === "system_log") {
    throw new ForbiddenError("System log entries cannot be edited");
  }

  if (comment.user_id !== userId) {
    throw new ForbiddenError("You can only edit your own comments");
  }

  const { data, error } = await supabaseAdmin
    .from("comments")
    .update({ content: input.content })
    .eq("id", id)
    .select()
    .single();

  if (error || !data)
    throw new Error(error?.message ?? "Failed to update comment");
  return data as Comment;
}
