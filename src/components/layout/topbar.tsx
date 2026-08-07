"use client";

import { NovaMark } from "@/components/shared/logo";

export function Topbar() {
  const today = new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <header className="no-print bg-white sticky top-0 z-30 flex items-center justify-between border-b border-border  px-4 py-4 backdrop-blur lg:px-8 lg:py-6">
      <div className="flex flex-col gap-1 lg:hidden">
        {/* <NovaMark className="h-8 w-8" /> */}
        <p className="font-display text-sm text-accent font-bold">NovaHub</p>

        <p className="text-xs text-muted-foreground">Digital Dashboard</p>
      </div>
      <p className="text-sm font-semibold text-muted-foreground">{today}</p>
    </header>
  );
}
