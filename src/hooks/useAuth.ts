import { useAuthStore } from "@/store/auth.store";

// Auth hook (PRD §9). Exposes the current session; sign-in/up wired in Phase 1.
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  return { user, isAuthenticated: user !== null };
}
