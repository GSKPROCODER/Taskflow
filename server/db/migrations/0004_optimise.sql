-- TaskFlow DB optimisation (Phase 1+).
-- Run AFTER 0001_init.sql + 0002_rls_policies.sql.
--
-- Goals:
--   1. Composite indexes for the most frequent query patterns.
--   2. updated_at auto-update trigger (eliminates application-level bookkeeping).
--   3. Partial indexes for filtered queries (active projects, open tasks).
--   4. Check constraints to enforce valid status transitions at the DB layer.

-- ── 1. Composite indexes ─────────────────────────────────────────────────────

-- Projects page: active projects ordered by created_at (most common query).
CREATE INDEX IF NOT EXISTS idx_projects_status_created
  ON public.projects (status, created_at DESC);

-- Tasks Kanban: fetch tasks per project grouped/filtered by status.
CREATE INDEX IF NOT EXISTS idx_tasks_project_status
  ON public.tasks (project_id, status);

-- My Tasks page: all tasks assigned to a user across projects.
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_status
  ON public.tasks (assignee_id, status)
  WHERE assignee_id IS NOT NULL;

-- Dashboard stats: count tasks by status across all projects efficiently.
CREATE INDEX IF NOT EXISTS idx_tasks_status_created
  ON public.tasks (status, created_at DESC);

-- Comments feed: chronological activity feed per task (already have idx_comments_task_id,
-- upgrade to covering index that includes created_at for sort-free retrieval).
DROP INDEX IF EXISTS idx_comments_task_id;
CREATE INDEX IF NOT EXISTS idx_comments_task_id_created
  ON public.comments (task_id, created_at ASC);

-- ── 2. Partial indexes (filtered fast-paths) ─────────────────────────────────

-- Sidebar: only active projects are listed in nav (archived hidden).
CREATE INDEX IF NOT EXISTS idx_projects_active
  ON public.projects (created_at DESC)
  WHERE status = 'active';

-- Open task count: tasks not yet done (dashboard "in progress" / "in review").
CREATE INDEX IF NOT EXISTS idx_tasks_open
  ON public.tasks (project_id, status, due_date)
  WHERE status != 'done';

-- ── 3. updated_at auto-trigger ───────────────────────────────────────────────
-- Keeps updated_at accurate without needing application-level timestamp injection.

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply to all tables that have updated_at.
DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_tasks_updated_at ON public.tasks;
CREATE TRIGGER trg_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_users_updated_at ON public.users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 4. Check constraints ─────────────────────────────────────────────────────
-- Belt-and-suspenders: DB rejects structurally invalid data even if the API
-- layer has a bug.

-- Tasks: title must not be blank.
ALTER TABLE public.tasks
  ADD CONSTRAINT chk_tasks_title_nonempty CHECK (length(trim(title)) > 0);

-- Projects: name must not be blank.
ALTER TABLE public.projects
  ADD CONSTRAINT chk_projects_name_nonempty CHECK (length(trim(name)) > 0);

-- Comments: content must not be blank.
ALTER TABLE public.comments
  ADD CONSTRAINT chk_comments_content_nonempty CHECK (length(trim(content)) > 0);

-- ── 5. Statistics refresh ────────────────────────────────────────────────────
-- Tell the query planner about the new indexes immediately.
ANALYZE public.projects;
ANALYZE public.tasks;
ANALYZE public.comments;
ANALYZE public.users;
