import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// Frontend build config. Outputs a static SPA to dist/ (served by Vercel).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
    host: true, // Exposes to network (0.0.0.0) which helps bypass localhost resolution issues
    // `vite` dev serves the frontend only. Run `bun run dev:api` (vercel dev)
    // to serve the Hono API too; this proxy forwards /api to it.
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
});
