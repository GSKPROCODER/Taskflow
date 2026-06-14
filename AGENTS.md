# AGENTS.md — TaskFlow plan & guardrails

**Read this before changing anything.** This is the source of truth for the
TaskFlow architecture and delivery plan, derived from the PRD/TDD
(`TF-PRD-TDD-v1.0`, Shadow Wings). Both AI assistants and human contributors must
follow it. **Do not rewrite the plan, swap core technologies, change the hosting
target, or restructure folders without explicit owner approval** (see the last
section).

---

## 1. What we're building

TaskFlow — a collaborative task & project management platform for small agile
teams. Three roles: **Team Lead** (creates projects, assigns tasks, reviews),
**Developer** (executes tasks, moves them through the pipeline), **Tester**
(approves/rejects via a structured QA flow). Task lifecycle:
`todo → in_progress → testing → done` (Tester rejects `testing → in_progress`).

---

## 2. Locked stack (do not change without sign-off)

- **Frontend:** React 19 + Vite + TypeScript, Tailwind CSS v4, shadcn/ui.
- **Frontend state:** TanStack Query (server state) + Zustand (client state);
  React Hook Form + Zod for forms.
- **Backend:** Hono — a **REST/JSON** API mounted at `/api/v1`.
- **Data & Auth:** Supabase (PostgreSQL + Auth + Row-Level Security).
- **Runtime / package manager:** Bun (local dev, install, scripts).
- **Hosting:** Vercel (frontend SPA + Hono serverless functions) + Supabase
  (managed Postgres/Auth). No separate backend host for the MVP.

### Why these choices (so they don't get "optimized" away)

- **REST, not gRPC/GraphQL/tRPC.** The client is a browser and the API runs on
  Vercel serverless functions; gRPC needs HTTP/2 trailers and long-lived
  connections that neither provides, Supabase is REST under the hood, and at this
  scale the DB is the bottleneck — not serialization. If type-safe client calls
  are wanted later, use Hono's typed RPC client (still HTTP/JSON).
- **Hono on Vercel functions, not a long-running Bun server.** Vercel functions
  run on the Node.js runtime. If we ever need a persistent server (websockets,
  background workers), move the API to Railway/Render/Fly and keep the frontend
  on Vercel — that's a deliberate, owner-approved change, not a default.

---

## 3. Repository layout

```
taskflow/
├── api/[[...route]].ts     # ONLY file in api/ — wraps the Hono app for Vercel
├── server/                 # Backend (Hono) — PRD §10
│   ├── app.ts              # App assembly: basePath /api/v1, middleware, routers
│   ├── routes/             # Endpoint definitions (PRD §8)
│   ├── controllers/        # Thin request handlers
│   ├── services/           # Business logic (DB access lives here)
│   ├── middleware/         # auth.middleware (JWT), rbac.middleware, error.middleware
│   ├── validators/         # Zod request schemas
│   ├── db/                 # Supabase admin client + SQL migrations (PRD §7)
│   └── lib/                # Error classes, helpers
├── src/                    # Frontend (React) — PRD §9
│   ├── main.tsx            # Entry: React Query + Router providers
│   ├── router/             # Route table + ProtectedRoute
│   ├── pages/              # auth / dashboard / projects / tasks
│   ├── components/         # ui (shadcn) / layout / tasks / projects / comments
│   ├── hooks/              # useAuth, useProjects, useTasks, useComments
│   ├── api/                # axios client (baseURL /api/v1)
│   ├── store/              # Zustand slices (auth, ui)
│   ├── lib/                # supabase browser client, utils (cn)
│   └── types/              # shared domain types (mirror PRD §7)
└── tests/e2e/              # Playwright specs (PRD §11.2)
```

**Backend lives in `server/`, never in `api/`** — Vercel treats every file under
`api/` as its own function. `api/[[...route]].ts` is the only function; it
re-exports the Hono app.

---

## 4. Data model (PRD §7) — implemented in `server/db/migrations/0001_init.sql`

- **users** — extends `auth.users`. `id, name, email, role, created_at, updated_at`.
  `role ∈ {team_lead, developer, tester}` (default `developer`).
- **projects** — `id, name, description, status, created_by → users, timestamps`.
  `status ∈ {active, archived}` (default `active`).
- **tasks** — `id, title, description, status, priority, project_id → projects,
assignee_id → users, created_by → users, due_date, timestamps`.
  `status ∈ {todo, in_progress, testing, done}`; `priority ∈ {low, medium, high, critical}`.
- **comments** — `id, task_id → tasks, user_id → users, content, type, created_at`.
  `type ∈ {comment, system_log}` (status changes auto-log as `system_log`).
- **Indexes:** tasks(project_id), tasks(assignee_id), tasks(status),
  comments(task_id), projects(created_by), users(email).
