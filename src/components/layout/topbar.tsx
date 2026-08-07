"use client";

import { NovaMark } from "@/components/shared/logo";

export function Topbar() {
  const today = new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <header className="no-print sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-4 backdrop-blur lg:px-8 lg:py-6">
      <div className="flex items-center gap-2.5 lg:hidden">
        <NovaMark className="h-8 w-8" />
        <p className="font-display text-base font-bold">NovaHub</p>
      </div>
      <div className="hidden lg:block">
        <p className="text-sm text-muted-foreground">Today</p>
      </div>
      <p className="text-sm font-semibold text-muted-foreground">{today}</p>
    </header>
  );
}
