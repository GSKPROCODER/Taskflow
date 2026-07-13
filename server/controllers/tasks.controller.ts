import type { Context } from "hono";
import * as tasksService from "../services/tasks.service";
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
} from "../validators/task.schema";
import { offsetPaginationSchema } from "../lib/pagination";
import { ValidationError } from "../lib/errors";

// Task controllers (PRD §8.3). Thin: validate → service → respond.

export const list = async (c: Context) => {
  const result = offsetPaginationSchema.safeParse(c.req.query());
  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Invalid pagination params",
    );
  }
  const { page, limit } = result.data;
  const tasks = await tasksService.listAll(page, limit);
  return c.json(tasks);
};

export const listByProject = async (c: Context) => {
  const projectId = c.req.param("id")!;
  const tasks = await tasksService.listByProject(projectId);
  return c.json(tasks);
};

export const getById = async (c: Context) => {
  const id = c.req.param("id")!;
  const task = await tasksService.getById(id);
  return c.json(task);
};

/** GET /tasks/mine — always scoped to the authenticated user, never a client-supplied id. */
export const listMine = async (c: Context) => {
  const user = c.get("user");
  const result = offsetPaginationSchema.safeParse(c.req.query());
  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Invalid pagination params",
    );
  }
  const { page, limit } = result.data;
  const tasks = await tasksService.listByAssignee(user.id, page, limit);
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
