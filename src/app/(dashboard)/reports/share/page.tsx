"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { ReportView } from "@/components/reports/report-view";

export default function SharedReportPage() {
  const searchParams = useSearchParams();
  const dateParam =
    searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const entries = useStore((s) => s.entries);

  // Filter entries specifically for the targeted date
  const dayEntries = React.useMemo(() => {
    return entries.filter((e) => e.date === dateParam);
  }, [entries, dateParam]);

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <ReportView
        entries={dayEntries}
        rangeLabel={dateParam}
        dateStr={dateParam}
      />
    </div>
  );
}
