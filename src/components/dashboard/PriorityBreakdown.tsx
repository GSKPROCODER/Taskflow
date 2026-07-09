import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PRIORITY_ORDER = ["critical", "high", "medium", "low"] as const;

const PRIORITY_LABELS: Record<string, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export function PriorityBreakdown({ metrics }: { metrics?: { priority?: Record<string, number> } }) {
  const priorities = metrics?.priority ?? { critical: 0, high: 0, medium: 0, low: 0 };
  const total = Object.values(priorities).reduce((a: number, b: number) => a + b, 0) || 1;
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "critical": return "text-purple-600";
      case "high": return "text-rose-600";
      case "medium": return "text-amber-500";
      case "low": return "text-emerald-500";
      default: return "text-slate-200";
    }
  };

  const getLegendColor = (p: string) => {
    switch (p) {
      case "critical": return "bg-purple-600";
      case "high": return "bg-rose-600";
      case "medium": return "bg-amber-500";
      case "low": return "bg-emerald-500";
      default: return "bg-slate-200";
    }
  };

  return (
    <Card className="flex flex-col h-full shadow-sm shadow-slate-200/50 border-border bg-card rounded-[1rem] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-brand/5 hover:border-brand/20">
      <CardHeader className="pb-2 border-b border-border/50 bg-card px-6 py-4 rounded-t-[1rem]">
        <CardTitle className="text-lg font-semibold">Tasks by Priority</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-between flex-1 p-6">
        <div className="relative flex items-center justify-center h-32 w-32 ml-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {PRIORITY_ORDER.map((p) => {
              const count = priorities[p] ?? 0;
              if (count === 0) return null;
              
              const pct = count / total;
              const strokeDasharray = `${pct * circumference} ${circumference}`;
              const strokeDashoffset = -currentOffset;
              currentOffset += pct * circumference;
              
              return (
                <circle
                  key={p}
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  strokeWidth="18"
                  className={cn("stroke-current", getPriorityColor(p))}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                />
              );
            })}
          </svg>
        </div>
        <div className="flex flex-col space-y-3 mr-6">
          {PRIORITY_ORDER.map((p) => {
            const count = priorities[p] ?? 0;
            if (count === 0 && p === "critical") return null; // hide critical if 0 to match mockup
            
            return (
              <div key={p} className="flex items-center text-sm">
                <span className={cn("w-2.5 h-2.5 rounded-full mr-3", getLegendColor(p))} />
                <span className="text-muted-foreground font-medium w-16">{PRIORITY_LABELS[p]}</span>
                <span className="font-semibold text-right w-8">{count}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
