-- TaskFlow pagination support (Phase 5).
-- Run AFTER 0001_init.sql + 0002_rls_policies.sql + 0004_optimise.sql.
--
-- Goal: comments use cursor-based pagination (infinite-scroll activity feed).
-- created_at alone is not guaranteed unique — a user comment and the
-- auto-inserted system_log comment from tasks.service.updateStatus() can land
-- in the same millisecond — so the cursor needs (created_at, id) to be
-- deterministic. Replace the existing 2-column index with a 3-column one that
-- covers this.

DROP INDEX IF EXISTS idx_comments_task_id_created;
CREATE INDEX IF NOT EXISTS idx_comments_task_id_created_id
  ON public.comments (task_id, created_at ASC, id ASC);

-- Tell the query planner about the new index immediately.
ANALYZE public.comments;
