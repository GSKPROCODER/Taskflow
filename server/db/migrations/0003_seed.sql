-- TaskFlow demo seed (mirrors src/lib/mock-data.ts exactly).
-- Run AFTER 0001_init.sql + 0002_rls_policies.sql AND after the team-lead user
-- has signed up (the trigger creates their public.users profile first).
--
-- All 5 projects + 45 tasks (9 per project) are inserted, attributed to the
-- first user (team_lead). Tasks cycle through all 4 statuses and 4 priorities
-- exactly as the buildTasks() function does in mock-data.ts.
--
-- Guard: "WHERE NOT EXISTS" means re-running is safe (idempotent).

-- ── 1. Projects ──────────────────────────────────────────────────────────────
WITH u AS (SELECT id FROM public.users ORDER BY created_at LIMIT 1)
INSERT INTO public.projects (name, description, status, created_by)
SELECT v.name, v.description, v.status::project_status, u.id
FROM u
CROSS JOIN (VALUES
  ('Craftboard Project', 'A board to keep track of design progress.',    'active'),
  ('Visionary Tasks',    'Roadmap and discovery work for Q1.',            'active'),
  ('Demotion Project',   'Internal demo environment revamp.',             'active'),
  ('Angular Studio',     'Legacy migration to a modern stack.',           'active'),
  ('Cudemo Project',     'Customer-facing demo polish.',                  'archived')
) AS v(name, description, status)
WHERE NOT EXISTS (SELECT 1 FROM public.projects);

-- ── 2. Tasks — 9 per project, cycling statuses + priorities ──────────────────
-- Statuses cycle: todo, in_progress, testing, done, todo, in_progress, testing, done, todo
-- (matches i % 4 from mock-data buildTasks)

-- Helper: insert 9 tasks for a single project given its position index
-- (priority offset = length of the fixed project IDs used in mock-data)
-- Priority offsets per project slot (0-4):
--   p-1 "Craftboard"  → offset 3  (len("p-1") = 3)
--   p-2 "Visionary"   → offset 3  (len("p-2") = 3)
--   p-3 "Demotion"    → offset 3  (len("p-3") = 3)
--   p-4 "Angular"     → offset 3  (len("p-4") = 3)
--   p-5 "Cudemo"      → offset 3  (len("p-5") = 3)
-- All offsets are 3 so priority cycles: high, critical, low, medium, high, critical, low, medium, high

-- ── Project 1: Craftboard Project ────────────────────────────────────────────
WITH p AS (SELECT id FROM public.projects WHERE name = 'Craftboard Project'),
     u AS (SELECT id FROM public.users ORDER BY created_at LIMIT 1)
INSERT INTO public.tasks (title, description, status, priority, project_id, assignee_id, created_by, due_date)
SELECT v.title, 'Create a page where there is information about employees and their progress.',
       v.status::task_status, v.priority::task_priority, p.id, u.id, u.id, v.due_date::date
FROM p CROSS JOIN u
CROSS JOIN (VALUES
  ('Mobile onboarding flow',        'todo',        'high',     '2026-02-04'),
  ('Notification center',           'in_progress', 'critical', '2026-02-07'),
  ('Billing integration',           'testing',     'low',      '2026-02-10'),
  ('Search & filters',              'done',        'medium',   '2026-02-13'),
  ('Role-based access control',     'todo',        'high',     '2026-02-16'),
  ('Activity timeline',             'in_progress', 'critical', '2026-02-19'),
  ('Export to CSV',                 'testing',     'low',      '2026-02-22'),
  ('Dark mode pass',                'done',        'medium',   '2026-02-25'),
  ('Empty & error states',          'todo',        'high',     '2026-02-04')
) AS v(title, status, priority, due_date)
WHERE NOT EXISTS (SELECT 1 FROM public.tasks t JOIN public.projects pr ON t.project_id = pr.id WHERE pr.name = 'Craftboard Project');

-- ── Project 2: Visionary Tasks ────────────────────────────────────────────────
WITH p AS (SELECT id FROM public.projects WHERE name = 'Visionary Tasks'),
     u AS (SELECT id FROM public.users ORDER BY created_at LIMIT 1)
INSERT INTO public.tasks (title, description, status, priority, project_id, assignee_id, created_by, due_date)
SELECT v.title, 'Create a page where there is information about employees and their progress.',
       v.status::task_status, v.priority::task_priority, p.id, u.id, u.id, v.due_date::date
FROM p CROSS JOIN u
CROSS JOIN (VALUES
  ('Activity timeline',             'todo',        'high',     '2026-02-04'),
  ('Export to CSV',                 'in_progress', 'critical', '2026-02-07'),
  ('Dark mode pass',                'testing',     'low',      '2026-02-10'),
  ('Empty & error states',          'done',        'medium',   '2026-02-13'),
  ('Employee detail page',          'todo',        'high',     '2026-02-16'),
  ('Dashboard analytics widget',    'in_progress', 'critical', '2026-02-19'),
  ('Mobile onboarding flow',        'testing',     'low',      '2026-02-22'),
  ('Settings & preferences',        'done',        'medium',   '2026-02-25'),
  ('Notification center',           'todo',        'high',     '2026-02-04')
) AS v(title, status, priority, due_date)
WHERE NOT EXISTS (SELECT 1 FROM public.tasks t JOIN public.projects pr ON t.project_id = pr.id WHERE pr.name = 'Visionary Tasks');

