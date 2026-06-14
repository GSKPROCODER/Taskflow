import { Hono } from "hono";
import * as projectsController from "../controllers/projects.controller";
import * as tasksController from "../controllers/tasks.controller";

// Project endpoints (PRD §8.2) + nested project-tasks (PRD §8.3).
const projects = new Hono();

projects.get("/", projectsController.list);
projects.post("/", projectsController.create);
projects.put("/:id", projectsController.update);
projects.patch("/:id/archive", projectsController.archive);

projects.get("/:id/tasks", tasksController.listByProject);
projects.post("/:id/tasks", tasksController.create);

export default projects;
