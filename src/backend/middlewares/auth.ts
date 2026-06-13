import { Context, Next } from 'hono';

export const authMiddleware = async (c: Context, next: Next) => {
  // Placeholder: Extract JWT from Auth header and verify with Supabase
  // If valid, set user in context: c.set('user', user);
  await next();
};
