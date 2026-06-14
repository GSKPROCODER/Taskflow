import { defineConfig } from "vitest/config";
import path from "node:path";

// Unit tests (PRD §11.1) — services, utilities, validators.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@server": path.resolve(__dirname, "./server"),
    },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["server/**/*.test.ts", "src/**/*.test.ts"],
  },
});
