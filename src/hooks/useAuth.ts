import { useAuthStore } from "@/store/auth.store";
import { signOut as supabaseSignOut } from "@/lib/auth";

// Auth hook (PRD §9). Backed by real Supabase Auth (see auth.store).
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  return {
    user,
    status,
    isAuthenticated: status === "authed",
    isLoading: status === "loading",
    signOut: supabaseSignOut,
  };
}
