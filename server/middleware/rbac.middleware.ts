import type { Context, Next } from "hono";

export type Role = "team_lead" | "developer" | "tester";

/**
 * Role-based access control (PRD §6, §10).
 * TODO: read c.get("user").role and throw ForbiddenError if not in allowedRoles.
 *
 * Usage: app.post("/projects", requireRole("team_lead"), createProject)
 */
export function requireRole(...allowedRoles: Role[]) {
  return async (c: Context, next: Next) => {
    void allowedRoles;
    await next();
  };
}
