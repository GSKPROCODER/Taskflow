import { Search } from "lucide-react";
import { PillSelect } from "@/components/ui/pill-select";

export interface FilterDef {
  id: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
}

export function FilterPills({
  filters,
  onFilterChange,
  searchQuery,
  onSearchChange,
}: {
  filters: FilterDef[];
  onFilterChange: (id: string, value: string) => void;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filters.map((f) => {
        const activeLabel =
          f.value === "all"
            ? f.label
            : f.options.find((o) => o.value === f.value)?.label || f.label;

        return (
          <PillSelect
            key={f.id}
            label={activeLabel}
            options={f.options}
            onSelect={(val) => onFilterChange(f.id, val)}
          />
        );
      })}
      <div className="relative ml-auto flex items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground" />
        <input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
        />
      </div>
    </div>
  );
}
