import { supabaseAdmin } from "../db/client";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../lib/errors";
import type { User, UserRole } from "../../src/types";
import type { SignupInput, LoginInput } from "../validators/auth.schema";

// ── helpers ──────────────────────────────────────────────────────────────────

/** Map a raw Supabase auth.users row to the app User shape. */
function mapSupabaseUser(su: {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  created_at?: string;
}): User {
  const meta = su.user_metadata ?? {};
  return {
    id: su.id,
    email: su.email ?? "",
    name: (meta.name as string) ?? su.email?.split("@")[0] ?? "User",
    role: ((meta.role as UserRole) ?? "developer") as UserRole,
    created_at: su.created_at ?? "",
    updated_at: su.created_at ?? "",
  };
}

// ── Auth business logic (PRD §5.1) ───────────────────────────────────────────

/**
 * Server-side sign-up.  The browser client calls supabase.auth.signUp() directly
 * (see src/lib/auth.ts), so this endpoint is available for non-browser callers
 * or server-side tests.
 *
 * Returns the new user profile.  If the email already exists Supabase surfaces
 * a descriptive error that we surface as a ValidationError (400).
 */
export async function signup(input: SignupInput): Promise<User> {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true, // skip email confirmation in the API path
    user_metadata: {
      name: input.name,
      role: "developer", // new sign-ups are always developers
    },
  });

  if (error) {
    // Supabase returns "Email address already registered" for duplicates.
    throw new ValidationError(error.message);
  }

  return mapSupabaseUser(data.user);
}

/**
 * Server-side sign-in.  Returns the access + refresh tokens so non-browser
 * callers can authenticate.  Browser callers use supabase.auth.signInWithPassword()
 * directly via the anon client.
 */
export async function login(input: LoginInput): Promise<{
  user: User;
  access_token: string;
  refresh_token: string;
}> {
  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  });

  if (error || !data.session) {
    throw new UnauthorizedError("Invalid email or password");
  }

  return {
    user: mapSupabaseUser(data.user),
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  };
}

/**
 * Server-side sign-out — invalidates the session on the Supabase side.
 * Requires the caller to pass their JWT (used in authMiddleware) so we
 * know which session to revoke.
 */
export async function logout(userId: string): Promise<{ ok: true }> {
  // Sign the user out of ALL sessions (safest default for a web app).
  const { error } = await supabaseAdmin.auth.admin.signOut(userId);
  if (error) {
    // Non-fatal: session may have already expired.  Log and continue.
    console.warn("logout: signOut error", error.message);
  }
  return { ok: true };
}

/**
 * Returns the full public.users row for the authenticated caller.
 * The authMiddleware already provides the mapped user from the JWT; this
 * service re-fetches from public.users to get the canonical DB values
 * (including any role changes made by an admin).
 */
export async function getCurrentUser(userId: string): Promise<User> {
  const { data, error } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new NotFoundError("User profile not found");
  }

  return data as User;
}
