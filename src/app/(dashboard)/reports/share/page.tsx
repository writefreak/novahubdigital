"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { ReportView } from "@/components/reports/report-view";

function SharedReportContent() {
  const searchParams = useSearchParams();
  const dateParam =
    searchParams.get("date") || new Date().toISOString().slice(0, 10);
  const entries = useStore((s) => s.entries);

  const dayEntries = React.useMemo(() => {
    return entries.filter((e) => e.date === dateParam);
  }, [entries, dateParam]);

  return (
    <ReportView
      entries={dayEntries}
      rangeLabel={dateParam}
      dateStr={dateParam}
    />
  );
}

export default function SharedReportPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <React.Suspense
        fallback={
          <p className="text-sm text-muted-foreground">Loading report...</p>
        }
      >
        <SharedReportContent />
      </React.Suspense>
    </div>
  );
}
