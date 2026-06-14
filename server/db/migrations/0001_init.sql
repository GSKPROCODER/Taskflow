-- TaskFlow initial schema (PRD §7)
-- Run in the Supabase SQL editor or via the Supabase CLI.
-- All tables use UUID PKs; RLS is enabled (policies added in Phase 1).

-- ── Enums ───────────────────────────────────────────────────────────────────
create type user_role     as enum ('team_lead', 'developer', 'tester');
create type project_status as enum ('active', 'archived');
create type task_status    as enum ('todo', 'in_progress', 'testing', 'done');
create type task_priority  as enum ('low', 'medium', 'high', 'critical');
create type comment_type   as enum ('comment', 'system_log');

-- ── users (extends auth.users) ───────────────────────────────────────────────
create table public.users (
  id         uuid primary key references auth.users (id) on delete cascade,
  name       varchar(100) not null,
  email      varchar(255) unique not null,
  role       user_role not null default 'developer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── projects ─────────────────────────────────────────────────────────────────
create table public.projects (
  id          uuid primary key default gen_random_uuid(),
  name        varchar(200) not null,
  description text,
  status      project_status not null default 'active',
  created_by  uuid not null references public.users (id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── tasks ────────────────────────────────────────────────────────────────────
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  title       varchar(300) not null,
  description text,
  status      task_status not null default 'todo',
  priority    task_priority not null default 'medium',
  project_id  uuid not null references public.projects (id) on delete cascade,
  assignee_id uuid references public.users (id),
  created_by  uuid not null references public.users (id),
  due_date    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ── comments (user comments + system activity log) ───────────────────────────
create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  task_id    uuid not null references public.tasks (id) on delete cascade,
  user_id    uuid not null references public.users (id),
  content    text not null,
  type       comment_type not null default 'comment',
  created_at timestamptz not null default now()
);

-- ── Indexes (PRD §7.2) ───────────────────────────────────────────────────────
create index idx_tasks_project_id     on public.tasks (project_id);
create index idx_tasks_assignee_id    on public.tasks (assignee_id);
create index idx_tasks_status         on public.tasks (status);
create index idx_comments_task_id     on public.comments (task_id);
create index idx_projects_created_by  on public.projects (created_by);
create index idx_users_email          on public.users (email);

-- ── Row-Level Security (policies defined in Phase 1) ─────────────────────────
alter table public.users    enable row level security;
alter table public.projects enable row level security;
alter table public.tasks    enable row level security;
alter table public.comments enable row level security;
