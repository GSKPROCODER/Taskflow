-- TaskFlow demo seed (optional). Run AFTER 0001 + 0002 AND after you've signed
-- up at least one user (the trigger creates their public.users profile).
-- Projects/tasks are attributed to the earliest-created user.

with u as (select id from public.users order by created_at limit 1)
insert into public.projects (name, description, status, created_by)
select v.name, v.description, 'active'::project_status, u.id
from u
cross join (values
  ('Craftboard Project', 'A board to keep track of design progress.'),
  ('Visionary Tasks', 'Roadmap and discovery work for Q1.'),
  ('Demotion Project', 'Internal demo environment revamp.')
) as v(name, description)
where not exists (select 1 from public.projects);

-- A handful of tasks spread across statuses for the first project.
with p as (select id from public.projects order by created_at limit 1),
     u as (select id from public.users order by created_at limit 1)
insert into public.tasks (title, description, status, priority, project_id, assignee_id, created_by)
select v.title, v.description, v.status::task_status, v.priority::task_priority, p.id, u.id, u.id
from p
cross join u
cross join (values
  ('Employee detail page', 'Information about employees and their progress.', 'todo', 'high'),
  ('Dashboard analytics widget', 'Status breakdown and counters.', 'in_progress', 'medium'),
  ('Mobile onboarding flow', 'First-run experience on mobile.', 'testing', 'critical'),
  ('Settings & preferences', 'Profile and account settings.', 'done', 'low')
) as v(title, description, status, priority)
where not exists (select 1 from public.tasks);
