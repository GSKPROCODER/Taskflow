import { handle } from "hono/vercel";
import app from "../server/app";

// Vercel catch-all function: every /api/* request is handled by the Hono app.
// Runs on the Node.js runtime (default) so jsonwebtoken / Node libs work.
export default handle(app);
