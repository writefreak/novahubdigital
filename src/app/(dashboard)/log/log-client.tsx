"use client";

import * as React from "react";
import { useStore } from "@/lib/store";
import { EntryItem } from "@/components/log/entry-item";
import { formatDay, todayStr } from "@/lib/utils";

export default function LogPageClient() {
  const entries = useStore((s) => s.entries);
  const [date, setDate] = React.useState(todayStr());

  const dayEntries = entries.filter((e) => e.date === date);

  const uniqueDates = Array.from(new Set(entries.map((e) => e.date))).sort(
    (a, b) => b.localeCompare(a),
  );
  if (!uniqueDates.includes(todayStr())) uniqueDates.unshift(todayStr());

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Daily Log
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every sale and expense, recorded as it happens.
        </p>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:px-0">
        {uniqueDates.map((d) => (
          <button
            key={d}
            onClick={() => setDate(d)}
            className={
              "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors " +
              (d === date
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted")
            }
          >
            {d === todayStr() ? "Today" : formatDay(d)}
          </button>
        ))}
      </div>

      {dayEntries.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No entries for this day yet. Tap the + button to log a sale or
          expense.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {dayEntries.map((entry, i) => (
            <EntryItem key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
