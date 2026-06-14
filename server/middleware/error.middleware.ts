import type { Context } from "hono";
import { HTTPException } from "hono/http-exception";
import { AppError } from "../lib/errors";

/**
 * Global error handler (PRD §6, §10).
 * Always returns structured JSON: { error, code } — never a raw stack trace.
 */
export function errorHandler(err: Error, c: Context) {
  console.error(err);

  if (err instanceof AppError) {
    return c.json({ error: err.message, code: err.code }, err.status);
  }

  if (err instanceof HTTPException) {
    return c.json({ error: err.message, code: "HTTP_ERROR" }, err.status);
  }

  return c.json(
    { error: "Internal Server Error", code: "INTERNAL_ERROR" },
    500,
  );
}
