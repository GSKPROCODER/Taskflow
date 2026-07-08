import axios from "axios";
import { supabase } from "@/lib/supabase";

/**
 * Typed HTTP client for the TaskFlow API (PRD §8, §9).
 * Base URL points at the Hono API mounted under /api/v1.
 */
export const apiClient = axios.create({
  baseURL: "/api/v1",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});
