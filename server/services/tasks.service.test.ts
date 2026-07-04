import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockSupabaseFrom } from "../test/supabaseMock";

const fromMock = vi.fn();
vi.mock("../db/client", () => ({
  supabaseAdmin: { from: (...args: [string]) => fromMock(...args) },
}));

describe("tasks.service", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  describe("getById", () => {
    it("returns the task when found", async () => {
      const task = { id: "t1", title: "Fix bug" };
      fromMock.mockImplementation(
        mockSupabaseFrom({ tasks: { data: task, error: null } }),
      );

      const { getById } = await import("./tasks.service");
      await expect(getById("t1")).resolves.toEqual(task);
    });

    it("throws NotFoundError when the task does not exist", async () => {
      fromMock.mockImplementation(
        mockSupabaseFrom({ tasks: { data: null, error: null } }),
      );

      const { getById } = await import("./tasks.service");
      await expect(getById("missing")).rejects.toThrow("not found");
    });
  });

  describe("listAll", () => {
    it("returns the paginated result shape", async () => {
      const rows = [{ id: "t1" }, { id: "t2" }];
      fromMock.mockImplementation(
        mockSupabaseFrom({ tasks: { data: rows, error: null, count: 42 } }),
      );

      const { listAll } = await import("./tasks.service");
      const result = await listAll(1, 20);

      expect(result).toEqual({ data: rows, total: 42, page: 1, limit: 20 });
    });
  });

  describe("listByAssignee", () => {
    it("scopes the query to the given userId and returns paginated results", async () => {
      const rows = [{ id: "t3", assignee_id: "u-9" }];
      const eqSpy = vi.fn().mockReturnThis();
      fromMock.mockImplementation(() => ({
        select: vi.fn().mockReturnThis(),
        eq: eqSpy,
        order: vi.fn().mockReturnThis(),
        range: vi.fn(() =>
          Promise.resolve({ data: rows, error: null, count: 1 }),
        ),
      }));

      const { listByAssignee } = await import("./tasks.service");
      const result = await listByAssignee("u-9", 1, 20);

      expect(eqSpy).toHaveBeenCalledWith("assignee_id", "u-9");
      expect(result).toEqual({ data: rows, total: 1, page: 1, limit: 20 });
    });
  });

  describe("listByProject", () => {
    it("caps the result at 200 rows via .limit(200)", async () => {
      const limitSpy = vi.fn(() =>
        Promise.resolve({ data: [], error: null }),
      );
      fromMock.mockImplementation((table: string) => {
        if (table === "projects") {
          return mockSupabaseFrom({
            projects: { data: { id: "p1" }, error: null },
          })(table);
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: limitSpy,
        };
      });

      const { listByProject } = await import("./tasks.service");
      await listByProject("p1");

      expect(limitSpy).toHaveBeenCalledWith(200);
    });

    it("throws NotFoundError when the project does not exist", async () => {
      fromMock.mockImplementation(
        mockSupabaseFrom({ projects: { data: null, error: null } }),
      );

      const { listByProject } = await import("./tasks.service");
      await expect(listByProject("missing")).rejects.toThrow("not found");
    });
  });
});
