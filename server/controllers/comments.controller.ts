import type { Context } from "hono";
import * as commentsService from "../services/comments.service";
import {
  createCommentSchema,
  updateCommentSchema,
} from "../validators/comment.schema";
import { ValidationError } from "../lib/errors";

// Comment controllers (PRD §8.4). Thin: validate → service → respond.

export const listByTask = async (c: Context) => {
  const taskId = c.req.param("id")!;
  const comments = await commentsService.listByTask(taskId);
  return c.json(comments);
};

export const create = async (c: Context) => {
  const user = c.get("user");
  const taskId = c.req.param("id")!;
  const body = await c.req.json();
  const result = createCommentSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }
  const comment = await commentsService.create(taskId, result.data, user.id);
  return c.json(comment, 201);
};

export const update = async (c: Context) => {
  const user = c.get("user");
  const id = c.req.param("id")!;
  const body = await c.req.json();
  const result = updateCommentSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }
  const comment = await commentsService.update(id, result.data, user.id);
  return c.json(comment);
};
