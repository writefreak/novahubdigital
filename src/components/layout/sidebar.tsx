"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";
import { NovaMark } from "@/components/shared/logo";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:sticky lg:top-0 lg:z-40 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:overflow-y-auto lg:border-r lg:border-border lg:bg-accent-foreground lg:px-4 lg:py-6 shadow-md">
      <div className="flex items-center gap-2.5 px-2 pb-4 pt-10 border-b border-border">
        <div>
          <p className="font-display text-accent text-lg font-bold leading-none">
            NovaHub Digital
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Report management dashboard
          </p>
        </div>
      </div>

      <nav className="flex flex-col gap-1 pt-10">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors",
                active
                  ? "bg-accent-soft text-accent"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-[18px] w-[18px]" strokeWidth={2.25} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
