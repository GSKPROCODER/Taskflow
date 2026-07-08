import type { Context } from "hono";
import * as projectsService from "../services/projects.service";
import { createProjectSchema, updateProjectSchema } from "../validators/project.schema";
import { ValidationError } from "../lib/errors";

// Project controllers (PRD §8.2).

export const list = async (c: Context) => c.json(await projectsService.list());

export const create = async (c: Context) => {
  const user = c.get("user");
  const body = await c.req.json().catch(() => ({}));
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Invalid project data");
  }
  return c.json(await projectsService.create(parsed.data, user.id));
};

export const update = async (c: Context) => {
  const id = c.req.param("id") as string;
  const body = await c.req.json().catch(() => ({}));
  const parsed = updateProjectSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Invalid project update data");
  }
  return c.json(await projectsService.update(id, parsed.data));
};

export const archive = async (c: Context) => {
  const id = c.req.param("id") as string;
  return c.json(await projectsService.archive(id));
};
