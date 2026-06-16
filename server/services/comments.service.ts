import { supabaseAdmin } from "../db/client";
import { ForbiddenError, NotFoundError } from "../lib/errors";
import type { Comment } from "../../src/types";
import type {
  CreateCommentInput,
  UpdateCommentInput,
} from "../validators/comment.schema";

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
 * Fetch all comments (user comments + system_log entries) for a task,
 * ordered chronologically for the activity feed.
 */
export async function listByTask(taskId: string): Promise<Comment[]> {
  await findTaskOrFail(taskId);

  const { data, error } = await supabaseAdmin
    .from("comments")
    .select("*")
    .eq("task_id", taskId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Comment[];
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
