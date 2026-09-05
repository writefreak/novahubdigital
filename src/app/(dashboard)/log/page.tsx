"use client";

import * as React from "react";
import { useStore, useInitStore } from "@/lib/store";
import { EntryItem } from "@/components/log/entry-item";
import { formatDay, todayStr } from "@/lib/utils";
import { Entry } from "@/lib/types";

export default function LogPage() {
  useInitStore();
  const entries = useStore((s) => s.entries);
  const [date, setDate] = React.useState(todayStr());
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const dayEntries = entries.filter((e) => e.date === date);

  const uniqueDates = Array.from(new Set(entries.map((e) => e.date))).sort(
    (a, b) => b.localeCompare(a),
  );
  if (!uniqueDates.includes(todayStr())) uniqueDates.unshift(todayStr());

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingEntry, setEditingEntry] = React.useState<Entry | null>(null);

  function handleEdit(entry: Entry) {
    setEditingEntry(entry);
    setFormOpen(true);
  }

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = date === todayStr() ? "Today" : formatDay(date);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-xl md:text-2xl font-bold tracking-tight">
          Daily Log
        </h1>
        <p className="mt-1 text-xs md:text-sm text-muted-foreground">
          Every sale and expense, recorded as it happens.
        </p>
      </div>

      {/* Streamlined Mobile Dropdown */}
      <div ref={dropdownRef} className="relative block md:hidden w-full">
        <button
          type="button"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-full border border-border/80 bg-card/60 px-4 py-2 text-xs font-semibold text-foreground backdrop-blur-md shadow-sm transition-all active:scale-[0.98] hover:border-accent/40"
        >
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">{selectedLabel}</span>
          </div>

          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-muted/60 text-muted-foreground">
            <svg
              className={`h-3 w-3 transition-transform duration-200 ${
                dropdownOpen ? "rotate-180 text-foreground" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-60 overflow-y-auto rounded-2xl border border-border bg-card/95 p-1.5 shadow-xl backdrop-blur-xl animate-in fade-in-0 zoom-in-95">
            {uniqueDates.map((d) => {
              const label = d === todayStr() ? "Today" : formatDay(d);
              const isSelected = d === date;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDate(d);
                    setDropdownOpen(false);
                  }}
                  className={
                    "flex w-full items-center justify-between rounded-xl px-3.5 py-2 text-xs font-medium transition-all " +
                    (isSelected
                      ? "bg-accent text-accent-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground")
                  }
                >
                  <span>{label}</span>
                  {isSelected && (
                    <div className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Pills */}
      <div className="hidden md:flex flex-wrap gap-2">
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
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-xs md:text-sm text-muted-foreground">
          No entries for this day yet. Tap the + button to log a sale or
          expense.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {dayEntries.map((entry, i) => (
            <EntryItem
              key={entry.id}
              entry={entry}
              index={i}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
