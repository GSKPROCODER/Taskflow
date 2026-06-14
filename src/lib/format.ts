/** Date/relative-time formatting helpers (Intl only — no date library). */

export function formatDate(
  value: string | Date,
  opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" },
): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", opts).format(d);
}

export function formatDateLong(value: string | Date): string {
  return formatDate(value, { month: "long", day: "numeric", year: "numeric" });
}

/** "2 hours ago" style relative time against a fixed `now` (passed in). */
export function relativeTime(value: string | Date, now: Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  const diffMs = now.getTime() - d.getTime();
  const mins = Math.round(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(d);
}
