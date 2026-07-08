import type { Context } from "hono";
import * as tasksService from "../services/tasks.service";
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from "../validators/task.schema";
import { ValidationError } from "../lib/errors";

// Task controllers (PRD §8.3).

export const listByProject = async (c: Context) => {
  const projectId = c.req.param("id") as string;
  return c.json(await tasksService.listByProject(projectId));
};

export const getById = async (c: Context) => {
  const taskId = c.req.param("id") as string;
  return c.json(await tasksService.getById(taskId));
};

export const create = async (c: Context) => {
  const projectId = c.req.param("id") as string;
  const user = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const parsed = createTaskSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Invalid task data");
  }
  return c.json(await tasksService.create(projectId, parsed.data, user.id));
};

export const update = async (c: Context) => {
  const taskId = c.req.param("id") as string;
  const body = await c.req.json().catch(() => ({}));
  const parsed = updateTaskSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Invalid task update data");
  }
  return c.json(await tasksService.update(taskId, parsed.data));
};

export const updateStatus = async (c: Context) => {
  const taskId = c.req.param("id") as string;
  const user = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const parsed = updateTaskStatusSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Invalid task status data");
  }
  return c.json(await tasksService.updateStatus(taskId, parsed.data.status, user));
};

export const remove = async (c: Context) => {
  const taskId = c.req.param("id") as string;
  return c.json(await tasksService.remove(taskId));
};
