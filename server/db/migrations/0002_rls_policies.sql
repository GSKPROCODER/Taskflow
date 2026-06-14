-- TaskFlow RLS policies + profile trigger (PRD §6, §7)
-- Run AFTER 0001_init.sql. Enables the browser (authenticated) client to read
-- and write through Row-Level Security. RBAC is tightened at the API in Phase 1+.

-- ── Auto-create a public.users profile when an auth user signs up ─────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'developer')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Policies (authenticated users; small trusted team) ───────────────────────
-- users: everyone signed in can read the directory; you can update your own row.
create policy "users readable by authenticated"
  on public.users for select to authenticated using (true);
create policy "users update own row"
  on public.users for update to authenticated using (auth.uid() = id);

-- projects / tasks / comments: authenticated read + write (API enforces RBAC).
create policy "projects readable" on public.projects
  for select to authenticated using (true);
create policy "projects writable" on public.projects
  for all to authenticated using (true) with check (true);

create policy "tasks readable" on public.tasks
  for select to authenticated using (true);
create policy "tasks writable" on public.tasks
  for all to authenticated using (true) with check (true);

create policy "comments readable" on public.comments
  for select to authenticated using (true);
create policy "comments writable" on public.comments
  for all to authenticated using (true) with check (true);
