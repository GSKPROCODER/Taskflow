import { Hono } from "hono";
import * as commentsController from "../controllers/comments.controller";

// Comment endpoints (PRD §8.4).
const comments = new Hono();

comments.put("/:id", commentsController.update);

export default comments;
