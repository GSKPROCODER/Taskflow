import type { Context, Next } from "hono";
import { ForbiddenError, UnauthorizedError } from "../lib/errors";

export type Role = "team_lead" | "developer" | "tester";

/**
 * Role-based access control (PRD §6, §10).
 * Must run AFTER authMiddleware (which sets c.var.user).
 *
 * Usage:
 *   app.post("/projects", authMiddleware, requireRole("team_lead"), createProject)
 *
 * Throws:
 *   UnauthorizedError (401) — no user on context (authMiddleware skipped)
 *   ForbiddenError    (403) — user role not in allowedRoles
 */
export function requireRole(...allowedRoles: Role[]) {
  return async (c: Context, next: Next) => {
    const user = c.get("user");

    if (!user) {
      // authMiddleware should always run first, but guard defensively.
      throw new UnauthorizedError();
    }

    if (!allowedRoles.includes(user.role as Role)) {
      throw new ForbiddenError(
        `Role '${user.role}' is not permitted. Required: ${allowedRoles.join(" | ")}`,
      );
    }

    await next();
  };
}
