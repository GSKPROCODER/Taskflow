import type { Context } from "hono";
import * as authService from "../services/auth.service";
import { signupSchema, loginSchema } from "../validators/auth.schema";
import { ValidationError } from "../lib/errors";

// Auth controllers (PRD §8.1). Thin: validate → service → respond.

export const signup = async (c: Context) => {
  const body = await c.req.json();
  const result = signupSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }
  const user = await authService.signup(result.data);
  return c.json(user, 201);
};

export const login = async (c: Context) => {
  const body = await c.req.json();
  const result = loginSchema.safeParse(body);
  if (!result.success) {
    throw new ValidationError(
      result.error.issues[0]?.message ?? "Validation failed",
    );
  }
  const payload = await authService.login(result.data);
  return c.json(payload);
};

export const logout = async (c: Context) => {
  const user = c.get("user");
  const result = await authService.logout(user.id);
  return c.json(result);
};

/**
 * GET /auth/me
 * Returns the canonical public.users row for the authenticated caller.
 * Useful to pick up role changes made outside the current JWT payload.
 */
export const me = async (c: Context) => {
  const user = c.get("user");
  const profile = await authService.getCurrentUser(user.id);
  return c.json(profile);
};
