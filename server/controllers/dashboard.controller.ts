import type { Context } from "hono";
import * as dashboardService from "../services/dashboard.service";

export const getMetrics = async (c: Context) => {
  return c.json(await dashboardService.getMetrics());
};

export const getActivity = async (c: Context) => {
  return c.json(await dashboardService.getActivity());
};

export const getMyTasks = async (c: Context) => {
  const user = c.get("user");
  return c.json(await dashboardService.getMyTasks(user.id));
};
