import type { Context, Next } from "hono";
import { supabaseAdmin } from "../db/client";
import { UnauthorizedError } from "../lib/errors";
import type { User, UserRole } from "../../src/types";

/**
 * JWT auth middleware (PRD §6, §10).
 * Reads `Authorization: Bearer <supabase-jwt>`, verifies it against Supabase,
 * and sets `c.var.user` (typed User) for downstream handlers.
 *
 * Applied to every route except POST /auth/signup, POST /auth/login, GET /health.
 */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or malformed Authorization header");
  }

  const token = authHeader.slice(7); // strip "Bearer "

  // Verify the Supabase JWT — getUser() validates signature + expiry server-side.
  const {
    data: { user: supabaseUser },
    error,
  } = await supabaseAdmin.auth.getUser(token);

  if (error || !supabaseUser) {
    throw new UnauthorizedError("Invalid or expired token");
  }

  // Map Supabase auth user to our app User shape (same logic as auth.store.ts).
  const meta = supabaseUser.user_metadata ?? {};
  const user: User = {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name: (meta.name as string) ?? supabaseUser.email?.split("@")[0] ?? "User",
    role: ((meta.role as UserRole) ?? "developer") as UserRole,
    created_at: supabaseUser.created_at ?? "",
    updated_at: supabaseUser.created_at ?? "",
  };

  // Make the verified user available to every subsequent handler.
  c.set("user", user);
  await next();
}
