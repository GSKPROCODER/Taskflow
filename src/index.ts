import { Hono } from 'hono';
import { loggerMiddleware } from './backend/middlewares/logger';
import { errorHandler } from './backend/middlewares/errorHandler';
import authRouter from './backend/api/v1/routes/auth.route';
import index from './index.html';

const app = new Hono();

// Global Middlewares
app.use('*', loggerMiddleware);
app.onError(errorHandler);

// API Routes (v1)
app.route('/api/v1/auth', authRouter);

// Health check
app.get('/api/v1/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Serve frontend for all unmatched routes
app.get('*', (c) => {
  return new Response(index, {
    headers: { 'Content-Type': 'text/html' },
  });
});

export default {
  port: process.env.PORT || 3000,
  fetch: app.fetch,
};

console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
