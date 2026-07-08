import { supabaseAdmin } from "../db/client";
import { AppError, NotFoundError, ForbiddenError } from "../lib/errors";
import type { CreateTaskInput, UpdateTaskInput } from "../validators/task.schema";

// Task business logic (PRD §5.3). Implemented in Phase 3.

export async function listByProject(projectId: string) {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) throw new AppError("Failed to fetch tasks", "INTERNAL_ERROR", 500);
  return data;
}

export async function create(projectId: string, input: CreateTaskInput, userId: string) {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .insert({
      ...input,
      project_id: projectId,
      created_by: userId,
      status: "todo",
    })
    .select()
    .single();

  if (error) throw new AppError("Failed to create task", "INTERNAL_ERROR", 500);
  return data;
}

export async function update(taskId: string, input: UpdateTaskInput) {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new NotFoundError("Task not found");
    throw new AppError("Failed to update task", "INTERNAL_ERROR", 500);
  }
  return data;
}

export async function updateStatus(taskId: string, status: string, user: { id: string, role: string }) {
  // First fetch current task
  const { data: currentTask, error: fetchError } = await supabaseAdmin
    .from("tasks")
    .select("status")
    .eq("id", taskId)
    .single();

  if (fetchError || !currentTask) {
    throw new NotFoundError("Task not found");
  }

  // Tester rejection rule
  if (user.role === "tester" && currentTask.status === "testing" && status !== "done" && status !== "in_progress") {
    throw new ForbiddenError("Testers can only approve (done) or reject (in_progress) testing tasks");
  }

  if (currentTask.status === status) {
    return { success: true }; // No change
  }

  const { data, error } = await supabaseAdmin
    .from("tasks")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .select()
    .single();

  if (error) {
    throw new AppError("Failed to update task status", "INTERNAL_ERROR", 500);
  }

  // Auto-record system log
  await supabaseAdmin.from("comments").insert({
    task_id: taskId,
    user_id: user.id,
    content: `Status changed from ${currentTask.status} to ${status}`,
    type: "system_log",
  });

  return data;
}

export async function remove(taskId: string) {
  const { error } = await supabaseAdmin
    .from("tasks")
    .delete()
    .eq("id", taskId);

  if (error) throw new AppError("Failed to delete task", "INTERNAL_ERROR", 500);
  return { success: true };
}
