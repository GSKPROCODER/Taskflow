import { Hono } from "hono";
import * as dashboardController from "../controllers/dashboard.controller";

const dashboard = new Hono();

dashboard.get("/metrics", dashboardController.getMetrics);
dashboard.get("/activity", dashboardController.getActivity);
dashboard.get("/my-tasks", dashboardController.getMyTasks);

export default dashboard;
