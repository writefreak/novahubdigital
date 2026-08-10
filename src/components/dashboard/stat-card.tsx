"use client";

import { motion } from "framer-motion";
import { cn, formatNaira } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  amount,
  icon: Icon,
  tone,
  emphasis = false,
  delay = 0,
  className,
}: {
  label: string;
  amount: number;
  icon: LucideIcon;
  tone: "accent" | "income" | "expense";
  emphasis?: boolean;
  delay?: number;
  className?: string;
}) {
  const toneText = {
    accent: "text-accent",
    income: "text-income",
    expense: "text-expense",
  };
  const toneBg = {
    accent: "bg-accent/40",
    income: "bg-income/40",
    expense: "bg-expense/40",
  };
  const toneSoft = {
    accent: "bg-accent-soft",
    income: "bg-income-soft",
    expense: "bg-expense-soft",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className={cn("relative", className)}
    >
      <div
        className={cn(
          "relative isolate overflow-hidden rounded-2xl border md:p-5 p-3",
          emphasis
            ? "border-transparent shadow-sm bg-accent/40"
            : "border-border bg-card shadow-sm",
        )}
      >
        {emphasis && (
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(135deg, #FF6A2E 0%, var(--accent) 55%, #E8480F 100%)",
            }}
          />
        )}
        {emphasis && (
          <div
            className="pointer-events-none absolute -right-6 -top-10 h-32 w-32 rounded-full -z-10"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%)",
            }}
          />
        )}
        {!emphasis && (
          <div
            className={cn("absolute inset-y-0 left-0 w-[3px]", toneBg[tone])}
          />
        )}

        <div
          className={cn(
            "flex items-center justify-between",
            !emphasis && "pl-2",
          )}
        >
          <p
            className={cn(
              "text-xs md:text-sm font-medium",
              emphasis ? "text-white/85" : "text-muted-foreground",
            )}
          >
            {label}
          </p>
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full",
              emphasis
                ? "bg-white/20 text-white"
                : cn(toneSoft[tone], toneText[tone]),
            )}
          >
            <Icon className="md:h-4 md:w-4 h-3 w-3" strokeWidth={2.5} />
          </div>
        </div>
        <p
          className={cn(
            "font-display mt-3 text-xl font-bold tracking-tight tabular-nums lg:text-3xl",
            emphasis ? "text-white" : "text-foreground",
            !emphasis && "pl-2",
          )}
        >
          {formatNaira(amount)}
        </p>
      </div>
    </motion.div>
  );
}
