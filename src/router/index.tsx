import { createBrowserRouter, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "@/pages/auth/LoginPage";
import { SignupPage } from "@/pages/auth/SignupPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { ProjectsPage } from "@/pages/projects/ProjectsPage";
import { ProjectDetailPage } from "@/pages/projects/ProjectDetailPage";
import { TaskDetailPage } from "@/pages/tasks/TaskDetailPage";

// Route table (PRD §9).
export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/projects/:id", element: <ProjectDetailPage /> },
      { path: "/tasks/:id", element: <TaskDetailPage /> },
    ],
  },
]);
