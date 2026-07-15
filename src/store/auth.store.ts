import { create } from "zustand";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User, UserRole } from "@/types";
import { supabase } from "@/lib/supabase";

type Status = "loading" | "authed" | "anon";

interface AuthState {
  user: User | null;
  status: Status;
  setUser: (user: User | null) => void;
}

/** Map a Supabase auth user to our app User (role/name from user_metadata). */
export function mapUser(u: SupabaseUser): User {
  const meta = u.user_metadata ?? {};
  return {
    id: u.id,
    email: u.email ?? "",
    name: (meta.name as string) ?? u.email?.split("@")[0] ?? "User",
    role: (meta.role as UserRole) ?? "developer",
    created_at: u.created_at ?? "",
    updated_at: u.created_at ?? "",
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  status: "loading",
  setUser: (user) => set({ user, status: user ? "authed" : "anon" }),
}));

/**
 * Hydrate the session on load and keep it in sync with Supabase Auth.
 *
 * 1. getSession() restores sessions from localStorage / URL hash (OAuth callback).
 * 2. onAuthStateChange() keeps the store in sync with sign-in, sign-out,
 *    token refresh, and password recovery events.
 */
async function hydrateAuth() {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      useAuthStore.getState().setUser(mapUser(session.user));
    } else {
      useAuthStore.getState().setUser(null);
    }
  } catch (err) {
    // If Supabase is unreachable (e.g. placeholder keys), resolve to anon.
    console.error("Failed to hydrate Supabase auth session:", err);
    useAuthStore.getState().setUser(null);
  }
}

// Subscribe to auth state changes (sign in, sign out, token refresh).
supabase.auth.onAuthStateChange((_event, session) => {
  if (session?.user) {
    useAuthStore.getState().setUser(mapUser(session.user));
  } else {
    useAuthStore.getState().setUser(null);
  }
});

// Kick off initial hydration.
hydrateAuth();
