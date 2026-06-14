# TaskFlow

Collaborative task & project management platform for small agile teams.
Team Leads create projects and assign tasks; Developers move work through a
status pipeline; Testers approve or reject via a structured QA flow.

> Base repository scaffold — structure and tooling are wired up; feature code is
> implemented across the 5 phases in the PRD. See [AGENTS.md](AGENTS.md) for the
> locked architecture and conventions.

## Tech stack

| Layer     | Choice                                                            |
| --------- | ----------------------------------------------------------------- |
| Frontend  | React 19 + Vite + TypeScript, Tailwind v4, shadcn/ui              |
| State     | TanStack Query (server) + Zustand (client), React Hook Form + Zod |
| API       | Hono (REST, `/api/v1`) on Vercel Serverless Functions             |
| Data/Auth | Supabase (PostgreSQL + Auth + RLS)                                |
| Tooling   | Bun, ESLint, Prettier, Husky, Commitlint, Vitest, Playwright      |
| Hosting   | Vercel (frontend + API) · Supabase (managed DB/Auth)              |

## Project structure

```
taskflow/
├── api/[[...route]].ts     # Vercel function — wraps the Hono app
├── server/                 # Backend (Hono) — PRD §10
│   ├── app.ts              # App assembly (routes + middleware)
│   ├── routes/             # Endpoint definitions (PRD §8)
│   ├── controllers/        # Request handlers
│   ├── services/           # Business logic
│   ├── middleware/         # auth (JWT), rbac, error handler
│   ├── validators/         # Zod schemas
│   ├── db/                 # Supabase client + SQL migrations (PRD §7)
│   └── lib/                # Error classes, helpers
├── src/                    # Frontend (React) — PRD §9
│   ├── main.tsx            # Entry (React Query + Router providers)
│   ├── router/             # Route table + ProtectedRoute
│   ├── pages/              # auth / dashboard / projects / tasks
│   ├── components/         # ui (shadcn) / layout / feature components
│   ├── hooks/ api/ store/  # data hooks, axios client, Zustand slices
│   ├── lib/                # supabase browser client, utils
│   └── types/              # shared domain types (PRD §7)
└── tests/e2e/              # Playwright specs (PRD §11.2)
```

## Getting started

```bash
bun install                 # install dependencies
cp .env.example .env.local  # fill in your Supabase keys
```

Apply the database schema (PRD §7) — paste `server/db/migrations/0001_init.sql`
into the Supabase SQL editor, or run it via the Supabase CLI.

### Develop

```bash
bun run dev          # frontend only (http://localhost:5173)
bun run dev:api      # full stack via `vercel dev` (frontend + /api)
```

`bun run dev` proxies `/api` to `localhost:3000`, so run `dev:api` alongside it
(or use `dev:api` on its own) when you need the API.

### Quality & tests

```bash
bun run lint         # ESLint
bun run typecheck    # tsc --noEmit
bun run test         # Vitest unit tests
bun run test:e2e     # Playwright E2E
bun run build        # production build -> dist/
```

## Deployment

- **Frontend + API → Vercel.** Import the repo; framework auto-detects as Vite.
  The static SPA is served from `dist/`; everything under `/api/*` runs as a
  serverless function (the Hono app). Add the env vars below in project settings.
- **Database/Auth → Supabase.** Managed; connected via the env vars.

## Environment variables

| Variable                    | Where             | Purpose                                       |
| --------------------------- | ----------------- | --------------------------------------------- |
| `VITE_SUPABASE_URL`         | Frontend (public) | Supabase project URL                          |
| `VITE_SUPABASE_ANON_KEY`    | Frontend (public) | Supabase anon/public key                      |
| `SUPABASE_URL`              | API (secret)      | Supabase project URL                          |
| `SUPABASE_SERVICE_ROLE_KEY` | API (secret)      | Service-role key — server only, never exposed |
| `SUPABASE_JWT_SECRET`       | API (secret)      | Verifies Supabase JWTs server-side            |

Set these in Vercel for the Production, Preview, and Development environments.

## API

REST, base path `/api/v1` (PRD §8). All routes require `Authorization: Bearer
<token>` except `/auth/login` and `/auth/signup`. Errors are JSON: `{ error, code }`.
Health check: `GET /api/v1/health`.
