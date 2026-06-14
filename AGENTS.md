# AGENTS.md — TaskFlow plan & guardrails

**Read this before changing anything.** This is the source of truth for the
TaskFlow architecture and delivery plan, derived from the PRD/TDD
(`TF-PRD-TDD-v1.0`, Shadow Wings). Both AI assistants and human contributors must
follow it. **Do not rewrite the plan, swap core technologies, change the hosting
target, or restructure folders without explicit owner approval** (see §13).

> **How to use this file:** §1–§7 describe _what exists and why_. §8–§12 are the
> operational rules you must follow on every change. When this file and the code
> disagree, the code is the truth — fix the drift or flag it, don't paper over it.

---

## 1. What we're building

TaskFlow — a collaborative task & project management platform for small agile
teams. Three roles:

- **Team Lead** — creates projects, assigns tasks, reviews work.
- **Developer** — executes tasks, moves them through the pipeline.
- **Tester** — approves/rejects via a structured QA flow.

Task lifecycle: `todo → in_progress → testing → done`. The Tester can reject from
`testing → in_progress`. Status transitions are auto-recorded as `system_log`
comments (see §4).

---

## 2. Locked stack (do not change without sign-off)

- **Frontend:** React 19 + Vite 6 + TypeScript 5.7, Tailwind CSS v4, shadcn/ui.
- **Frontend state:** TanStack Query (server state) + Zustand (client state);
  React Hook Form + Zod for forms.
- **Backend:** Hono — a **REST/JSON** API mounted at `/api/v1`.
- **Data & Auth:** Supabase (PostgreSQL + Auth + Row-Level Security).
- **Runtime / package manager:** Bun (local dev, install, scripts). The lockfile
  is `bun.lock` — commit it; never add `package-lock.json` / `pnpm-lock.yaml`.
- **Hosting:** Vercel (frontend SPA + Hono serverless function) + Supabase
  (managed Postgres/Auth). No separate backend host for the MVP.

### Why these choices (so they don't get "optimized" away)

- **REST, not gRPC/GraphQL/tRPC.** The client is a browser and the API runs on
  Vercel serverless functions; gRPC needs HTTP/2 trailers and long-lived
  connections that neither provides, Supabase is REST under the hood, and at this
  scale the DB is the bottleneck — not serialization. If type-safe client calls
  are wanted later, use Hono's typed RPC client (still HTTP/JSON).
- **Hono on Vercel functions, not a long-running Bun server.** The function runs
  on the Vercel **Node.js runtime** (so `jsonwebtoken` and other Node libs work —
  see `api/[[...route]].ts`). If we ever need a persistent server (websockets,
  background workers), move the API to Railway/Render/Fly and keep the frontend
  on Vercel — a deliberate, owner-approved change, not a default.

---

## 3. Repository layout

```
taskflow/
├── api/[[...route]].ts     # ONLY file in api/ — wraps the Hono app for Vercel
├── server/                 # Backend (Hono) — PRD §10
│   ├── app.ts              # App assembly: basePath /api/v1, middleware, routers
│   ├── routes/             # Endpoint definitions (PRD §8) — *.routes.ts
│   ├── controllers/        # Thin request handlers — *.controller.ts
│   ├── services/           # Business logic (DB access lives here) — *.service.ts
│   ├── middleware/         # auth.middleware (JWT), rbac.middleware, error.middleware
│   ├── validators/         # Zod request schemas — *.schema.ts
│   ├── db/                 # client.ts (service-role) + migrations/ (PRD §7)
│   └── lib/                # errors.ts (AppError hierarchy), helpers
├── src/                    # Frontend (React) — PRD §9
│   ├── main.tsx            # Entry: React Query + Router providers
│   ├── router/             # index.tsx (route table) + ProtectedRoute
│   ├── pages/              # auth / dashboard / projects / tasks
│   ├── components/         # ui (shadcn) / layout / tasks / projects / comments
│   ├── hooks/              # useAuth, useProjects, useTasks, useComments
│   ├── api/                # client.ts — axios instance (baseURL /api/v1)
│   ├── store/              # Zustand slices (auth.store, ui.store)
│   ├── lib/                # supabase.ts (browser client), utils.ts (cn)
│   └── types/              # index.ts — shared domain types (mirror PRD §7)
└── tests/e2e/              # Playwright specs (PRD §11.2) — no specs yet
```

