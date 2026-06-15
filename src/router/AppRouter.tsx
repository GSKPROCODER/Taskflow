import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import ProtectedRoute from "./ProtectedRoute";

import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";

import DashboardPage from "../pages/dashboard/DashboardPage";

import ProjectsPage from "../pages/projects/ProjectsPage";
import ProjectDetailPage from "../pages/projects/ProjectDetailPage";

import TaskDetailPage from "../pages/tasks/TaskDetailPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        {/* Protected */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <ProjectsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/projects/:id"
          element={
            <ProtectedRoute>
              <ProjectDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tasks/:id"
          element={
            <ProtectedRoute>
              <TaskDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Default */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}