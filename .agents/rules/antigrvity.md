---
trigger: always_on
glob:
description: TaskFlow workspace production-integrity rules for Antigravity
---

# TaskFlow — Antigravity Production Rules

These rules are **non-negotiable**. They exist because past violations broke
the app in production. Follow AGENTS.md (especially §7, §14) as the source
of truth.

## Routing

- **Never redirect `/` to `/login`.** The root route must render the public
  `LandingPage`. Authenticated users are redirected to `/dashboard` by the
  component itself.
- **Never delete a page file** that is imported by the router without replacing
  it in the same change.
- **Never weaken `ProtectedRoute`** or move authenticated routes to the public
  router without owner approval.

## Authentication

- **The auth store must hydrate from Supabase** via `getSession()` +
  `onAuthStateChange()`. Never short-circuit with `setUser(null)` — it breaks
  OAuth callback flows and session persistence on refresh.
- **Never use mock/fake users in production code paths.** Login and signup
  must call real Supabase auth functions. Mocks belong in `*.test.ts` only.
- **Never commit placeholder Supabase URLs or keys.** The client must fail
  fast if `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are missing.

## Data Hooks

- **Hooks must never silently fall back to mock data.** If the API fails,
  let TanStack Query expose the error state. The UI should show an error,
  not fake data.
- **Never import from `@/lib/mock-data` in production hooks or pages.**
  Mock data is for tests and seed scripts only.
- **Mutations must not create fake entities on failure.** If `apiClient.post`
  fails, the mutation should throw — not push a fake object into a local array.

## Code Quality

- Run `bun run typecheck` and `bun run lint` before every push.
- Follow the layered architecture: Router → Controller → Service → DB.
- All DB access lives in services, never in controllers or components.
- Use `AppError` subclasses for errors (§6). Never return ad-hoc JSON errors.
- Validate all request bodies with Zod schemas.
- Use Conventional Commits (`feat(scope): subject`).

## Before Merging Any PR

- [ ] No imports from `@/lib/mock-data` in hooks or pages.
- [ ] No `console.log` in production code.
- [ ] No placeholder/fallback URLs or API keys.
- [ ] Auth flow tested end-to-end (signup → login → refresh → logout).
- [ ] `bun run typecheck && bun run lint && bun run test` all pass.
