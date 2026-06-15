<<<<<<< HEAD
import { Outlet } from "react-router-dom";

/**
 * Guards authenticated routes (PRD §9, FR-AUTH-05).
 * TODO: read auth state (Zustand/Supabase session); redirect to /login when
 * unauthenticated. Currently renders children unconditionally.
 */
export function ProtectedRoute() {
  return <Outlet />;
}
=======
import { Navigate } from "react-router-dom";
import { ReactNode } from "react";

import { useAuthStore } from "../store/authStore";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const token = useAuthStore(
    (state) => state.token
  );

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <>{children}</>;
}
>>>>>>> faiz
