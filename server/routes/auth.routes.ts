import { Hono } from "hono";
import * as authController from "../controllers/auth.controller";

// Auth endpoints (PRD §8.1). Public: /signup, /login.
const auth = new Hono();

auth.post("/signup", authController.signup);
auth.post("/login", authController.login);
auth.post("/logout", authController.logout);
auth.get("/me", authController.me);

export default auth;
