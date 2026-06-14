import { useState } from "react";
import { ChevronLeft, ChevronRight, Filter, Plus } from "lucide-react";
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        subtitle="Stay organized and on track with your personalized calendar."
        actions={
          <>
            <Button variant="outline">
              <Filter /> Filter
            </Button>
            <Button>
              <Plus /> New
            </Button>
          </>
        }
      />

      <FilterPills
        pills={[
          { label: "All Schedule" },
          { label: "Events" },
          { label: "Meetings" },
          { label: "Task Reminder" },
        ]}
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