- **RLS is enabled on every table.** Policies are added in Phase 1.

Schema changes are **migrations** in `server/db/migrations/`, applied via the
Supabase SQL editor or CLI. Keep the frontend `src/types` in sync.

---

## 5. API surface (PRD §8) — base path `/api/v1`

All routes require `Authorization: Bearer <token>` **except** `/auth/login` and
`/auth/signup`. Bodies are JSON. Errors are `{ error, code }`. Health: `GET /health`.

- **Auth:** `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- **Projects:** `GET /projects`, `POST /projects` (team_lead), `PUT /projects/:id`,
  `PATCH /projects/:id/archive`
- **Tasks:** `GET /projects/:id/tasks`, `POST /projects/:id/tasks` (team_lead),
  `PUT /tasks/:id`, `PATCH /tasks/:id/status`, `DELETE /tasks/:id` (team_lead)
- **Comments:** `GET /tasks/:id/comments`, `POST /tasks/:id/comments`, `PUT /comments/:id`

---

## 6. Non-negotiable conventions

1. **REST/JSON only** (see §2). No alternative RPC/transport layers.
2. **Layered backend:** Router → Middleware → Controller → Service → DB. Routes
   stay thin; business logic and DB access live in services.
3. **Auth + RBAC enforced at the API layer**, not just the UI (PRD §6).
   `requireRole("team_lead" | "developer" | "tester")` on mutating routes.
4. **Validate every request body with Zod** (`server/validators/`).
5. **Structured errors** `{ error, code }` via `error.middleware.ts` — never leak
   stack traces (PRD §6).
6. **Secrets stay server-side.** Browser uses only `VITE_SUPABASE_URL` +
   `VITE_SUPABASE_ANON_KEY`. The service-role key and JWT secret are server-only.
   Never commit `.env*`.
7. **DB changes are migrations**, never ad-hoc edits.
8. **Path aliases:** `@/*` → `src/*`, `@server/*` → `server/*`.

---

## 7. Environment variables

| Variable                    | Scope             | Purpose                          |
| --------------------------- | ----------------- | -------------------------------- |
| `VITE_SUPABASE_URL`         | frontend (public) | Supabase project URL             |
| `VITE_SUPABASE_ANON_KEY`    | frontend (public) | Supabase anon/public key         |
| `SUPABASE_URL`              | API (secret)      | Supabase project URL             |
| `SUPABASE_SERVICE_ROLE_KEY` | API (secret)      | Service-role key — server only   |
| `SUPABASE_JWT_SECRET`       | API (secret)      | Verify Supabase JWTs server-side |

Set in `.env.local` for dev and in Vercel (Production + Preview + Development).

---

## 8. Workflow & quality gates

- **Branches:** `main` (prod), `dev` (integration), `feature/*`, `bugfix/*`,
  `hotfix/*`. Feature branches branch from and merge into `dev` via PR.
- **Commits:** Conventional Commits (`<type>(scope): subject`), enforced by
  commitlint (Husky `commit-msg`).
- **Pre-commit:** Husky runs `bun run lint` + `bun run typecheck`.
- **Before pushing:** `bun run lint && bun run typecheck && bun run test`.
- **CI** (`.github/workflows/ci.yml`, PRD §13): install → lint + format → typecheck
  → unit tests → build → Playwright E2E. Deploy to Vercel is automatic on `main`.
- **Tests:** Vitest for services/validators (PRD §11.1); Playwright for the
  cross-role journeys (PRD §11.2).

---

## 9. Delivery roadmap (PRD §15) — current state: **base scaffold complete**

Implement endpoints (§5) and screens within the phase that owns them; leave
later-phase files as the existing stubs (handlers return `501`, pages are
placeholders).

1. **Auth & setup** — Supabase project + RLS policies, sign up / in / out, role
   assignment, protected routes, CI. _(tooling/CI already wired)_
2. **Projects** — projects migration is in place; build CRUD + archive, role
   guards, ProjectsPage.
3. **Tasks** — full task CRUD with filter/sort, status pipeline, tester
   approve/reject, task screens.
4. **Comments & Dashboard** — comments API + feed, system activity log, dashboard
   metrics.
5. **Testing & deployment** — full E2E suite, Lighthouse, RLS/RBAC audit, Vercel
   production config.

Post-MVP (PRD §16): notifications (Supabase Realtime), email (Resend), Kanban
(@dnd-kit), analytics, file attachments (Supabase Storage), AI summaries, etc.
**These are out of scope until the MVP ships.**

---

## 10. If you think the plan should change

Open an issue or ask the owner. Do **not** silently refactor the architecture,
replace the API protocol or transport, change the hosting target, restructure
folders, add heavy dependencies, or pull post-MVP features forward. When in
doubt, follow this document.