**Backend lives in `server/`, never in `api/`** — Vercel treats every file under
`api/` as its own function. `api/[[...route]].ts` is the only function; it
re-exports the Hono app via `handle(app)`.

**Current implementation state:** the full skeleton exists. Services throw
`NotImplementedError` (HTTP 501) until their phase lands (§9); pages are
placeholders. Implement within the phase that owns the file — don't stub-fill
ahead of schedule.

---

## 4. Data model (PRD §7) — `server/db/migrations/0001_init.sql`

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

Schema changes are **migrations** in `server/db/migrations/` (sequential
`NNNN_name.sql`), applied via the Supabase SQL editor or CLI. Keep
`src/types/index.ts` in sync with every schema change.

---

## 5. API surface (PRD §8) — base path `/api/v1`

All routes require `Authorization: Bearer <token>` **except** `/auth/login`,
`/auth/signup`, and `GET /health`. Bodies are JSON. Errors are `{ error, code }`
(§6). Health: `GET /health` → `{ status, timestamp }`.

- **Auth:** `POST /auth/signup`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
- **Projects:** `GET /projects`, `POST /projects` (team_lead), `PUT /projects/:id`,
  `PATCH /projects/:id/archive`
- **Tasks:** `GET /projects/:id/tasks`, `POST /projects/:id/tasks` (team_lead),
  `PUT /tasks/:id`, `PATCH /tasks/:id/status`, `DELETE /tasks/:id` (team_lead)
- **Comments:** `GET /tasks/:id/comments`, `POST /tasks/:id/comments`, `PUT /comments/:id`

### Request flow

```
Request → logger → cors → router → auth.middleware (verify JWT)
        → rbac.middleware (requireRole) → controller → service → Supabase
                                                       ↓ throws AppError
                                              app.onError → error.middleware
```

Controllers stay thin: parse/validate input, call a service, return its result.
**All DB access lives in services.** Never query Supabase from a controller,
route, or React component (the browser uses the anon client only — §6).

---

## 6. Error & status conventions

Errors are thrown as `AppError` subclasses (`server/lib/errors.ts`) and rendered
to JSON by `error.middleware.ts` as `{ error, code }`. **Never leak stack
traces.** Unknown errors collapse to `INTERNAL_ERROR` / 500.

| Error class            | `code`             | HTTP | When                            |
| ---------------------- | ------------------ | ---- | ------------------------------- |
| `ValidationError`      | `VALIDATION_ERROR` | 400  | Zod parse fails / bad input     |
| `UnauthorizedError`    | `UNAUTHORIZED`     | 401  | Missing/invalid JWT             |
| `ForbiddenError`       | `FORBIDDEN`        | 403  | Authenticated but wrong role    |
| `NotFoundError`        | `NOT_FOUND`        | 404  | Resource does not exist         |
| `NotImplementedError`  | `NOT_IMPLEMENTED`  | 501  | Scaffold stub, not yet built    |
| (Hono `HTTPException`) | `HTTP_ERROR`       | var  | Framework-level HTTP error      |
| (any other throw)      | `INTERNAL_ERROR`   | 500  | Unexpected — logged server-side |

Add a new error type by extending `AppError`, not by returning ad-hoc JSON.

---

## 7. Non-negotiable conventions

1. **REST/JSON only** (see §2). No alternative RPC/transport layers.
2. **Layered backend:** Router → Middleware → Controller → Service → DB. Routes
   stay thin; business logic and DB access live in services.
3. **Auth + RBAC enforced at the API layer**, not just the UI (PRD §6).
   `requireRole("team_lead" | "developer" | "tester")` on mutating routes.
4. **Validate every request body with Zod** (`server/validators/*.schema.ts`).
   Throw `ValidationError` on failure.
5. **Structured errors** `{ error, code }` via `error.middleware.ts` — never leak
   stack traces (§6).
6. **Secrets stay server-side.** Browser uses only `VITE_SUPABASE_URL` +
   `VITE_SUPABASE_ANON_KEY` (anon key, RLS-protected). The service-role key and
   JWT secret are server-only. Never commit `.env*`.
7. **DB changes are migrations**, never ad-hoc edits to a live schema.
8. **Path aliases:** `@/*` → `src/*` (resolved by both tsconfig **and**
   vite.config); `@server/*` → `server/*` (tsconfig only — type-checking and the
   serverless function, **not** the browser bundle). Frontend code must **never**
   import from `@server/*` or `server/` — it would leak server code/secrets into
   the client. Keep shared shapes in `src/types`.
