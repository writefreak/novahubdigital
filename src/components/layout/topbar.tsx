"use client";

import { useState, useRef, useEffect } from "react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Topbar() {
  const { user } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const primaryEmail = user?.primaryEmailAddress?.emailAddress ?? "";

  const initials = primaryEmail
    ? primaryEmail.substring(0, 2).toUpperCase()
    : "??";

  const today = new Intl.DateTimeFormat("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  // Close dropdown when clicking outside
  useEffect(() => {
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

  return (
    <div className="no-print sticky top-0 z-30 flex items-center justify-center px-4 pt-4 md:px-8 md:pt-6">
      <header className="relative flex w-full max-w-7xl items-center justify-between rounded-2xl border border-border bg-white/80 p-3 px-4 shadow-sm backdrop-blur-md md:px-6">
        {/* User Identity & Date Section */}
        <div className="flex items-center gap-3 min-w-0" ref={dropdownRef}>
          {/* Clickable Circle Badge */}
          <button
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-accent/10 font-mono text-sm font-bold text-accent transition-transform duration-200 active:scale-95 hover:ring-2 hover:ring-accent/20"
            aria-label="Toggle user menu"
          >
            {initials}
          </button>

          <div className="flex flex-col min-w-0">
            <p className="truncate text-xs font-semibold text-foreground md:text-sm max-w-[150px] sm:max-w-xs md:max-w-none">
              {primaryEmail}
            </p>
            <p className="text-xs text-muted-foreground">{today}</p>
          </div>

          {/* Smooth Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute top-full left-4 mt-2 w-64 rounded-xl border border-border bg-white p-4 shadow-lg z-50 flex flex-col gap-3"
              >
                <div className="flex flex-col border-b border-border pb-2">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Signed in as
                  </span>
                  <span className="truncate text-xs font-semibold text-foreground">
                    {primaryEmail}
                  </span>
                </div>

                <SignOutButton>
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent/10 px-3 py-2 text-xs font-semibold text-accent transition-all duration-200 hover:bg-accent hover:text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </button>
                </SignOutButton>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop-only Logout Button */}
        <div className="hidden md:block">
          <SignOutButton>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-accent/10 px-3 py-2 text-xs font-semibold text-accent transition-all duration-300 hover:bg-accent hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Log out</span>
            </button>
          </SignOutButton>
        </div>
      </header>
    </div>
  );
}
