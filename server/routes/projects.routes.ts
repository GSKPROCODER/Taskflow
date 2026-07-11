import { Hono } from "hono";
import * as projectsController from "../controllers/projects.controller";
import * as tasksController from "../controllers/tasks.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";

// Project endpoints (PRD §8.2) + nested project-tasks (PRD §8.3).
// All project routes require authentication; mutations require team_lead.
const projects = new Hono();

projects.get("/", authMiddleware, projectsController.list);
projects.post(
  "/",
  authMiddleware,
  requireRole("team_lead"),
  projectsController.create,
);
projects.put(
  "/:id",
  authMiddleware,
  requireRole("team_lead"),
  projectsController.update,
);
projects.patch(
  "/:id/archive",
  authMiddleware,
  requireRole("team_lead"),
  projectsController.archive,
);

// Nested task routes — auth only (task creation is team_lead-gated in the task route)
projects.get("/:id/tasks", authMiddleware, tasksController.listByProject);
projects.post(
  "/:id/tasks",
  authMiddleware,
  requireRole("team_lead"),
  tasksController.create,
);

export default projects;
