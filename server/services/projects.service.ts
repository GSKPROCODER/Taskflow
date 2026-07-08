import { supabaseAdmin } from "../db/client";
import { AppError, NotFoundError } from "../lib/errors";
import type { CreateProjectInput, UpdateProjectInput } from "../validators/project.schema";

// Project business logic (PRD §5.2). Implemented in Phase 2.

export async function list() {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    throw new AppError("Failed to fetch projects", "INTERNAL_ERROR", 500);
  }
  return data;
}

export async function create(input: CreateProjectInput, userId: string) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({
      name: input.name,
      description: input.description,
      created_by: userId,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    throw new AppError("Failed to create project", "INTERNAL_ERROR", 500);
  }
  return data;
}

export async function update(id: string, input: UpdateProjectInput) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new NotFoundError("Project not found");
    throw new AppError("Failed to update project", "INTERNAL_ERROR", 500);
  }
  return data;
}

export async function archive(id: string) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({
      status: "archived",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new NotFoundError("Project not found");
    throw new AppError("Failed to archive project", "INTERNAL_ERROR", 500);
  }
  return data;
}
