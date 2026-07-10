import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { ProtectedRoute } from "./ProtectedRoute";
import { LandingPage } from "@/pages/marketing/LandingPage";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ProjectsPage } from "@/pages/projects/ProjectsPage";
import { ProjectDetailPage } from "@/pages/projects/ProjectDetailPage";
import { TaskDetailPage } from "@/pages/tasks/TaskDetailPage";
import { MyTasksPage } from "@/pages/tasks/MyTasksPage";
import { CalendarPage } from "@/pages/calendar/CalendarPage";
import { NotificationsPage } from "@/pages/notifications/NotificationsPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { TeamPage } from "@/pages/team/TeamPage";
import { ReportsPage } from "@/pages/reports/ReportsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { JiraSyncPage } from "@/pages/jira/JiraSyncPage";
import { SlackFeedPage } from "@/pages/slack/SlackFeedPage";

// Route table (PRD §9). Public marketing + auth; app routes nested in AppShell.
export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppShell />,
        children: [
          { path: "/dashboard", element: <DashboardPage /> },
          { path: "/projects", element: <ProjectsPage /> },
          { path: "/projects/:id", element: <ProjectDetailPage /> },
          { path: "/tasks/:id", element: <TaskDetailPage /> },
          { path: "/my-tasks", element: <MyTasksPage /> },
          { path: "/calendar", element: <CalendarPage /> },
          { path: "/team", element: <TeamPage /> },
          { path: "/reports", element: <ReportsPage /> },
          { path: "/jira-sync", element: <JiraSyncPage /> },
          { path: "/slack-feed", element: <SlackFeedPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
