import { z } from "zod";

// ── Offset pagination (projects) ─────────────────────────────────────────────
// Client asks for a page number; we translate that into a Postgres/Supabase
// row range. Good fit when the list is bounded and page numbers make sense.

export const offsetPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type OffsetPagination = z.infer<typeof offsetPaginationSchema>;

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

/** Convert a 1-indexed page + limit into a Supabase .range(from, to) pair. */
export function toRange(
  page: number,
  limit: number,
): { from: number; to: number } {
  const from = (page - 1) * limit;
  return { from, to: from + limit - 1 };
}

// ── Cursor pagination (comments) ─────────────────────────────────────────────
// Client asks for "everything after the last item I saw". Fits a chronological
// feed that keeps getting new rows appended while someone is scrolling —
// offset pagination would skip/duplicate rows in that case (see 0005_pagination.sql).

export const cursorPaginationSchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CursorPagination = z.infer<typeof cursorPaginationSchema>;

export interface Cursor {
  createdAt: string;
  id: string;
}

/** Encode a row's (created_at, id) into an opaque cursor string for the client. */
export function encodeCursor(row: { created_at: string; id: string }): string {
  return Buffer.from(
    JSON.stringify({ createdAt: row.created_at, id: row.id }),
  ).toString("base64url");
}

/** Decode a cursor string back into (created_at, id). Throws if malformed. */
export function decodeCursor(cursor: string): Cursor {
  const parsed: unknown = JSON.parse(
    Buffer.from(cursor, "base64url").toString("utf8"),
  );
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as Cursor).createdAt !== "string" ||
    typeof (parsed as Cursor).id !== "string"
  ) {
    throw new Error("Invalid cursor");
  }
  return parsed as Cursor;
}
