import { Hono } from "hono";
import * as projectsController from "../controllers/projects.controller";
import * as tasksController from "../controllers/tasks.controller";
import { requireRole } from "../middleware/rbac.middleware";

// Project endpoints (PRD §8.2) + nested project-tasks (PRD §8.3).
const projects = new Hono();

projects.get("/", projectsController.list);
projects.post("/", requireRole("team_lead"), projectsController.create);
projects.put("/:id", requireRole("team_lead"), projectsController.update);
projects.patch("/:id/archive", requireRole("team_lead"), projectsController.archive);

projects.get("/:id/tasks", tasksController.listByProject);
// Assuming team_lead creates tasks for now, as per PRD §8.3 POST /projects/:id/tasks (team_lead)
projects.post("/:id/tasks", requireRole("team_lead"), tasksController.create);

export default projects;
