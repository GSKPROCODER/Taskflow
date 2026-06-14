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

const LandingPage = () =>
  lazyPage(() => import("@/pages/marketing/LandingPage"), "LandingPage");
const LoginPage = () =>
  lazyPage(() => import("@/pages/auth/LoginPage"), "LoginPage");
const SignupPage = () =>
  lazyPage(() => import("@/pages/auth/SignupPage"), "SignupPage");
const DashboardPage = () =>
  lazyPage(() => import("@/pages/dashboard/DashboardPage"), "DashboardPage");
const ProjectsPage = () =>
  lazyPage(() => import("@/pages/projects/ProjectsPage"), "ProjectsPage");
const ProjectDetailPage = () =>
  lazyPage(
    () => import("@/pages/projects/ProjectDetailPage"),
    "ProjectDetailPage",
  );
const TaskDetailPage = () =>
  lazyPage(() => import("@/pages/tasks/TaskDetailPage"), "TaskDetailPage");
const MyTasksPage = () =>
  lazyPage(() => import("@/pages/tasks/MyTasksPage"), "MyTasksPage");
const CalendarPage = () =>
  lazyPage(() => import("@/pages/calendar/CalendarPage"), "CalendarPage");
const NotificationsPage = () =>
  lazyPage(
    () => import("@/pages/notifications/NotificationsPage"),
    "NotificationsPage",
  );
const SettingsPage = () =>
  lazyPage(() => import("@/pages/settings/SettingsPage"), "SettingsPage");
const NotFoundPage = () =>
  lazyPage(() => import("@/pages/NotFoundPage"), "NotFoundPage");

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
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
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/projects", element: <ProjectsPage /> },
          { path: "/projects/:id", element: <ProjectDetailPage /> },
          { path: "/tasks/:id", element: <TaskDetailPage /> },
          { path: "/my-tasks", element: <MyTasksPage /> },
          { path: "/calendar", element: <CalendarPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
    errorElement: <ErrorPage />,
  },
]);
