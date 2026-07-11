import { beforeEach, describe, expect, it, vi } from "vitest";
import { encodeCursor } from "../lib/pagination";
import { mockSupabaseFrom } from "../test/supabaseMock";

const fromMock = vi.fn();
vi.mock("../db/client", () => ({
  supabaseAdmin: { from: (...args: [string]) => fromMock(...args) },
}));

describe("comments.service listByTask", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it("returns nextCursor when a full page comes back", async () => {
    const rows = Array.from({ length: 20 }, (_, i) => ({
      id: `c${i}`,
      created_at: `2026-07-04T10:00:${String(i).padStart(2, "0")}.000Z`,
    }));
    fromMock.mockImplementation(
      mockSupabaseFrom({
        tasks: { data: { id: "task-1" }, error: null },
        comments: { data: rows, error: null },
      }),
    );

    const { listByTask } = await import("./comments.service");
    const result = await listByTask("task-1", undefined, 20);

    expect(result.data).toEqual(rows);
    const lastRow = rows[rows.length - 1]!;
    expect(result.nextCursor).toBe(encodeCursor(lastRow));
  });

  it("returns nextCursor: null when the page is not full (end of feed)", async () => {
    const rows = [{ id: "c1", created_at: "2026-07-04T10:00:00.000Z" }];
    fromMock.mockImplementation(
      mockSupabaseFrom({
        tasks: { data: { id: "task-1" }, error: null },
        comments: { data: rows, error: null },
      }),
    );

    const { listByTask } = await import("./comments.service");
    const result = await listByTask("task-1", undefined, 20);

    expect(result.nextCursor).toBeNull();
  });

  it("applies an .or() tiebreak filter when a cursor is passed", async () => {
    const orSpy = vi.fn().mockReturnThis();
    fromMock.mockImplementation((table: string) => {
      if (table === "tasks") {
        return mockSupabaseFrom({
          tasks: { data: { id: "task-1" }, error: null },
        })(table);
      }
      return {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        or: orSpy,
        then: (resolve: (v: unknown) => unknown) =>
          Promise.resolve({ data: [], error: null }).then(resolve),
      };
    });

    const cursor = encodeCursor({
      created_at: "2026-07-04T10:00:00.000Z",
      id: "c5",
    });
    const { listByTask } = await import("./comments.service");
    await listByTask("task-1", cursor, 20);

    expect(orSpy).toHaveBeenCalledWith(
      "created_at.gt.2026-07-04T10:00:00.000Z,and(created_at.eq.2026-07-04T10:00:00.000Z,id.gt.c5)",
    );
  });

  it("throws NotFoundError when the task does not exist", async () => {
    fromMock.mockImplementation(
      mockSupabaseFrom({ tasks: { data: null, error: null } }),
    );

    const { listByTask } = await import("./comments.service");
    await expect(listByTask("missing")).rejects.toThrow("not found");
  });
});
