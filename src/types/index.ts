// Shared domain types (PRD §7). Mirrors the database schema.

export type UserRole = "team_lead" | "developer" | "tester";
export type ProjectStatus = "active" | "archived";
export type TaskStatus = "todo" | "in_progress" | "testing" | "done";
export type TaskPriority = "low" | "medium" | "high" | "critical";
export type CommentType = "comment" | "system_log";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  project_id: string;
  assignee_id: string | null;
  created_by: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  task_id: string;
  user_id: string;
  content: string;
  type: CommentType;
  created_at: string;
}
