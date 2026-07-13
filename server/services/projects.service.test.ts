import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockSupabaseFrom } from "../test/supabaseMock";

const fromMock = vi.fn();
vi.mock("../db/client", () => ({
  supabaseAdmin: { from: (...args: [string]) => fromMock(...args) },
}));

describe("projects.service list", () => {
  beforeEach(() => {
    fromMock.mockReset();
  });

  it("returns the paginated result shape with total/page/limit", async () => {
    const rows = [{ id: "p1" }, { id: "p2" }];
    fromMock.mockImplementation(
      mockSupabaseFrom({
        projects: { data: rows, error: null, count: 7 },
      }),
    );

    const { list } = await import("./projects.service");
    const result = await list(2, 2);

    expect(result).toEqual({ data: rows, total: 7, page: 2, limit: 2 });
  });

  it("requests the correct .range() for the given page/limit", async () => {
    const rangeSpy = vi.fn(() => ({
      then: (resolve: (v: unknown) => unknown) =>
        Promise.resolve({ data: [], error: null, count: 0 }).then(resolve),
    }));
    fromMock.mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: rangeSpy,
    }));

    const { list } = await import("./projects.service");
    await list(3, 20); // page 3, limit 20 → rows 40-59

    expect(rangeSpy).toHaveBeenCalledWith(40, 59);
  });

  it("propagates a database error", async () => {
    fromMock.mockImplementation(
      mockSupabaseFrom({
        projects: { data: null, error: { message: "connection lost" } },
      }),
    );

    const { list } = await import("./projects.service");
    await expect(list(1, 20)).rejects.toThrow("connection lost");
  });
});
