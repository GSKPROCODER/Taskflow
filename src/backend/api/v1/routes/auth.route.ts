import { Hono } from 'hono';

const authRouter = new Hono();

authRouter.post('/login', async (c) => {
  return c.json({ message: 'Login endpoint' });
});

authRouter.post('/signup', async (c) => {
  return c.json({ message: 'Signup endpoint' });
});

export default authRouter;
