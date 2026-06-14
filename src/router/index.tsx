import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "./ProtectedRoute";
import { PageLoader } from "@/components/ui/page-loader";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { ErrorPage } from "@/pages/ErrorPage";

/** Wrap a named-export page in lazy + Suspense + ErrorBoundary. */
function lazyPage(
  importFn: () => Promise<Record<string, React.ComponentType>>,
  name: string,
) {
  const Lazy = lazy(() => importFn().then((m) => ({ default: m[name]! })));
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Lazy />
      </Suspense>
    </ErrorBoundary>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: lazyPage(
      () => import("@/pages/marketing/LandingPage"),
      "LandingPage",
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: lazyPage(() => import("@/pages/auth/LoginPage"), "LoginPage"),
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: lazyPage(() => import("@/pages/auth/SignupPage"), "SignupPage"),
    errorElement: <ErrorPage />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <AppShell />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/dashboard",
            element: lazyPage(
              () => import("@/pages/dashboard/DashboardPage"),
              "DashboardPage",
            ),
          },
          {
            path: "/projects",
            element: lazyPage(
              () => import("@/pages/projects/ProjectsPage"),
              "ProjectsPage",
            ),
          },
          {
            path: "/projects/:id",
            element: lazyPage(
              () => import("@/pages/projects/ProjectDetailPage"),
              "ProjectDetailPage",
            ),
          },
          {
            path: "/tasks/:id",
            element: lazyPage(
              () => import("@/pages/tasks/TaskDetailPage"),
              "TaskDetailPage",
            ),
          },
          {
            path: "/my-tasks",
            element: lazyPage(
              () => import("@/pages/tasks/MyTasksPage"),
              "MyTasksPage",
            ),
          },
          {
            path: "/calendar",
            element: lazyPage(
              () => import("@/pages/calendar/CalendarPage"),
              "CalendarPage",
            ),
          },
          {
            path: "/notifications",
            element: lazyPage(
              () => import("@/pages/notifications/NotificationsPage"),
              "NotificationsPage",
            ),
          },
          {
            path: "/settings",
            element: lazyPage(
              () => import("@/pages/settings/SettingsPage"),
              "SettingsPage",
            ),
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: lazyPage(() => import("@/pages/NotFoundPage"), "NotFoundPage"),
    errorElement: <ErrorPage />,
  },
]);
