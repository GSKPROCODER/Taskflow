import { createClient } from "@supabase/supabase-js";

/**
 * Server-side Supabase client singleton (PRD §10).
 * Uses the service-role key — NEVER expose this to the browser.
 * Env vars are configured in Vercel project settings (see .env.example).
 */
const supabaseUrl = process.env.SUPABASE_URL;
// Accept either the canonical name or the lowercase `service_role_key` variant.
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.service_role_key;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});
