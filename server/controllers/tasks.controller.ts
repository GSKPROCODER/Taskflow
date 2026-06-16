import type { Context } from "hono";
import * as tasksService from "../services/tasks.service";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../validators/task.schema";
import { ValidationError } from "../lib/errors";

// Task controllers (PRD §8.3). Thin: validate → service → respond.

export const listByProject = async (c: Context) => {
  const projectId = c.req.param("id")!;
  const tasks = await tasksService.listByProject(projectId);
  return c.json(tasks);
};

export const create = async (c: Context) => {
  const user = c.get("user");
  const projectId = c.req.param("id")!;
  const body = await c.req.json();
  const result = createTaskSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }
  const task = await tasksService.create(projectId, result.data, user.id);
  return c.json(task, 201);
};

export const update = async (c: Context) => {
  const id = c.req.param("id")!;
  const body = await c.req.json();
  const result = updateTaskSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }
  const task = await tasksService.update(id, result.data);
  return c.json(task);
};

export const updateStatus = async (c: Context) => {
  const user = c.get("user");
  const id = c.req.param("id")!;
  const body = await c.req.json();
  const result = updateTaskStatusSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }
  const task = await tasksService.updateStatus(id, result.data.status, user);
  return c.json(task);
};

export const remove = async (c: Context) => {
  const id = c.req.param("id")!;
  const result = await tasksService.remove(id);
  return c.json(result);
};
