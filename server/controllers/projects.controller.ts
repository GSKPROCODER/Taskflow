import type { Context } from "hono";
import * as projectsService from "../services/projects.service";

// Project controllers (PRD §8.2).

export const list = async (c: Context) => c.json(await projectsService.list());
export const create = async (c: Context) =>
  c.json(await projectsService.create());
export const update = async (c: Context) =>
  c.json(await projectsService.update());
export const archive = async (c: Context) =>
  c.json(await projectsService.archive());
