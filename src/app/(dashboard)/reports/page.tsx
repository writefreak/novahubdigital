"use client";

import * as React from "react";
import { useStore } from "@/lib/store";
import { ReportView } from "@/components/reports/report-view";
import { todayStr } from "@/lib/utils";

type Range = "today" | "week" | "all";

export default function ReportsPage() {
  const entries = useStore((s) => s.entries);
  const [range, setRange] = React.useState<Range>("today");

  const filtered = React.useMemo(() => {
    if (range === "all") return entries;
    if (range === "today") return entries.filter((e) => e.date === todayStr());
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const cutoff = weekAgo.toISOString().slice(0, 10);
    return entries.filter((e) => e.date >= cutoff);
  }, [entries, range]);

  const rangeLabel =
    range === "today" ? "Today" : range === "week" ? "Last 7 days" : "All time";

  const options: { value: Range; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "week", label: "Last 7 days" },
    { value: "all", label: "All time" },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight">
          Reports
        </h1>
        <p className="mt-1 text-xs md:text-sm text-muted-foreground">
          A detailed summary of your admin and financial activities.
        </p>
      </div>

      <div className="no-print flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setRange(opt.value)}
            className={
              "rounded-full border px-4 py-2 text-xs md:text-sm font-semibold transition-colors " +
              (range === opt.value
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted")
            }
          >
            {opt.label}
          </button>
        ))}
      </div>

      <ReportView entries={filtered} rangeLabel={rangeLabel} />
    </div>
  );
}
