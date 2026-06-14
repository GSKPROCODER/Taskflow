# AGENTS.md — TaskFlow architecture & guardrails

**Read this before changing anything.** This file is the source of truth for the
TaskFlow architecture, agreed with the team (Shadow Wings) and derived from the
PRD/TDD (`TF-PRD-TDD-v1.0`). AI assistants and human contributors must follow it.
**Do not rewrite the plan or swap core technologies without explicit owner approval.**

## Locked stack (do not change without sign-off)

- **Frontend:** React 19 + Vite + TypeScript, Tailwind CSS v4, shadcn/ui.
- **Frontend state:** TanStack Query (server state) + Zustand (client state);
  React Hook Form + Zod for forms.
- **Backend:** Hono — a **REST/JSON** API mounted at `/api/v1`.
- **Data & Auth:** Supabase (PostgreSQL + Auth + Row-Level Security).
- **Runtime/PM:** Bun for local dev, install, and scripts.
- **Hosting:** Vercel (frontend SPA + Hono serverless functions) + Supabase.

## Non-negotiable conventions

1. **API is REST/JSON.** Do not introduce gRPC, GraphQL, tRPC, or other RPC
   layers. Rationale: the client is a browser and the API runs on Vercel
   serverless — gRPC needs HTTP/2 trailers/long-lived connections browsers and
   serverless functions don't provide, and Supabase is REST under the hood. REST
   is more than adequate at this scale (small teams, CRUD; the DB is the
   bottleneck, not serialization). If type-safe client calls are later desired,
   use Hono's typed RPC client — still over HTTP/JSON.
2. **Backend lives in `server/`, never in `api/`.** Vercel treats every file in
   `api/` as its own function. `api/[[...route]].ts` is the ONLY file there; it
   wraps the Hono app from `server/app.ts`.
3. **Layered backend:** Router → Middleware → Controller → Service → DB. Keep
   business logic in services; keep routes thin.
4. **RBAC + auth enforced at the API layer**, not just the UI (PRD §6). Roles:
   `team_lead | developer | tester`.
5. **Validate all request bodies with Zod** (`server/validators/`).
6. **Errors are structured JSON** `{ error, code }` via `error.middleware.ts` —
   never leak stack traces.
7. **Secrets:** service-role key and JWT secret are server-only. The browser only
   ever uses `VITE_SUPABASE_*` (URL + anon key). Never commit `.env*`.
8. **DB changes are migrations** in `server/db/migrations/` (PRD §7), applied via
   the Supabase SQL editor / CLI.

## Conventions

- **Path aliases:** `@/*` → `src/*` (frontend), `@server/*` → `server/*`.
- **Commits:** Conventional Commits, enforced by commitlint (PRD §12).
- **Branches:** `main` (prod), `develop` (integration), `feature/*`, `bugfix/*`,
  `hotfix/*`.
- **Before pushing:** `bun run lint && bun run typecheck && bun run test` (also
  enforced by the Husky pre-commit hook and CI in `.github/workflows/ci.yml`).

## Build order (PRD §15)

1. Auth & setup → 2. Projects → 3. Tasks → 4. Comments & Dashboard →
2. Testing & deployment. Implement endpoints (PRD §8) and screens (PRD §9) within
   the phase that owns them; leave later-phase files as the existing stubs.

## If you think the plan should change

Open an issue / ask the owner. Do **not** silently refactor the architecture,
replace the API protocol, change the hosting target, or restructure folders.
