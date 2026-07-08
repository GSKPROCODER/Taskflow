-- Phase 5: Tighten RLS policies to enforce RBAC at the database layer

-- Drop the overly permissive policies from 0002
drop policy if exists "projects writable" on public.projects;
drop policy if exists "tasks writable" on public.tasks;
drop policy if exists "comments writable" on public.comments;

-- ── Projects ─────────────────────────────────────────────────────────────────
-- Only team_leads can insert or update projects
create policy "projects insertable by team_lead" on public.projects
  for insert to authenticated
  with check ( (select role from public.users where id = auth.uid()) = 'team_lead' );

create policy "projects updatable by team_lead" on public.projects
  for update to authenticated
  using ( (select role from public.users where id = auth.uid()) = 'team_lead' );

create policy "projects deletable by team_lead" on public.projects
  for delete to authenticated
  using ( (select role from public.users where id = auth.uid()) = 'team_lead' );

-- ── Tasks ────────────────────────────────────────────────────────────────────
-- team_leads can do anything with tasks
create policy "tasks insertable by team_lead" on public.tasks
  for insert to authenticated
  with check ( (select role from public.users where id = auth.uid()) = 'team_lead' );

create policy "tasks updatable by team_lead" on public.tasks
  for update to authenticated
  using ( (select role from public.users where id = auth.uid()) = 'team_lead' );

create policy "tasks deletable by team_lead" on public.tasks
  for delete to authenticated
  using ( (select role from public.users where id = auth.uid()) = 'team_lead' );

-- Developers can update tasks (e.g. status) if they are assigned to them
create policy "tasks updatable by assignee" on public.tasks
  for update to authenticated
  using ( assignee_id = auth.uid() );

-- Testers can update tasks to approve/reject them
create policy "tasks updatable by tester" on public.tasks
  for update to authenticated
  using ( (select role from public.users where id = auth.uid()) = 'tester' );

-- ── Comments ─────────────────────────────────────────────────────────────────
-- Anyone can read (already handled by 'comments readable')
-- Anyone can insert a comment on a task they can see
create policy "comments insertable by authenticated" on public.comments
  for insert to authenticated
  with check ( true );

-- Users can only update/delete their own comments
create policy "comments updatable by author" on public.comments
  for update to authenticated
  using ( user_id = auth.uid() );

create policy "comments deletable by author" on public.comments
  for delete to authenticated
  using ( user_id = auth.uid() );
