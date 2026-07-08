import { Hono } from "hono";
import * as tasksController from "../controllers/tasks.controller";
import * as commentsController from "../controllers/comments.controller";

// Task endpoints (PRD §8.3) + nested task-comments (PRD §8.4).
const tasks = new Hono();

tasks.get("/:id", tasksController.getById);
tasks.put("/:id", tasksController.update);
tasks.patch("/:id/status", tasksController.updateStatus);
tasks.delete("/:id", tasksController.remove);

tasks.get("/:id/comments", commentsController.listByTask);
tasks.post("/:id/comments", commentsController.create);

export default tasks;
