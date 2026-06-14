import { Search } from "lucide-react";
import { PillSelect } from "@/components/ui/pill-select";

/** Filter row of pill dropdowns + search (matches the calendar/list refs). */
export function FilterPills({
  pills,
}: {
  pills: { label: string; count?: number }[];
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((p) => (
        <PillSelect
          key={p.label}
          label={p.label}
          count={p.count}
          options={[
            { label: "All", value: "all" },
            { label: "Mine", value: "mine" },
          ]}
        />
      ))}
      <div className="relative ml-auto flex items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground" />
        <input
          placeholder="Search"
          className="h-9 w-44 rounded-lg border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}
