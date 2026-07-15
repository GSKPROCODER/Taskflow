import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client (PRD §5.1). Uses the public anon key — safe to ship
 * to the client. Used for auth (sign in/up) and RLS-protected reads.
 *
 * Fails fast if env vars are missing — silent placeholder fallbacks hide
 * configuration errors and produce cryptic failures at runtime.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables. " +
      "Copy .env.example to .env and fill in your Supabase project credentials.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
