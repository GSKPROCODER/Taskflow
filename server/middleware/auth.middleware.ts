import type { Context, Next } from "hono";

/**
 * JWT auth middleware (PRD §6, §10).
 * TODO: verify the Supabase JWT from the Authorization header and attach the
 * user to the context via c.set("user", user). Throw UnauthorizedError if invalid.
 *
 * Applied to all /api/v1/* routes except /auth/login and /auth/signup.
 */
export async function authMiddleware(c: Context, next: Next) {
  await next();
}
