import { createClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client (PRD §5.1). Uses the public anon key — safe to ship
 * to the client. Used for auth (sign in/up) and RLS-protected reads.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY environment variables.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
