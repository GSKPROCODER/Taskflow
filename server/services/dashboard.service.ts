import { supabaseAdmin } from "../db/client";
import { AppError } from "../lib/errors";

export async function getMetrics() {
  // For MVP, we get counts of all projects and tasks, simulating an org-level dashboard.
  
  const { count: totalProjects, error: err1 } = await supabaseAdmin
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: totalTasks, error: err2 } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact", head: true });

  const { count: inProgressTasks, error: err3 } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_progress");

  const { count: testingTasks, error: err4 } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "testing");

  const { count: doneTasks, error: err5 } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "done");

  const { count: todoTasks, error: err6 } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("status", "todo");

  const { count: highPriority, error: err7 } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("priority", "high");

  const { count: mediumPriority, error: err8 } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("priority", "medium");

  const { count: lowPriority, error: err9 } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("priority", "low");

  const { count: criticalPriority, error: err10 } = await supabaseAdmin
    .from("tasks")
    .select("*", { count: "exact", head: true })
    .eq("priority", "critical");

  if (err1 || err2 || err3 || err4 || err5 || err6 || err7 || err8 || err9 || err10) {
    throw new AppError("Failed to fetch dashboard metrics", "INTERNAL_ERROR", 500);
  }

  return {
    totalProjects: totalProjects ?? 0,
    totalTasks: totalTasks ?? 0,
    todo: todoTasks ?? 0,
    inProgress: inProgressTasks ?? 0,
    testing: testingTasks ?? 0,
    done: doneTasks ?? 0,
    priority: {
      critical: criticalPriority ?? 0,
      high: highPriority ?? 0,
      medium: mediumPriority ?? 0,
      low: lowPriority ?? 0,
    }
  };
}

export async function getActivity() {
  const { data, error } = await supabaseAdmin
    .from("comments")
    .select("*, users:user_id(name), tasks:task_id(title, projects:project_id(name))")
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
