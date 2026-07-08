import type { Context, Next } from "hono";
import { ForbiddenError } from "../lib/errors";

export type Role = "team_lead" | "developer" | "tester";

/**
 * Role-based access control (PRD §6, §10).
 * Reads c.get("user").role and throws ForbiddenError if not in allowedRoles.
 *
 * Usage: app.post("/projects", requireRole("team_lead"), createProject)
 */
export function requireRole(...allowedRoles: Role[]) {
  return async (c: Context, next: Next) => {
    const user = c.get("user");
    if (!user || !allowedRoles.includes(user.role as Role)) {
      throw new ForbiddenError(`Requires one of roles: ${allowedRoles.join(", ")}`);
    }
    await next();
  };
}
