import { create } from "zustand";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User, UserRole } from "@/types";

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

// Hydrate the session on load and keep it in sync with Supabase Auth.
// Mock bypass: Instantly resolve to anon so the UI loads without Supabase keys
useAuthStore.getState().setUser(null);
