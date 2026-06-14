import { Outlet } from "react-router-dom";

/**
 * Guards authenticated routes (PRD §9, FR-AUTH-05).
 * TODO: read auth state (Zustand/Supabase session); redirect to /login when
 * unauthenticated. Currently renders children unconditionally.
 */
export function ProtectedRoute() {
  return <Outlet />;
}
