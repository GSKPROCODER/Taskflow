import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { staggerContainer, staggerItem } from "@/lib/motion";
export interface CalendarEvent {
  id: string;
  title: string;
  day: number;
  startHour: number;
  tone: "blue" | "violet" | "amber" | "emerald";
}

const calendarEvents: CalendarEvent[] = [];

const DAYS = [
  { label: "SUN", date: 21 },
  { label: "MON", date: 22 },
  { label: "TUE", date: 23 },
  { label: "WED", date: 24 },
  { label: "THU", date: 25 },
  { label: "FRI", date: 26 },
  { label: "SAT", date: 27 },
];
const HOURS = [7, 8, 9, 10, 11, 12, 13, 14];

const TONE: Record<CalendarEvent["tone"], string> = {
  blue: "bg-blue-50 text-blue-700 border-l-2 border-blue-400",
  violet: "bg-violet-50 text-violet-700 border-l-2 border-violet-400",
  amber: "bg-amber-50 text-amber-700 border-l-2 border-amber-400",
  emerald: "bg-emerald-50 text-emerald-700 border-l-2 border-emerald-400",
};

function hourLabel(h: number) {
  const period = h >= 12 ? "PM" : "AM";
  const display = h > 12 ? h - 12 : h;
  return `${display} ${period}`;
}

/** Week calendar grid matching the ManageAxis calendar reference. */
export function CalendarWeek() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <div className="min-w-[900px]">
        {/* Header row */}
        <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-border">
          <div />
          {DAYS.map((d) => (
            <div key={d.label} className="border-l border-border px-3 py-3">
              <p className="text-xs font-medium text-muted-foreground">
                {d.label}
              </p>
              <p className="text-lg font-semibold">{d.date}</p>
            </div>
          ))}
        </div>

        {/* Hour rows */}
        <motion.div variants={staggerContainer} initial="hidden" animate="show">
          {HOURS.map((h) => (
            <div
              key={h}
              className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-border last:border-0"
            >
              <div className="px-3 py-2 text-right text-xs text-muted-foreground">
                {hourLabel(h)}
              </div>
              {DAYS.map((_, dayIdx) => {
                const events = calendarEvents.filter(
                  (e) => e.day === dayIdx && e.startHour === h,
                );
                return (
                  <div
                    key={dayIdx}
                    className="relative min-h-[64px] border-l border-border p-1"
                  >
                    {events.map((e) => (
                      <motion.div
                        key={e.id}
                        variants={staggerItem}
                        className={cn(
                          "mb-1 rounded-md px-2 py-1 text-xs leading-tight",
                          TONE[e.tone],
                        )}
                      >
                        <p className="font-medium">{hourLabel(e.startHour)}</p>
                        <p className="line-clamp-2">{e.title}</p>
                      </motion.div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
