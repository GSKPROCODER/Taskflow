import { Hono } from "hono";
import * as commentsController from "../controllers/comments.controller";
import { authMiddleware } from "../middleware/auth.middleware";

// Standalone comment endpoint (PRD §8.4): PUT /comments/:id
// (GET + POST are nested under /tasks/:id/comments in tasks.routes.ts)
const comments = new Hono();

comments.put("/:id", authMiddleware, commentsController.update);

export default comments;
