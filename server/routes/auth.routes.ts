import { Hono } from "hono";
import * as authController from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

// Auth endpoints (PRD §8.1).
// POST /signup and POST /login are PUBLIC — no authMiddleware.
// POST /logout and GET /me require a valid JWT.
const auth = new Hono();

auth.post("/signup", authController.signup);
auth.post("/login", authController.login);
auth.post("/logout", authMiddleware, authController.logout);
auth.get("/me", authMiddleware, authController.me);

export default auth;
