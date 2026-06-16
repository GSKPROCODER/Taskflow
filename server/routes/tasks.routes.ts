import { Hono } from "hono";
import * as tasksController from "../controllers/tasks.controller";
import * as commentsController from "../controllers/comments.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/rbac.middleware";

// Task endpoints (PRD §8.3) + nested task-comments (PRD §8.4).
// All task routes require authentication.
// Status update is role-aware (transition matrix enforced in service).
// Delete is team_lead only.
const tasks = new Hono();

tasks.put("/:id", authMiddleware, tasksController.update);
tasks.patch("/:id/status", authMiddleware, tasksController.updateStatus);
tasks.delete(
  "/:id",
  authMiddleware,
  requireRole("team_lead"),
  tasksController.remove,
);

// Nested comment routes — all authenticated users can read and post comments.
tasks.get("/:id/comments", authMiddleware, commentsController.listByTask);
tasks.post("/:id/comments", authMiddleware, commentsController.create);

export default tasks;
