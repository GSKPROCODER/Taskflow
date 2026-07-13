import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { CalendarWeek } from "@/components/calendar/CalendarWeek";
import { FilterPills } from "@/components/calendar/FilterPills";
import { Segmented } from "@/components/ui/segmented";
import { Button } from "@/components/ui/button";

const VIEWS = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
] as const;

export function CalendarPage() {
  const [view, setView] = useState<(typeof VIEWS)[number]["value"]>("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const filters = [
    {
      id: "type",
      label: "Schedule Type",
      value: filter,
      options: [
        { label: "All Schedule", value: "all" },
        { label: "Events", value: "events" },
        { label: "Meetings", value: "meetings" },
        { label: "Task Reminder", value: "reminders" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        subtitle="Stay organized and on track with your personalized calendar."
        actions={
          <>
            <Button>
              <Plus /> New
            </Button>
          </>
        }
      />

      <FilterPills
        filters={filters}
        onFilterChange={(_, val) => setFilter(val)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm">
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="sm">
            Today
          </Button>
          <Button variant="outline" size="icon-sm">
            <ChevronRight />
          </Button>
        </div>
        <Segmented
          options={VIEWS}
          value={view}
          onChange={setView}
          layoutId="cal-view"
        />
      </div>

      <CalendarWeek />
    </div>
  );
}
