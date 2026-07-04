import { vi } from "vitest";

export interface MockResult<T = unknown> {
  data?: T | null;
  error?: { message: string } | null;
  count?: number | null;
}

/**
 * A chainable fake mimicking Supabase's PostgrestFilterBuilder — every query
 * method (`.select()`, `.eq()`, `.order()`, ...) returns the same builder so
 * calls chain freely, and `await`-ing the builder resolves to the configured
 * result, same as the real client.
 */
function createQueryBuilder(result: MockResult) {
  const builder: Record<string, unknown> = {};
  const chainMethods = [
    "select",
    "eq",
    "order",
    "range",
    "limit",
    "gt",
    "or",
    "insert",
    "update",
    "delete",
    "single",
  ];
  for (const method of chainMethods) {
    builder[method] = vi.fn(() => builder);
  }
  builder.then = (
    resolve: (value: MockResult) => unknown,
    reject?: (reason: unknown) => unknown,
  ) => Promise.resolve(result).then(resolve, reject);
  return builder;
}

/**
 * Build a fake `supabaseAdmin.from` that returns a canned result per table
 * name. Pass an array to queue multiple results for the same table across
 * repeated `.from(table)` calls within one service call (e.g. an existence
 * check followed by the real query).
 */
export function mockSupabaseFrom(
  byTable: Record<string, MockResult | MockResult[]>,
) {
  const queues: Record<string, MockResult[]> = {};
  for (const [table, r] of Object.entries(byTable)) {
    queues[table] = Array.isArray(r) ? [...r] : [r];
  }
  return vi.fn((table: string) => {
    const queue = queues[table];
    if (!queue) {
      throw new Error(`mockSupabaseFrom: no mock configured for "${table}"`);
    }
    const result = queue.length > 1 ? queue.shift() : queue[0];
    if (!result) {
      throw new Error(`mockSupabaseFrom: exhausted queue for "${table}"`);
    }
    return createQueryBuilder(result);
  });
}
