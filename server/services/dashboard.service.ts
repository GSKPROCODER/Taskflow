import { supabaseAdmin } from "../db/client";
import { AppError } from "../lib/errors";

export async function getMetrics() {
  // Use Promise.all to fetch all dashboard metric counts concurrently
  // instead of creating a massive waterfall latency.

  const queries = [
    supabaseAdmin.from("projects").select("*", { count: "exact", head: true }),
    supabaseAdmin.from("tasks").select("*", { count: "exact", head: true }),
    supabaseAdmin
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_progress"),
    supabaseAdmin
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "testing"),
    supabaseAdmin
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "done"),
    supabaseAdmin
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("status", "todo"),
    supabaseAdmin
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("priority", "high"),
    supabaseAdmin
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("priority", "medium"),
    supabaseAdmin
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("priority", "low"),
    supabaseAdmin
      .from("tasks")
      .select("*", { count: "exact", head: true })
      .eq("priority", "critical"),
  ];

  const results = await Promise.all(queries);

  // Check if any query failed
  if (results.some((res) => res.error)) {
    throw new AppError(
      "Failed to fetch dashboard metrics",
      "INTERNAL_ERROR",
      500,
    );
  }

  return {
    totalProjects: results[0]?.count ?? 0,
    totalTasks: results[1]?.count ?? 0,
    inProgress: results[2]?.count ?? 0,
    testing: results[3]?.count ?? 0,
    done: results[4]?.count ?? 0,
    todo: results[5]?.count ?? 0,
    priority: {
      high: results[6]?.count ?? 0,
      medium: results[7]?.count ?? 0,
      low: results[8]?.count ?? 0,
      critical: results[9]?.count ?? 0,
    },
  };
}

export async function getActivity() {
  const { data, error } = await supabaseAdmin
    .from("comments")
    .select(
      "*, users:user_id(name), tasks:task_id(title, projects:project_id(name))",
    )
    .eq("type", "system_log")
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) {
    throw new AppError("Failed to fetch activity", "INTERNAL_ERROR", 500);
  }

  type LogResult = {
    id: string;
    content: string;
    created_at: string;
    users: { name: string } | null;
    tasks: { title: string; projects: { name: string } | null } | null;
  };

  return data.map((log: unknown) => {
    const l = log as LogResult;
    return {
      id: l.id,
      actor: l.users?.name ?? "System",
      action: l.content,
      target: `${l.tasks?.title} (${l.tasks?.projects?.name ?? "Unknown"})`,
      created_at: l.created_at,
    };
  });
}

export async function getMyTasks(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("tasks")
    .select("*, projects:project_id(name)")
    .eq("assignee_id", userId)
    .order("due_date", { ascending: true });

  if (error) {
    throw new AppError("Failed to fetch user tasks", "INTERNAL_ERROR", 500);
  }

  return data;
}
