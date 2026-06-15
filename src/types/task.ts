export type TaskStatus =
  | "todo"
  | "in_progress"
  | "testing"
  | "done";

export type TaskPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string;
  assigneeId?: string;
  dueDate?: string;
  createdAt: string;
}