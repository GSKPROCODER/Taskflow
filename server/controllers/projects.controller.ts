import type { Context } from "hono";
import * as projectsService from "../services/projects.service";
import {
  createProjectSchema,
  updateProjectSchema,
} from "../validators/project.schema";
import { offsetPaginationSchema } from "../lib/pagination";
import { ValidationError } from "../lib/errors";

// Project controllers (PRD §8.2). Thin: validate → service → respond.

export const list = async (c: Context) => {
  const result = offsetPaginationSchema.safeParse(c.req.query());
  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Invalid pagination params",
    );
  }
  const { page, limit } = result.data;
  const projects = await projectsService.list(page, limit);
  return c.json(projects);
};

export const create = async (c: Context) => {
  const user = c.get("user");
  const body = await c.req.json();
  const result = createProjectSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }
  const project = await projectsService.create(result.data, user.id);
  return c.json(project, 201);
};

export const update = async (c: Context) => {
  const id = c.req.param("id")!;
  const body = await c.req.json();
  const result = updateProjectSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }
  const project = await projectsService.update(id, result.data);
  return c.json(project);
};

export const archive = async (c: Context) => {
  const id = c.req.param("id")!;
  const project = await projectsService.archive(id);
  return c.json(project);
};
