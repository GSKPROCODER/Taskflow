import { describe, expect, it } from "vitest";
import {
  cursorPaginationSchema,
  decodeCursor,
  encodeCursor,
  offsetPaginationSchema,
  toRange,
} from "./pagination";

describe("toRange", () => {
  it("computes the first page as [0, limit - 1]", () => {
    expect(toRange(1, 20)).toEqual({ from: 0, to: 19 });
  });

  it("computes later pages by offsetting from the page number", () => {
    expect(toRange(3, 20)).toEqual({ from: 40, to: 59 });
  });

  it("respects a non-default limit", () => {
    expect(toRange(2, 5)).toEqual({ from: 5, to: 9 });
  });
});

describe("offsetPaginationSchema", () => {
  it("defaults page and limit when both are omitted", () => {
    expect(offsetPaginationSchema.parse({})).toEqual({ page: 1, limit: 20 });
  });

  it("coerces query-string values to numbers", () => {
    expect(offsetPaginationSchema.parse({ page: "3", limit: "50" })).toEqual({
      page: 3,
      limit: 50,
    });
  });

  it("rejects a limit above the max of 100", () => {
    expect(offsetPaginationSchema.safeParse({ limit: "101" }).success).toBe(
      false,
    );
  });

  it("rejects a page below 1", () => {
    expect(offsetPaginationSchema.safeParse({ page: "0" }).success).toBe(false);
  });
});

describe("cursorPaginationSchema", () => {
  it("defaults limit and leaves cursor undefined when omitted", () => {
    expect(cursorPaginationSchema.parse({})).toEqual({ limit: 20 });
  });

  it("accepts an explicit cursor string", () => {
    expect(cursorPaginationSchema.parse({ cursor: "abc" })).toEqual({
      cursor: "abc",
      limit: 20,
    });
  });
});

describe("encodeCursor / decodeCursor", () => {
  it("round-trips a row's created_at and id", () => {
    const row = { created_at: "2026-07-04T10:00:00.000Z", id: "task-123" };
    const cursor = encodeCursor(row);
    expect(decodeCursor(cursor)).toEqual({
      createdAt: row.created_at,
      id: row.id,
    });
  });

  it("produces an opaque, non-JSON string", () => {
    const cursor = encodeCursor({
      created_at: "2026-07-04T10:00:00.000Z",
      id: "task-123",
    });
    expect(() => JSON.parse(cursor)).toThrow();
  });

  it("throws on a malformed cursor", () => {
    expect(() => decodeCursor("not-valid-base64url-json")).toThrow();
  });

  it("throws when the decoded payload is missing required fields", () => {
    const badCursor = Buffer.from(JSON.stringify({ foo: "bar" })).toString(
      "base64url",
    );
    expect(() => decodeCursor(badCursor)).toThrow("Invalid cursor");
  });
});