9. **Naming:** backend files are suffixed by layer (`*.controller.ts`,
   `*.service.ts`, `*.routes.ts`, `*.schema.ts`, `*.middleware.ts`). React
   components are `PascalCase.tsx`; hooks are `useX.ts`; Zustand slices are
   `*.store.ts`.

---

## 8. Environment variables

| Variable                    | Scope             | Purpose                          |
| --------------------------- | ----------------- | -------------------------------- |
| `VITE_SUPABASE_URL`         | frontend (public) | Supabase project URL             |
| `VITE_SUPABASE_ANON_KEY`    | frontend (public) | Supabase anon/public key         |
| `SUPABASE_URL`              | API (secret)      | Supabase project URL             |
| `SUPABASE_SERVICE_ROLE_KEY` | API (secret)      | Service-role key — server only   |
| `SUPABASE_JWT_SECRET`       | API (secret)      | Verify Supabase JWTs server-side |

- **Local dev:** put these in `.env` (gitignored). Copy `.env.example` as the
  template. Vite exposes `VITE_`-prefixed vars to the browser; `vercel dev`
  exposes the rest to the function. Missing vars throw on startup
  (`src/lib/supabase.ts`, `server/db/client.ts`) — fail fast, by design.
- **Vercel:** set all five for **Production + Preview + Development**.
- The browser only ever sees the two `VITE_` vars; everything else is server-only.

---

## 9. Local development

```bash
bun install                 # install deps (frozen in CI)
bun run dev                 # Vite frontend only → http://localhost:5173
bun run dev:api             # vercel dev (Hono API) → http://localhost:3000
```

`vite` proxies `/api` → `http://localhost:3000` (see `vite.config.ts`), so run
both for a full stack locally. Other scripts: `bun run build`, `bun run preview`,
`bun run typecheck`, `bun run lint`, `bun run format` / `format:check`,
`bun run test` (Vitest), `bun run test:e2e` (Playwright).

---

## 10. Workflow & quality gates

- **Branches:** `main` (prod), `develop` (integration), `feature/*`, `bugfix/*`,
  `hotfix/*`. Feature branches branch from and merge into `develop` via PR. CI
  runs on pushes/PRs to `main` and `develop` (`.github/workflows/ci.yml`).
- **Commits:** Conventional Commits (`<type>(scope): subject`), enforced by
  commitlint (Husky `commit-msg`). Types: `feat, fix, docs, style, refactor,
perf, test, build, ci, chore, revert`. Suggested scopes: `auth, projects,
tasks, comments, db, api, ui, ci`.
- **Pre-commit:** Husky runs `bun run lint` + `bun run typecheck`.
- **Before pushing:** `bun run lint && bun run typecheck && bun run test`.
- **CI** (PRD §13): two jobs. `quality` = install → lint + `format:check` →
  typecheck → unit tests → build. `e2e` (needs `quality`) = install →
  `playwright install chromium` → E2E. Vercel deploys via its Git integration
  (production on `main`, previews on PRs) — separate from this CI workflow.
- **Tests:** Vitest for services/validators (PRD §11.1) — colocate as `*.test.ts`;
  Playwright for cross-role journeys in `tests/e2e/` (PRD §11.2).

---

## 11. Definition of Done (per change / PR)

- [ ] Code follows the layering (§7) and naming (§7.9) conventions.
- [ ] Request bodies validated with Zod; errors thrown as `AppError` (§6).
- [ ] RBAC enforced on the route, not just the UI, for any mutation.
- [ ] `bun run lint && bun run typecheck && bun run test` all pass locally.
- [ ] Schema touched → migration added **and** `src/types` updated.
- [ ] No secrets committed; only `VITE_` vars referenced in `src/`.
- [ ] Conventional-commit message; PR targets `develop` (unless hotfix).
- [ ] New endpoints/behaviour covered by a Vitest or Playwright test.

---

## 12. Delivery roadmap (PRD §15) — current state: **base scaffold complete**

Implement endpoints (§5) and screens within the phase that owns them; leave
later-phase files as the existing stubs (services throw `NotImplementedError`,
pages are placeholders).

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

## 13. If you think the plan should change

Open an issue or ask the owner. Do **not** silently refactor the architecture,
replace the API protocol or transport, change the hosting target, restructure
folders, add heavy dependencies, or pull post-MVP features forward. When in
doubt, follow this document.
