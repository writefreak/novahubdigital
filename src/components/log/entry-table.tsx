"use client";

import * as React from "react";
import type { Entry } from "@/lib/types";
import { EntryRow } from "./entry-row";

export function EntryTable({
  entries,
  onEdit,
}: {
  entries: Entry[];
  onEdit?: (entry: Entry) => void;
}) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
            <th className="py-3 px-4">Type</th>
            <th className="py-3 px-4">Name / Item</th>
            <th className="py-3 px-4">Description</th>
            <th className="py-3 px-4">Amount</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-sm">
          {entries.map((entry, index) => (
            <EntryRow
              key={entry.id}
              entry={entry}
              index={index}
              onEdit={onEdit}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
