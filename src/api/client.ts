import axios from "axios";

/**
 * Typed HTTP client for the TaskFlow API (PRD §8, §9).
 * Base URL points at the Hono API mounted under /api/v1.
 * TODO: attach the Supabase JWT via a request interceptor.
 */
export const apiClient = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});
