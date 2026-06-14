import { z } from "zod";

// Task request schemas (PRD §8.3).

export const taskStatus = z.enum(["todo", "in_progress", "testing", "done"]);
export const taskPriority = z.enum(["low", "medium", "high", "critical"]);

export const createTaskSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().optional(),
  priority: taskPriority.default("medium"),
  assignee_id: z.string().uuid().optional(),
  due_date: z.string().date().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const updateTaskStatusSchema = z.object({
  status: taskStatus,
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;
