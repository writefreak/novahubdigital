"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, LayoutGroup } from "framer-motion";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="no-print fixed bottom-4 left-1/2 z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 lg:hidden">
      <LayoutGroup id="bottom-bar">
        <div className="flex items-center justify-around rounded-full bg-card/95 px-2 py-2 shadow-md backdrop-blur border border-border/50">
          {navItems.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex h-8 w-8 items-center justify-center rounded-full"
              >
                {active && (
                  <motion.div
                    layoutId="bottom-nav-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}

                <item.icon
                  className={cn(
                    "relative z-10 h-4 w-4 transition-colors duration-200",
                    active
                      ? "text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  strokeWidth={2.25}
                />
              </Link>
            );
          })}
        </div>
      </LayoutGroup>
    </nav>
  );
}
