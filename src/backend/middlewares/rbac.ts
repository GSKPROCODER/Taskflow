import { Context, Next } from 'hono';

export const requireRole = (allowedRoles: string[]) => {
  return async (c: Context, next: Next) => {
    // Placeholder: Check if c.get('user').role is in allowedRoles
    // If not, return 403 Forbidden
    await next();
  };
};
