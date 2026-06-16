import { supabaseAdmin } from "../db/client";
import { NotFoundError } from "../lib/errors";
import type { Project } from "../../src/types";
import type {
  CreateProjectInput,
  UpdateProjectInput,
} from "../validators/project.schema";

// Project business logic (PRD §5.2, Phase 2).
// All DB access lives here — controllers stay thin.

// ── helpers ──────────────────────────────────────────────────────────────────

/** Fetch a single project by id; throw NotFoundError if absent. */
async function findOrFail(id: string): Promise<Project> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) throw new NotFoundError(`Project '${id}' not found`);
  return data as Project;
}

// ── Service methods ───────────────────────────────────────────────────────────

/**
 * List all projects visible to the authenticated user.
 * RLS (0002_rls_policies.sql) limits results to authenticated users.
 * Returns newest-first so the sidebar always shows the most recent projects.
 */
export async function list(): Promise<Project[]> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Project[];
}

/**
 * Create a new project.
 * RBAC: team_lead only (enforced by requireRole in the route).
 */
export async function create(
  input: CreateProjectInput,
  userId: string,
): Promise<Project> {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert({
      name: input.name,
      description: input.description ?? null,
      status: "active",
      created_by: userId,
    })
    .select()
    .single();

  if (error || !data)
    throw new Error(error?.message ?? "Failed to create project");
  return data as Project;
}

/**
 * Update project name / description.
 * RBAC: team_lead only.
 */
export async function update(
  id: string,
  input: UpdateProjectInput,
): Promise<Project> {
  await findOrFail(id); // 404 if project does not exist

  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({
      ...(input.name !== undefined && { name: input.name }),
      ...(input.description !== undefined && {
        description: input.description,
      }),
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !data)
    throw new Error(error?.message ?? "Failed to update project");
  return data as Project;
}

/**
 * Archive a project (soft-delete: status → 'archived').
 * RBAC: team_lead only.
 */
export async function archive(id: string): Promise<Project> {
  await findOrFail(id); // 404 guard

  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({ status: "archived" })
    .eq("id", id)
    .select()
    .single();

  if (error || !data)
    throw new Error(error?.message ?? "Failed to archive project");
  return data as Project;
}
