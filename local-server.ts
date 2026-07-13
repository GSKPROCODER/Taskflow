import app from "./server/app";

console.log("Starting local Hono API server on http://localhost:3000");

export default {
  port: 3000,
  fetch: app.fetch,
};