-- ── Project 3: Demotion Project ───────────────────────────────────────────────
WITH p AS (SELECT id FROM public.projects WHERE name = 'Demotion Project'),
     u AS (SELECT id FROM public.users ORDER BY created_at LIMIT 1)
INSERT INTO public.tasks (title, description, status, priority, project_id, assignee_id, created_by, due_date)
SELECT v.title, 'Create a page where there is information about employees and their progress.',
       v.status::task_status, v.priority::task_priority, p.id, u.id, u.id, v.due_date::date
FROM p CROSS JOIN u
CROSS JOIN (VALUES
  ('Billing integration',           'todo',        'high',     '2026-02-04'),
  ('Search & filters',              'in_progress', 'critical', '2026-02-07'),
  ('Role-based access control',     'testing',     'low',      '2026-02-10'),
  ('Activity timeline',             'done',        'medium',   '2026-02-13'),
  ('Export to CSV',                 'todo',        'high',     '2026-02-16'),
  ('Dark mode pass',                'in_progress', 'critical', '2026-02-19'),
  ('Empty & error states',          'testing',     'low',      '2026-02-22'),
  ('Employee detail page',          'done',        'medium',   '2026-02-25'),
  ('Dashboard analytics widget',    'todo',        'high',     '2026-02-04')
) AS v(title, status, priority, due_date)
WHERE NOT EXISTS (SELECT 1 FROM public.tasks t JOIN public.projects pr ON t.project_id = pr.id WHERE pr.name = 'Demotion Project');

-- ── Project 4: Angular Studio ─────────────────────────────────────────────────
WITH p AS (SELECT id FROM public.projects WHERE name = 'Angular Studio'),
     u AS (SELECT id FROM public.users ORDER BY created_at LIMIT 1)
INSERT INTO public.tasks (title, description, status, priority, project_id, assignee_id, created_by, due_date)
SELECT v.title, 'Create a page where there is information about employees and their progress.',
       v.status::task_status, v.priority::task_priority, p.id, u.id, u.id, v.due_date::date
FROM p CROSS JOIN u
CROSS JOIN (VALUES
  ('Mobile onboarding flow',        'todo',        'high',     '2026-02-04'),
  ('Settings & preferences',        'in_progress', 'critical', '2026-02-07'),
  ('Notification center',           'testing',     'low',      '2026-02-10'),
  ('Billing integration',           'done',        'medium',   '2026-02-13'),
  ('Search & filters',              'todo',        'high',     '2026-02-16'),
  ('Role-based access control',     'in_progress', 'critical', '2026-02-19'),
  ('Activity timeline',             'testing',     'low',      '2026-02-22'),
  ('Export to CSV',                 'done',        'medium',   '2026-02-25'),
  ('Dark mode pass',                'todo',        'high',     '2026-02-04')
) AS v(title, status, priority, due_date)
WHERE NOT EXISTS (SELECT 1 FROM public.tasks t JOIN public.projects pr ON t.project_id = pr.id WHERE pr.name = 'Angular Studio');

-- ── Project 5: Cudemo Project (archived) ──────────────────────────────────────
WITH p AS (SELECT id FROM public.projects WHERE name = 'Cudemo Project'),
     u AS (SELECT id FROM public.users ORDER BY created_at LIMIT 1)
INSERT INTO public.tasks (title, description, status, priority, project_id, assignee_id, created_by, due_date)
SELECT v.title, 'Create a page where there is information about employees and their progress.',
       v.status::task_status, v.priority::task_priority, p.id, u.id, u.id, v.due_date::date
FROM p CROSS JOIN u
CROSS JOIN (VALUES
  ('Empty & error states',          'todo',        'high',     '2026-02-04'),
  ('Employee detail page',          'in_progress', 'critical', '2026-02-07'),
  ('Dashboard analytics widget',    'testing',     'low',      '2026-02-10'),
  ('Mobile onboarding flow',        'done',        'medium',   '2026-02-13'),
  ('Settings & preferences',        'todo',        'high',     '2026-02-16'),
  ('Notification center',           'in_progress', 'critical', '2026-02-19'),
  ('Billing integration',           'testing',     'low',      '2026-02-22'),
  ('Search & filters',              'done',        'medium',   '2026-02-25'),
  ('Role-based access control',     'todo',        'high',     '2026-02-04')
) AS v(title, status, priority, due_date)
WHERE NOT EXISTS (SELECT 1 FROM public.tasks t JOIN public.projects pr ON t.project_id = pr.id WHERE pr.name = 'Cudemo Project');

-- ── 3. Sample comments for first task in Craftboard Project ───────────────────
WITH t AS (
  SELECT tasks.id
  FROM public.tasks
  JOIN public.projects ON tasks.project_id = projects.id
  WHERE projects.name = 'Craftboard Project'
  ORDER BY tasks.created_at
  LIMIT 1
),
u AS (SELECT id FROM public.users ORDER BY created_at LIMIT 1)
INSERT INTO public.comments (task_id, user_id, content, type)
SELECT t.id, u.id, v.content, v.type::comment_type
FROM t CROSS JOIN u
CROSS JOIN (VALUES
  ('Started on the layout, pushing a draft shortly.',       'comment'),
  ('Status changed to In Progress by @team_lead',           'system_log'),
  ('Looks good — minor spacing nits in the header.',        'comment'),
  ('Status changed to In Review by @team_lead',             'system_log')
) AS v(content, type)
WHERE NOT EXISTS (SELECT 1 FROM public.comments);
