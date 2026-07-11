import { supabaseAdmin } from "../db/client";
import { ForbiddenError, NotFoundError, ValidationError } from "../lib/errors";
import { toRange, type PaginatedResult } from "../lib/pagination";
import type { Task, TaskStatus, User } from "../../src/types";
import type {
  CreateTaskInput,
  UpdateTaskInput,
} from "../validators/task.schema";

// Task business logic (PRD §5.3, Phase 3).

// ── Status transition matrix ─────────────────────────────────────────────────
// Encodes every valid (from → to) transition per role per AGENTS.md §1.
// team_lead may do anything; developer progresses forward; tester approves/rejects.

const ALLOWED_TRANSITIONS: Record<
  User["role"],
  Partial<Record<TaskStatus, TaskStatus[]>>
> = {
  team_lead: {
    todo: ["in_progress"],
    in_progress: ["testing"],
    testing: ["done", "in_progress"], // team_lead can also reject
    done: [],
  },
  developer: {
    todo: ["in_progress"],
    in_progress: ["testing"],
    testing: [], // developer cannot approve or reject
    done: [],
  },
  tester: {
    todo: [],
    in_progress: [],
    testing: ["done", "in_progress"], // approve → done | reject → in_progress
    done: [],
  },
};

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: "To-do",
  in_progress: "In Progress",
  testing: "In Review",
  done: "Completed",
};

// ── helpers ───────────────────────────────────────────────────────────────────

async function findOrFail(id: string): Promise<Task> {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw new NotFoundError(`Task '${id}' not found`);
  return data as Task;
}

async function findProjectOrFail(projectId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .single();

  if (error || !data)
    throw new NotFoundError(`Project '${projectId}' not found`);
}

// ── Service methods ───────────────────────────────────────────────────────────

/** Fetch a single task by id; throw NotFoundError if absent. */
export async function getById(id: string): Promise<Task> {
  return findOrFail(id);
}

/**
 * List tasks across every project, offset-paginated.
 * Powers dashboard-wide stats (total/in-progress/testing/done counts) — the
 * one view that genuinely needs an unscoped task list rather than per-project.
 */
export async function listAll(
  page: number,
  limit: number,
): Promise<PaginatedResult<Task>> {
  const { from, to } = toRange(page, limit);

  const { data, error, count } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  return { data: (data ?? []) as Task[], total: count ?? 0, page, limit };
}

/**
 * List tasks assigned to a user across all projects, offset-paginated.
 * Powers the "My Tasks" view. Uses idx_tasks_assignee_status.
 */
export async function listByAssignee(
  userId: string,
  page: number,
  limit: number,
): Promise<PaginatedResult<Task>> {
  const { from, to } = toRange(page, limit);

  const { data, error, count } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact" })
    .eq("assignee_id", userId)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw new Error(error.message);
  return { data: (data ?? []) as Task[], total: count ?? 0, page, limit };
}

/**
 * List all tasks belonging to a project.
 * Returns tasks ordered by status then created_at for consistent Kanban display.
 */
export async function listByProject(projectId: string): Promise<Task[]> {
  await findProjectOrFail(projectId);

  const { data, error } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true })
    .limit(200); // safety ceiling — Kanban board shows all columns at once, can't page

  if (error) throw new Error(error.message);
  return (data ?? []) as Task[];
}

/**
 * Create a task inside a project.
 * RBAC: team_lead only (enforced in route).
 * New tasks always start as 'todo'.
 */
export async function create(
  projectId: string,
  input: CreateTaskInput,
  userId: string,
): Promise<Task> {
  await findProjectOrFail(projectId);

  // Validate assignee exists if provided.
  if (input.assignee_id) {
    const { data } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", input.assignee_id)
      .single();
    if (!data)
      throw new ValidationError(`Assignee '${input.assignee_id}' not found`);
  }

  const { data, error } = await supabaseAdmin
    .from("tasks")
    .insert({
      title: input.title,
      description: input.description ?? null,
      priority: input.priority,
      assignee_id: input.assignee_id ?? null,
      due_date: input.due_date ?? null,
      project_id: projectId,
      created_by: userId,
      status: "todo", // always starts at todo
    })
    .select()
    .single();

  if (error || !data)
    throw new Error(error?.message ?? "Failed to create task");
  return data as Task;
}

/**
 * Update task fields (title, description, priority, assignee, due_date).
 * Does NOT change status — use updateStatus for that.
 */
export async function update(
  id: string,
  input: UpdateTaskInput,
): Promise<Task> {
  await findOrFail(id);

  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.description !== undefined) patch.description = input.description;
  if (input.priority !== undefined) patch.priority = input.priority;
  if (input.assignee_id !== undefined) patch.assignee_id = input.assignee_id;
  if (input.due_date !== undefined) patch.due_date = input.due_date;

  const { data, error } = await supabaseAdmin
    .from("tasks")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error || !data)
    throw new Error(error?.message ?? "Failed to update task");
  return data as Task;
}

/**
 * Advance or roll back a task's status.
 *
 * Rules (AGENTS.md §1):
 *   todo → in_progress             (team_lead | developer)
 *   in_progress → testing          (team_lead | developer)
 *   testing → done                 (team_lead | tester) — approve
 *   testing → in_progress          (team_lead | tester) — reject
 *
 * On every successful transition a system_log comment is auto-inserted.
 */
export async function updateStatus(
  id: string,
  newStatus: TaskStatus,
  user: User,
): Promise<Task> {
  const task = await findOrFail(id);
  const currentStatus = task.status as TaskStatus;

  if (currentStatus === newStatus) return task; // idempotent — no-op

  // Check transition is allowed for this role.
  const allowed = ALLOWED_TRANSITIONS[user.role]?.[currentStatus] ?? [];
  if (!allowed.includes(newStatus)) {
    throw new ForbiddenError(
      `Role '${user.role}' cannot transition task from '${currentStatus}' to '${newStatus}'`,
    );
  }

  // Update the task status.
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error || !data)
    throw new Error(error?.message ?? "Failed to update task status");

  // Auto-insert a system_log comment to record the transition.
  const isReject = currentStatus === "testing" && newStatus === "in_progress";
  const logContent = isReject
    ? `Task rejected — moved back to In Progress by ${user.name}`
    : `Status changed to ${STATUS_LABELS[newStatus]} by ${user.name}`;

  await supabaseAdmin.from("comments").insert({
    task_id: id,
    user_id: user.id,
    content: logContent,
    type: "system_log",
  });

  return data as Task;
}

/**
 * Hard-delete a task and all its comments (cascade in DB).
 * RBAC: team_lead only (enforced in route).
 */
export async function remove(id: string): Promise<{ ok: true }> {
  await findOrFail(id);

  const { error } = await supabaseAdmin.from("tasks").delete().eq("id", id);

  if (error) throw new Error(error.message);
  return { ok: true };
}
