import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../lib/errors";
import { supabaseAdmin } from "../db/client";

/**
 * JWT auth middleware (PRD §6, §10).
 * Verifies the Supabase JWT from the Authorization header and attaches the
 * user to the context via c.set("user", user).
 */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Missing or invalid Authorization header");
  }

  const token = authHeader.substring("Bearer ".length);
  const secret = process.env.SUPABASE_JWT_SECRET;
  
  if (!secret) {
    throw new Error("Missing SUPABASE_JWT_SECRET");
  }

  try {
    const decoded = jwt.verify(token, secret) as { sub: string };
    
    // Fetch the user's role and details from public.users
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", decoded.sub)
      .single();

    if (error || !user) {
      throw new UnauthorizedError("User not found");
    }

    c.set("user", user);
    await next();
  } catch {
    throw new UnauthorizedError("Invalid or expired token");
  }
}
