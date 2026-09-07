"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";

export function Sidebar() {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside className="hidden lg:sticky lg:top-0 lg:z-40 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pl-3 lg:py-3">
      <motion.div
        initial={false}
        animate={{
          width: isExpanded ? "16rem" : "4rem",
          borderRadius: isExpanded ? 24 : 20, // same unit (px), no more rem/px mismatch
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        style={{
          willChange: "width, border-radius",
          transform: "translateZ(0)",
        }}
        className="flex h-full flex-col shadow-xs border border-border bg-accent-foreground py-6 px-2 overflow-hidden"
      >
        {/* Header Section */}
        {isExpanded && (
          <div
            className={`flex items-center pb-6  w-full px-2 min-h-[48px] ${isExpanded ? "border-b border-border/50" : "border-b-0"}`}
          >
            <motion.div
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "whitespace-nowrap overflow-hidden transition-all",
                !isExpanded && "pointer-events-none w-0",
              )}
            >
              <p className="font-display text-accent text-base font-bold leading-none">
                NovaHub Digital
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Report management dashboard
              </p>
            </motion.div>
          </div>
        )}

        {/* Navigation Links */}
        <nav
          className={`flex flex-col pt-6 w-full flex-1 ${isExpanded ? "gap-5" : "gap-8"}`}
        >
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={!isExpanded ? item.label : undefined}
                className={cn(
                  "flex items-center w-full transition-colors h-10 rounded-md gap-3",
                  isExpanded ? "justify-start px-2.5" : "justify-center px-0",
                  active
                    ? "bg-accent-soft text-accent"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" strokeWidth={2.25} />
                <motion.span
                  animate={{ opacity: isExpanded ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "whitespace-nowrap overflow-hidden text-sm font-semibold",
                    !isExpanded && "pointer-events-none w-0",
                  )}
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>

        {/* Toggle Button */}
        <div className="pt-4 border-t border-border/50 w-full flex items-center justify-between px-1">
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            className="flex items-center justify-between gap-2 rounded-xl text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors p-2 w-full"
          >
            <motion.span
              animate={{ opacity: isExpanded ? 1 : 0 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "whitespace-nowrap overflow-hidden",
                !isExpanded && "pointer-events-none w-0",
              )}
            >
              Collapse
            </motion.span>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.div>
          </button>
        </div>
      </motion.div>
    </aside>
  );
}
