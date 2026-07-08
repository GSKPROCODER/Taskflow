import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { errorHandler } from "./middleware/error.middleware";
import { authMiddleware } from "./middleware/auth.middleware";
import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/projects.routes";
import taskRoutes from "./routes/tasks.routes";
import commentRoutes from "./routes/comments.routes";
import dashboardRoutes from "./routes/dashboard.routes";

/**
 * TaskFlow API (PRD §8, §10). Base path /api/v1.
 * Layered architecture: Router -> Middleware -> Controller -> Service -> DB.
 *
 * Deployed to Vercel as a serverless function via api/[[...route]].ts.
 */
const app = new Hono().basePath("/api/v1");

// --- Global middleware stack (PRD §10) ---
app.use("*", logger());
app.use("*", cors());
app.onError(errorHandler);

// --- Health check ---
app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() }),
);

// --- Auth Middleware for protected routes ---
app.use("/projects/*", authMiddleware);
app.use("/tasks/*", authMiddleware);
app.use("/comments/*", authMiddleware);
app.use("/dashboard/*", authMiddleware);

// --- Feature routers ---
app.route("/auth", authRoutes);
app.route("/projects", projectRoutes);
app.route("/tasks", taskRoutes);
app.route("/comments", commentRoutes);
app.route("/dashboard", dashboardRoutes);

export default app;
