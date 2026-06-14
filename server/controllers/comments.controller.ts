import type { Context } from "hono";
import * as commentsService from "../services/comments.service";

// Comment controllers (PRD §8.4).

export const listByTask = async (c: Context) =>
  c.json(await commentsService.listByTask());
export const create = async (c: Context) =>
  c.json(await commentsService.create());
export const update = async (c: Context) =>
  c.json(await commentsService.update());
