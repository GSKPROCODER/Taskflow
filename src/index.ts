import index from "./index.html";
import { Hono } from "hono";

import { loggerMiddleware } from "./backend/middlewares/logger";
import { errorHandler } from "./backend/middlewares/errorHandler";
import authRouter from "./backend/api/v1/routes/auth.route";



const app = new Hono();

app.use("*", loggerMiddleware);
app.onError(errorHandler);

app.route("/api/v1/auth", authRouter);

app.get("/api/v1/health", (c) =>
  c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  })
);

app.get("*", async (c) => {
  const html = await Bun.file("./src/index.html").text();

  return new Response(html, {
    headers: {
      "Content-Type": "text/html",
    },
  });
});

export default {
  port: 3000,
  fetch: app.fetch,
};