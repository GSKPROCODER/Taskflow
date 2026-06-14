import type { Context } from "hono";
import * as authService from "../services/auth.service";

// Auth controllers (PRD §8.1). Thin layer: validate -> service -> respond.

export const signup = async (c: Context) => c.json(await authService.signup());
export const login = async (c: Context) => c.json(await authService.login());
export const logout = async (c: Context) => c.json(await authService.logout());
export const me = async (c: Context) =>
  c.json(await authService.getCurrentUser());
