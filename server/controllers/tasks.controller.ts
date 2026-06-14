import type { Context } from "hono";
import * as tasksService from "../services/tasks.service";

// Task controllers (PRD §8.3).

export const listByProject = async (c: Context) =>
  c.json(await tasksService.listByProject());
export const create = async (c: Context) => c.json(await tasksService.create());
export const update = async (c: Context) => c.json(await tasksService.update());
export const updateStatus = async (c: Context) =>
  c.json(await tasksService.updateStatus());
export const remove = async (c: Context) => c.json(await tasksService.remove());
